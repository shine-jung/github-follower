import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { GitHubUser, GitHubRateLimit } from "../types/github";
import { createGitHubApiClient } from "../utils/github-api";
import { STORAGE_KEYS } from "../utils/constants";
import { safeLocalStorage, isValidGitHubToken } from "../utils/helpers";

interface GitHubApiContextValue {
  token: string | null;
  setToken: (token: string | null) => void;
  user: GitHubUser | null;
  rateLimit: GitHubRateLimit | null;
  isValidating: boolean;
  error: string | null;
  validateToken: (token: string) => Promise<boolean>;
  clearToken: () => void;
  refreshRateLimit: () => Promise<void>;
  updateRateLimit: (rateLimit: GitHubRateLimit) => void;
  apiClient: ReturnType<typeof createGitHubApiClient>;
}

const GitHubApiContext = createContext<GitHubApiContextValue | null>(null);

interface GitHubApiProviderProps {
  children: ReactNode;
}

export function GitHubApiProvider({ children }: GitHubApiProviderProps) {
  const [token, setTokenState] = useState<string | null>(() => {
    const savedToken = safeLocalStorage(STORAGE_KEYS.TOKEN);
    return savedToken || null;
  });

  const [user, setUser] = useState<GitHubUser | null>(null);
  const [rateLimit, setRateLimit] = useState<GitHubRateLimit | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiClient, setApiClient] = useState(() =>
    createGitHubApiClient(token ?? undefined)
  );

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);

    if (newToken) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
    } else {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }

    // API 클라이언트 업데이트
    setApiClient(createGitHubApiClient(newToken ?? undefined));
    setUser(null);
    setError(null);
  };

  const validateToken = async (tokenToValidate: string): Promise<boolean> => {
    if (!isValidGitHubToken(tokenToValidate)) {
      setError("Invalid token format");
      return false;
    }

    setIsValidating(true);
    setError(null);

    try {
      const tempClient = createGitHubApiClient(tokenToValidate);
      const result = await tempClient.validateToken();

      if (result.valid && result.user) {
        setToken(tokenToValidate);
        setUser(result.user);
        setError(null);
        return true;
      } else {
        setError(result.error || "Token validation failed");
        return false;
      }
    } catch (err: any) {
      const errorMessage =
        err.status === 401
          ? "Invalid token"
          : err.message || "Token validation error";
      setError(errorMessage);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const clearToken = () => {
    setToken(null);
    setUser(null);
    setError(null);
    setRateLimit(null);
  };

  const refreshRateLimit = async (): Promise<void> => {
    try {
      const response = await apiClient.getRateLimit();
      setRateLimit(response.data.core);
    } catch (err: any) {
      console.warn("Rate limit fetch failed:", err.message);
      // Rate limit fetch failure is not critical, so ignore
    }
  };

  const updateRateLimit = (rateLimit: GitHubRateLimit): void => {
    setRateLimit(rateLimit);
  };

  // 토큰 변경 시 자동 검증
  useEffect(() => {
    if (token && !user) {
      validateToken(token);
    }
  }, [token]);

  // Rate limit 주기적 업데이트
  useEffect(() => {
    if (!token) return;

    // 초기 Rate limit 조회
    refreshRateLimit();

    // 30초마다 Rate limit 업데이트
    const interval = setInterval(refreshRateLimit, 30000);

    return () => clearInterval(interval);
  }, [token, apiClient]);

  const value: GitHubApiContextValue = {
    token,
    setToken,
    user,
    rateLimit,
    isValidating,
    error,
    validateToken,
    clearToken,
    refreshRateLimit,
    updateRateLimit,
    apiClient,
  };

  return (
    <GitHubApiContext.Provider value={value}>
      {children}
    </GitHubApiContext.Provider>
  );
}

export function useGitHubApi(): GitHubApiContextValue {
  const context = useContext(GitHubApiContext);

  if (!context) {
    throw new Error("useGitHubApi must be used within a GitHubApiProvider");
  }

  return context;
}
