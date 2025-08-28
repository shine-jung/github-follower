import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { Language } from "../types/app";
import { STORAGE_KEYS, MESSAGES } from "../utils/constants";
import { safeLocalStorage } from "../utils/helpers";

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

interface LanguageProviderProps {
  children: ReactNode;
}

function getInitialLanguage(): Language {
  // 로컬스토리지에서 언어 설정 확인
  const savedLanguage = safeLocalStorage(STORAGE_KEYS.LANGUAGE);
  if (savedLanguage === "ko" || savedLanguage === "en") {
    return savedLanguage;
  }

  // 브라우저 언어 확인
  if (typeof window !== "undefined" && navigator.language) {
    return navigator.language.startsWith("ko") ? "ko" : "en";
  }

  // 기본값은 영어
  return "en";
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, newLanguage);

    // HTML lang 속성 업데이트
    document.documentElement.lang = newLanguage;
  };

  const toggleLanguage = () => {
    const newLanguage = language === "ko" ? "en" : "ko";
    setLanguage(newLanguage);
  };

  /**
   * 번역 함수
   * @param key - 번역 키 (dot notation 지원)
   * @param params - 템플릿 파라미터
   */
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split(".");
    let value: unknown = MESSAGES[language];

    // 중첩된 키 탐색
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key; // 키를 그대로 반환
      }
    }

    if (typeof value !== "string") {
      console.warn(`Translation value is not a string: ${key}`);
      return key;
    }

    // 템플릿 파라미터 치환
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        const paramValue = params[paramKey];
        return paramValue !== undefined ? String(paramValue) : match;
      });
    }

    return value;
  };

  // 초기 HTML lang 설정
  React.useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value: LanguageContextValue = {
    language,
    setLanguage,
    toggleLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}
