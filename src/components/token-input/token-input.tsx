import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Key,
  Check,
  X,
  AlertCircle,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { useGitHubApi } from "../../contexts/github-api-context";
import { useLanguage } from "../../contexts/language-context";
import { cn } from "../../utils/helpers";

export function TokenInput() {
  const { token, user, isValidating, error, validateToken, clearToken } =
    useGitHubApi();
  const { t, language } = useLanguage();

  const [inputToken, setInputToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputToken.trim()) return;

    const success = await validateToken(inputToken.trim());
    if (success) {
      setInputToken("");
      setIsExpanded(false);
    }
  };

  const handleToggleExpand = () => {
    if (token) {
      // Token이 있을 때는 토큰 정보 표시/숨김
      setIsExpanded(!isExpanded);
    } else {
      // Token이 없을 때는 입력 폼 표시/숨김
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={handleToggleExpand}
        >
          <div className="flex items-center space-x-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg",
                token
                  ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
              )}
            >
              <Key size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {t("token.title")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {token
                  ? t("token.connected").replace(
                      "{{username}}",
                      user?.login || "Unknown"
                    )
                  : t("token.help")}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {token && (
              <div className="flex items-center text-green-600 dark:text-green-400">
                <Check size={16} />
              </div>
            )}
            <button
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              aria-label={
                isExpanded ? t("common.collapse") : t("common.expand")
              }
            >
              <ChevronDown
                size={18}
                className={cn(
                  "transition-transform duration-200",
                  isExpanded && "rotate-180"
                )}
              />
            </button>
          </div>
        </div>

        {/* Content */}
        {isExpanded && (
          <div className="px-4 pb-4 space-y-4">
            {!token ? (
              /* Token Input Form */
              <>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start space-x-2">
                    <AlertCircle
                      size={16}
                      className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
                    />
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                      <p className="font-medium mb-1">
                        {t("token.noTokenNotice")}
                      </p>
                      <p>
                        {t("token.tokenBenefits")}{" "}
                        <a
                          href="https://github.com/settings/tokens"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center mx-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                        >
                          Personal Access Token
                          <ExternalLink size={12} className="ml-1" />
                        </a>
                        {language === "ko" ? "을 생성하세요." : " on GitHub."}
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="relative">
                    <input
                      type={showToken ? "text" : "password"}
                      value={inputToken}
                      onChange={(e) => setInputToken(e.target.value)}
                      placeholder={t("token.placeholder")}
                      className={cn(
                        "w-full px-4 py-3 pr-12 rounded-lg border",
                        "bg-white dark:bg-gray-900",
                        "text-gray-900 dark:text-gray-100",
                        "placeholder-gray-500 dark:placeholder-gray-400",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                        "transition-colors duration-200",
                        error
                          ? "border-red-300 dark:border-red-600"
                          : "border-gray-300 dark:border-gray-600"
                      )}
                      disabled={isValidating}
                    />
                    <button
                      type="button"
                      onClick={() => setShowToken(!showToken)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      disabled={isValidating}
                    >
                      {showToken ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {error && (
                    <div className="flex items-center space-x-2 text-sm text-red-600 dark:text-red-400">
                      <X size={16} />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={!inputToken.trim() || isValidating}
                      className={cn(
                        "flex-1 px-4 py-2 rounded-lg font-medium transition-colors duration-200",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                        "dark:focus:ring-offset-gray-800",
                        inputToken.trim() && !isValidating
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                      )}
                    >
                      {isValidating ? t("token.validating") : t("token.save")}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              /* Token Info */
              <div className="space-y-4">
                {user && (
                  <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <img
                      src={user.avatar_url}
                      alt={user.login}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-medium text-green-800 dark:text-green-200">
                        {user.name || user.login}
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400">
                        @{user.login}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="flex-1 px-4 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    {t("token.collapse")}
                  </button>
                  <button
                    onClick={clearToken}
                    className="px-4 py-2 rounded-lg font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200"
                  >
                    {t("token.remove")}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
