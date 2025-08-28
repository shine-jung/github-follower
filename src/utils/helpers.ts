import { clsx, type ClassValue } from "clsx";
import { format, formatDistanceToNow } from "date-fns";
import { ko, enUS } from "date-fns/locale";
import type { Language } from "../types/app";

/**
 * 조건부 클래스명을 결합하는 유틸리티 함수
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * 지연 실행을 위한 Promise 기반 함수
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 안전한 JSON 파싱
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * 로컬스토리지 안전 접근
 */
export function safeLocalStorage(
  key: string,
  defaultValue: string = ""
): string {
  try {
    return localStorage.getItem(key) ?? defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * 날짜 포매팅 (언어별)
 */
export function formatDate(
  date: Date | string,
  language: Language = "ko"
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const locale = language === "ko" ? ko : enUS;

  return format(dateObj, "PPP", { locale });
}

/**
 * 상대적 시간 표시 (언어별)
 */
export function formatRelativeTime(
  date: Date | string,
  language: Language = "ko"
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const locale = language === "ko" ? ko : enUS;

  return formatDistanceToNow(dateObj, {
    addSuffix: true,
    locale,
  });
}

/**
 * GitHub 사용자명 유효성 검사
 */
export function isValidGitHubUsername(username: string): boolean {
  // GitHub username 규칙: 알파벳, 숫자, 하이픈만 허용, 하이픈으로 시작/끝나면 안됨
  const regex = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
  return regex.test(username) && username.length <= 39;
}

/**
 * GitHub 토큰 유효성 검사 (기본적인 형식 확인)
 */
export function isValidGitHubToken(token: string): boolean {
  // Personal Access Token 형식 확인
  if (token.startsWith("ghp_")) {
    return token.length === 40; // classic PAT
  }
  if (token.startsWith("github_pat_")) {
    return token.length > 40; // fine-grained PAT
  }
  // legacy format (40 characters, hex)
  const legacyRegex = /^[a-f0-9]{40}$/i;
  return legacyRegex.test(token);
}

/**
 * Rate limit 남은 시간 계산
 */
export function getRateLimitResetTime(resetTimestamp: number): string {
  const resetDate = new Date(resetTimestamp * 1000);
  const now = new Date();
  const diff = resetDate.getTime() - now.getTime();

  if (diff <= 0) return "now";

  const minutes = Math.ceil(diff / (1000 * 60));
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.ceil(minutes / 60);
  return `${hours} hr`;
}

/**
 * 안전한 배열 비교 (순서 무관)
 */
export function arrayDifference<T>(
  arr1: T[],
  arr2: T[],
  keyFn: (item: T) => string | number
): T[] {
  const set2 = new Set(arr2.map(keyFn));
  return arr1.filter((item) => !set2.has(keyFn(item)));
}

/**
 * 문자열 자르기 (말줄임표 추가)
 */
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

/**
 * 숫자를 K, M 단위로 포매팅
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

/**
 * URL에서 GitHub 사용자명 추출
 */
export function extractGitHubUsername(url: string): string | null {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname !== "github.com") return null;

    const pathSegments = urlObj.pathname.split("/").filter(Boolean);
    if (pathSegments.length === 0) return null;

    const username = pathSegments[0];
    return isValidGitHubUsername(username) ? username : null;
  } catch {
    return null;
  }
}

/**
 * 복사하기 유틸리티
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
      return true;
    } catch {
      return false;
    }
  }
}
