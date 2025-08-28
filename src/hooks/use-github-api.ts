import { useState, useCallback } from "react";
import { useGitHubApi } from "../contexts/github-api-context";
import type {
  FollowersResponse,
  GitHubApiResponse,
  GitHubRateLimit,
  GitHubError,
  GitHubUser,
} from "../types/github";

// 타입 가드 함수
function isGitHubError(error: unknown): error is GitHubError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "status" in error
  );
}

function hasRateLimit(error: unknown): error is { rateLimit: GitHubRateLimit } {
  return (
    error !== null &&
    typeof error === "object" &&
    "rateLimit" in error &&
    error.rateLimit !== null &&
    typeof error.rateLimit === "object"
  );
}

interface UseGitHubApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseGitHubApiReturn<T> extends UseGitHubApiState<T> {
  execute: (...args: never[]) => Promise<T | null>;
  reset: () => void;
}

/**
 * GitHub API 호출을 위한 범용 훅
 */
function useGitHubApiCall<T, Args extends unknown[] = []>(
  apiCall: (...args: Args) => Promise<GitHubApiResponse<T>>
): UseGitHubApiReturn<T> & {
  execute: (...args: Args) => Promise<T | null>;
} {
  const { updateRateLimit } = useGitHubApi();
  const [state, setState] = useState<UseGitHubApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await apiCall(...args);

        // 성공 시 rate limit 업데이트
        if (response.rateLimit) {
          updateRateLimit(response.rateLimit);
        }

        setState({
          data: response.data,
          loading: false,
          error: null,
        });
        return response.data;
      } catch (error: unknown) {
        // 에러에 rateLimit 정보가 있으면 UI에 업데이트
        if (hasRateLimit(error)) {
          updateRateLimit(error.rateLimit);
        }

        const errorMessage = isGitHubError(error)
          ? error.message
          : "Request processing failed";

        setState({
          data: null,
          loading: false,
          error: errorMessage,
        });
        throw error;
      }
    },
    [apiCall, updateRateLimit]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  } as UseGitHubApiReturn<T> & {
    execute: (...args: Args) => Promise<T | null>;
  };
}

/**
 * 사용자 정보 조회 훅
 */
export function useGetUser() {
  const { apiClient } = useGitHubApi();

  return useGitHubApiCall<GitHubUser, [string]>((username: string) =>
    apiClient.getUserByLogin(username)
  );
}

/**
 * 팔로워 목록 조회 훅
 */
export function useGetFollowers() {
  const { apiClient } = useGitHubApi();

  return useGitHubApiCall<GitHubUser[], [string, number?]>(
    (username: string, page: number = 1) =>
      apiClient.getUserFollowers(username, page)
  );
}

/**
 * 모든 팔로워 조회 훅 (페이지네이션 자동 처리)
 */
export function useGetAllFollowers() {
  const { apiClient } = useGitHubApi();
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const { data, loading, error, execute, reset } = useGitHubApiCall<
    FollowersResponse,
    [string]
  >((username: string) => {
    setProgress({ current: 0, total: 0 });

    return apiClient
      .getAllFollowers(username, (current, total) => {
        setProgress({ current, total: total || 0 });
      })
      .then((result) => ({ data: result, rateLimit: result.rateLimit }));
  });

  const resetWithProgress = useCallback(() => {
    reset();
    setProgress({ current: 0, total: 0 });
  }, [reset]);

  return {
    data: data as FollowersResponse | null,
    loading,
    error,
    progress,
    execute,
    reset: resetWithProgress,
  };
}

/**
 * Rate Limit 조회 훅
 */
export function useGetRateLimit() {
  const { apiClient } = useGitHubApi();

  return useGitHubApiCall<{ core: GitHubRateLimit }, []>(() =>
    apiClient.getRateLimit()
  );
}

/**
 * 현재 사용자 정보 조회 훅
 */
export function useGetCurrentUser() {
  const { apiClient } = useGitHubApi();

  return useGitHubApiCall<GitHubUser, []>(() => apiClient.getCurrentUser());
}
