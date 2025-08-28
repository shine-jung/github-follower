import { useState, useCallback } from "react";
import { useGitHubApi } from "../contexts/github-api-context";
import type { GitHubUser } from "../types/github";
import type { AnalysisResult, FollowerRelationship } from "../types/app";
import useLocalStorage from "./use-local-storage";
import { STORAGE_KEYS } from "../utils/constants";

interface AnalysisProgress {
  step: string;
  progress: number; // 0-100
  current: number;
  total: number;
}

interface FollowerAnalyzerState {
  isAnalyzing: boolean;
  progress: AnalysisProgress;
  error: string | null;
  result: AnalysisResult | null;
}

export function useFollowerAnalyzer() {
  const { apiClient, updateRateLimit } = useGitHubApi();
  const [analyses, setAnalyses] = useLocalStorage<AnalysisResult[]>(
    STORAGE_KEYS.ANALYSES,
    []
  );

  const [state, setState] = useState<FollowerAnalyzerState>({
    isAnalyzing: false,
    progress: {
      step: "",
      progress: 0,
      current: 0,
      total: 0,
    },
    error: null,
    result: null,
  });

  const updateProgress = useCallback(
    (
      step: string,
      progress: number,
      current: number = 0,
      total: number = 0
    ) => {
      setState((prev) => ({
        ...prev,
        progress: { step, progress, current, total },
      }));
    },
    []
  );

  /**
   * 관계 분석 함수 - 팔로워와 팔로잉을 비교해서 관계 유형을 분류
   */
  const analyzeRelationships = (
    followers: GitHubUser[],
    following: GitHubUser[]
  ): {
    mutual: FollowerRelationship[];
    followingOnly: FollowerRelationship[];
    followerOnly: FollowerRelationship[];
  } => {
    const followerIds = new Set(followers.map((f) => f.id));
    const followingIds = new Set(following.map((f) => f.id));

    const mutual: FollowerRelationship[] = [];
    const followingOnly: FollowerRelationship[] = [];
    const followerOnly: FollowerRelationship[] = [];

    // 상호 팔로워와 나만 팔로우 분석
    following.forEach((user) => {
      const relationship: FollowerRelationship = {
        user: {
          id: user.id,
          login: user.login,
          avatar_url: user.avatar_url,
          name: user.name,
        },
        relationship: followerIds.has(user.id) ? "mutual" : "following-only",
      };

      if (relationship.relationship === "mutual") {
        mutual.push(relationship);
      } else {
        followingOnly.push(relationship);
      }
    });

    // 상대만 팔로우 분석
    followers.forEach((user) => {
      if (!followingIds.has(user.id)) {
        followerOnly.push({
          user: {
            id: user.id,
            login: user.login,
            avatar_url: user.avatar_url,
            name: user.name,
          },
          relationship: "follower-only",
        });
      }
    });

    return { mutual, followingOnly, followerOnly };
  };

  /**
   * 팔로워 관계 분석 실행
   */
  const analyzeFollowerRelationships = useCallback(
    async (targetUsername: string): Promise<AnalysisResult | null> => {
      if (state.isAnalyzing) {
        throw new Error("Analysis already in progress");
      }

      setState({
        isAnalyzing: true,
        progress: { step: "", progress: 0, current: 0, total: 0 },
        error: null,
        result: null,
      });

      try {
        // 1단계: 대상 사용자 정보 확인
        updateProgress("Checking user information...", 5);
        const userResponse = await apiClient.getUserByLogin(targetUsername);
        if (userResponse.rateLimit) {
          updateRateLimit(userResponse.rateLimit);
        }

        // 2단계: 팔로워 목록 조회
        updateProgress("Starting to fetch followers list...", 10);
        const currentFollowersResponse = await apiClient.getAllFollowers(
          targetUsername,
          (current, total) => {
            const stepProgress = 10 + (current / (total || current)) * 40; // 10~50%
            updateProgress(
              `Fetching followers ${current}/${total || "?"}...`,
              stepProgress,
              current,
              total
            );
          }
        );
        if (currentFollowersResponse.rateLimit) {
          updateRateLimit(currentFollowersResponse.rateLimit);
        }

        // 3단계: 팔로잉 목록 조회
        updateProgress("Starting to fetch following list...", 50);
        const currentFollowingResponse = await apiClient.getAllFollowing(
          targetUsername,
          (current, total) => {
            const stepProgress = 50 + (current / (total || current)) * 30; // 50~80%
            updateProgress(
              `Fetching following ${current}/${total || "?"}...`,
              stepProgress,
              current,
              total
            );
          }
        );
        if (currentFollowingResponse.rateLimit) {
          updateRateLimit(currentFollowingResponse.rateLimit);
        }

        const currentFollowers = currentFollowersResponse.followers;
        const currentFollowing = currentFollowingResponse.followers;

        // 4단계: 관계 분석
        updateProgress("Analyzing relationships...", 85);
        const relationships = analyzeRelationships(
          currentFollowers,
          currentFollowing
        );

        // 5단계: 결과 생성 및 저장
        updateProgress("Saving data...", 95);
        const analysisResult: AnalysisResult = {
          targetUser: targetUsername,
          relationships,
          stats: {
            totalFollowers: currentFollowers.length,
            totalFollowing: currentFollowing.length,
            mutualCount: relationships.mutual.length,
            followingOnlyCount: relationships.followingOnly.length,
            followerOnlyCount: relationships.followerOnly.length,
          },
          lastCheckedAt: new Date().toISOString(),
          analysisId: `analysis-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
        };

        // 분석 결과 저장 (최근 10개만 유지)
        const updatedAnalyses = [
          analysisResult,
          ...analyses.filter((a) => a.targetUser !== targetUsername),
        ].slice(0, 10);
        setAnalyses(updatedAnalyses);

        updateProgress("Analysis complete!", 100);

        setState((prev) => ({
          ...prev,
          isAnalyzing: false,
          result: analysisResult,
        }));

        return analysisResult;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error occurred during analysis";

        setState({
          isAnalyzing: false,
          progress: { step: "", progress: 0, current: 0, total: 0 },
          error: errorMessage,
          result: null,
        });
        throw error;
      }
    },
    [
      apiClient,
      analyses,
      setAnalyses,
      state.isAnalyzing,
      updateProgress,
      updateRateLimit,
    ]
  );

  /**
   * 분석 초기화
   */
  const resetAnalysis = useCallback(() => {
    setState({
      isAnalyzing: false,
      progress: { step: "", progress: 0, current: 0, total: 0 },
      error: null,
      result: null,
    });
  }, []);

  /**
   * 특정 분석 삭제
   */
  const deleteAnalysis = useCallback(
    (analysisId: string) => {
      const updatedAnalyses = analyses.filter(
        (a) => a.analysisId !== analysisId
      );
      setAnalyses(updatedAnalyses);
    },
    [analyses, setAnalyses]
  );

  return {
    ...state,
    analyses,
    analyzeFollowerRelationships,
    resetAnalysis,
    deleteAnalysis,
  };
}
