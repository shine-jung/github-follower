export type Language = "ko" | "en";

export interface FollowerRelationship {
  user: {
    id: number;
    login: string;
    avatar_url: string;
    name?: string;
  };
  relationship: "mutual" | "following-only" | "follower-only";
  since?: string; // 관계 시작 시점 (추후 구현)
}

export interface AnalysisResult {
  targetUser: string;
  relationships: {
    mutual: FollowerRelationship[];
    followingOnly: FollowerRelationship[];
    followerOnly: FollowerRelationship[];
  };
  stats: {
    totalFollowers: number;
    totalFollowing: number;
    mutualCount: number;
    followingOnlyCount: number;
    followerOnlyCount: number;
  };
  lastCheckedAt: string;
  analysisId: string;
}

export interface UserSearchState {
  query: string;
  isLoading: boolean;
  error: string | null;
  user: any | null;
}

export interface TrackingState {
  isTracking: boolean;
  progress: number;
  currentStep: string;
  error: string | null;
  results: AnalysisResult | null;
}

export interface AppState {
  language: Language;
  githubToken: string | null;
  userSearch: UserSearchState;
  tracking: TrackingState;
}

export interface StoredData {
  analyses: AnalysisResult[];
  settings: {
    language: Language;
    githubToken?: string;
  };
  version: string;
}
