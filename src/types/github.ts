export interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  name?: string;
  bio?: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRateLimit {
  limit: number;
  remaining: number;
  reset: number;
  used: number;
  resource: string;
}

export interface GitHubApiResponse<T> {
  data: T;
  rateLimit?: GitHubRateLimit;
}

export interface GitHubError {
  message: string;
  status: number;
  documentation_url?: string;
  isRateLimitExceeded?: boolean;
  rateLimit?: GitHubRateLimit;
}

export interface FollowersResponse {
  followers: GitHubUser[];
  totalCount?: number;
  hasNextPage: boolean;
  nextCursor?: string;
  rateLimit?: GitHubRateLimit;
}

export interface ApiConfig {
  token?: string;
  baseUrl: string;
  userAgent: string;
}
