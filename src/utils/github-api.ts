import type {
  GitHubUser,
  GitHubRateLimit,
  GitHubApiResponse,
  GitHubError,
  FollowersResponse,
  ApiConfig,
} from "../types/github";
import { GITHUB_API } from "./constants";

class GitHubApiClient {
  private config: ApiConfig;

  constructor(token?: string) {
    this.config = {
      token,
      baseUrl: GITHUB_API.BASE_URL,
      userAgent: GITHUB_API.USER_AGENT,
    };
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": this.config.userAgent,
    };

    if (this.config.token) {
      headers["Authorization"] = `Bearer ${this.config.token}`;
    }

    return headers;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<GitHubApiResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    const rateLimit = this.extractRateLimit(response);

    if (!response.ok) {
      const error: GitHubError = await response.json().catch(() => ({
        message: `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
      }));

      // Rate limit exceeded (403) 에러 처리
      if (response.status === 403 && rateLimit && rateLimit.remaining === 0) {
        throw {
          ...error,
          isRateLimitExceeded: true,
          rateLimit: {
            ...rateLimit,
            remaining: 0,
          },
        };
      }

      throw {
        ...error,
        rateLimit,
      };
    }

    const data = await response.json();

    return {
      data,
      rateLimit,
    };
  }

  private extractRateLimit(response: Response): GitHubRateLimit | undefined {
    const limit = response.headers.get("x-ratelimit-limit");
    const remaining = response.headers.get("x-ratelimit-remaining");
    const reset = response.headers.get("x-ratelimit-reset");
    const used = response.headers.get("x-ratelimit-used");
    const resource = response.headers.get("x-ratelimit-resource");

    if (!limit || !remaining || !reset) return undefined;

    return {
      limit: parseInt(limit, 10),
      remaining: parseInt(remaining, 10),
      reset: parseInt(reset, 10),
      used: used ? parseInt(used, 10) : 0,
      resource: resource || "core",
    };
  }

  /**
   * 현재 인증된 사용자 정보 조회
   */
  async getCurrentUser(): Promise<GitHubApiResponse<GitHubUser>> {
    return this.makeRequest<GitHubUser>(GITHUB_API.ENDPOINTS.USER);
  }

  /**
   * 사용자명으로 사용자 정보 조회
   */
  async getUserByLogin(
    username: string
  ): Promise<GitHubApiResponse<GitHubUser>> {
    const endpoint = GITHUB_API.ENDPOINTS.USER_BY_LOGIN.replace(
      "{username}",
      username
    );
    return this.makeRequest<GitHubUser>(endpoint);
  }

  /**
   * 사용자의 팔로워 목록 조회 (페이지네이션)
   */
  async getUserFollowers(
    username: string,
    page: number = 1,
    perPage: number = 100
  ): Promise<GitHubApiResponse<GitHubUser[]>> {
    const endpoint = GITHUB_API.ENDPOINTS.USER_FOLLOWERS.replace(
      "{username}",
      username
    );
    const url = `${endpoint}?page=${page}&per_page=${perPage}`;
    return this.makeRequest<GitHubUser[]>(url);
  }

  /**
   * 사용자의 팔로잉 목록 조회 (페이지네이션)
   */
  async getUserFollowing(
    username: string,
    page: number = 1,
    perPage: number = 100
  ): Promise<GitHubApiResponse<GitHubUser[]>> {
    const endpoint = GITHUB_API.ENDPOINTS.USER_FOLLOWING.replace(
      "{username}",
      username
    );
    const url = `${endpoint}?page=${page}&per_page=${perPage}`;
    return this.makeRequest<GitHubUser[]>(url);
  }

  /**
   * 모든 팔로워 조회 (페이지네이션 자동 처리)
   */
  async getAllFollowers(
    username: string,
    onProgress?: (current: number, total?: number) => void
  ): Promise<FollowersResponse> {
    let allFollowers: GitHubUser[] = [];
    let page = 1;
    let hasMorePages = true;
    let lastRateLimit: GitHubRateLimit | undefined;
    const perPage = 100;

    while (hasMorePages) {
      const response = await this.getUserFollowers(username, page, perPage);
      const followers = response.data;
      lastRateLimit = response.rateLimit;

      allFollowers = [...allFollowers, ...followers];

      // 페이지네이션 계산
      hasMorePages = followers.length === perPage;

      // 진행상황 콜백
      if (onProgress) {
        onProgress(allFollowers.length);
      }

      page++;

      // Rate limit 보호를 위한 지연
      if (
        hasMorePages &&
        response.rateLimit &&
        response.rateLimit.remaining < 10
      ) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return {
      followers: allFollowers,
      totalCount: allFollowers.length,
      hasNextPage: false,
      rateLimit: lastRateLimit,
    };
  }

  /**
   * 모든 팔로잉 조회 (페이지네이션 자동 처리)
   */
  async getAllFollowing(
    username: string,
    onProgress?: (current: number, total?: number) => void
  ): Promise<FollowersResponse> {
    let allFollowing: GitHubUser[] = [];
    let page = 1;
    let hasMorePages = true;
    let lastRateLimit: GitHubRateLimit | undefined;
    const perPage = 100;

    while (hasMorePages) {
      const response = await this.getUserFollowing(username, page, perPage);
      const following = response.data;
      lastRateLimit = response.rateLimit;

      allFollowing = [...allFollowing, ...following];

      // 페이지네이션 계산
      hasMorePages = following.length === perPage;

      // 진행상황 콜백
      if (onProgress) {
        onProgress(allFollowing.length);
      }

      page++;

      // Rate limit 보호를 위한 지연
      if (
        hasMorePages &&
        response.rateLimit &&
        response.rateLimit.remaining < 10
      ) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return {
      followers: allFollowing,
      totalCount: allFollowing.length,
      hasNextPage: false,
      rateLimit: lastRateLimit,
    };
  }

  /**
   * Rate limit 상태 조회
   */
  async getRateLimit(): Promise<GitHubApiResponse<{ core: GitHubRateLimit }>> {
    return this.makeRequest<{ core: GitHubRateLimit }>(
      GITHUB_API.ENDPOINTS.RATE_LIMIT
    );
  }

  /**
   * 토큰 유효성 검증
   */
  async validateToken(): Promise<{
    valid: boolean;
    user?: GitHubUser;
    error?: string;
  }> {
    try {
      const response = await this.getCurrentUser();
      return {
        valid: true,
        user: response.data,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Token validation failed";
      return {
        valid: false,
        error: errorMessage,
      };
    }
  }

  /**
   * 토큰 업데이트
   */
  updateToken(token?: string): void {
    this.config.token = token;
  }
}

/**
 * GitHub API 클라이언트 팩토리
 */
export function createGitHubApiClient(token?: string): GitHubApiClient {
  return new GitHubApiClient(token);
}

/**
 * 기본 인스턴스 (토큰 없이 사용)
 */
export const githubApi = new GitHubApiClient();
