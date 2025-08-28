import { Clock, Zap, AlertTriangle } from "lucide-react";
import { useGitHubApi } from "../../contexts/github-api-context";
import { useLanguage } from "../../contexts/language-context";
import { cn, getRateLimitResetTime } from "../../utils/helpers";
import { MESSAGES } from "../../utils/constants";

export function RateLimitDisplay() {
  const { rateLimit, token } = useGitHubApi();
  const { language } = useLanguage();
  const messages = MESSAGES[language];

  // Default GitHub API limits when no token or rate limit data is available
  const defaultLimit = token ? 5000 : 60;
  const defaultRemaining = token ? 5000 : 60;

  const { remaining, limit, reset } = rateLimit || {
    remaining: defaultRemaining,
    limit: defaultLimit,
    reset: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
  };

  const percentage = (remaining / limit) * 100;
  const resetTime = getRateLimitResetTime(reset);
  const isLow = percentage < 20;
  const isCritical = percentage < 5;
  const isExceeded = remaining === 0;

  return (
    <div
      className={cn(
        "flex min-w-0 flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4 rounded-lg px-3 py-2 transition-all duration-200",
        "border border-gray-200 bg-white text-sm",
        "dark:border-gray-600 dark:bg-gray-800",
        isLow &&
          !isExceeded &&
          "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20",
        isCritical &&
          !isExceeded &&
          "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20",
        isExceeded &&
          "border-red-300 bg-red-100 dark:border-red-700 dark:bg-red-900/30"
      )}
    >
      <div className="flex items-center space-x-3">
        {/* Status Icon */}
        <div className="flex-shrink-0">
          {isExceeded ? (
            <AlertTriangle size={16} className="text-red-600" />
          ) : isCritical ? (
            <AlertTriangle size={16} className="text-red-500" />
          ) : isLow ? (
            <AlertTriangle size={16} className="text-orange-500" />
          ) : (
            <Zap size={16} className="text-green-500" />
          )}
        </div>

        {/* Rate Limit Info */}
        <div className="flex items-center space-x-4">
          {/* Remaining requests */}
          <div className="flex items-center space-x-1">
            <span className="text-gray-600 dark:text-gray-400">
              {messages.rateLimit.remaining}:
            </span>
            <span
              className={cn(
                "font-semibold",
                isExceeded
                  ? "text-red-700 dark:text-red-300"
                  : isCritical
                  ? "text-red-600 dark:text-red-400"
                  : isLow
                  ? "text-orange-600 dark:text-orange-400"
                  : "text-green-600 dark:text-green-400"
              )}
            >
              {remaining.toLocaleString()}/{limit.toLocaleString()}
            </span>
          </div>

          {/* Progress bar */}
          <div className="flex items-center space-x-2">
            <div className="w-16 h-1.5 bg-gray-200 rounded-full dark:bg-gray-700">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-300",
                  isExceeded
                    ? "bg-red-600"
                    : isCritical
                    ? "bg-red-500"
                    : isLow
                    ? "bg-orange-500"
                    : "bg-green-500"
                )}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 w-8 text-right">
              {Math.round(percentage)}%
            </span>
          </div>

          {/* Reset time */}
          <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
            <Clock size={14} />
            <span className="text-xs">{resetTime}</span>
          </div>
        </div>
      </div>

      {/* Rate limit exceeded warning and Auth status indicator */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0">
        {/* Rate limit exceeded warning */}
        {isExceeded && (
          <div className="flex flex-col space-y-1 text-xs text-red-700 dark:text-red-300 animate-slide-down lg:flex-1">
            <div className="font-medium">{messages.rateLimit.exceeded}</div>
            <div className="text-red-600 dark:text-red-400 line-clamp-2">
              {messages.rateLimit.exceededMessage}
            </div>
          </div>
        )}

        {/* Auth status indicator */}
        <div className="flex justify-end lg:justify-start lg:flex-shrink-0">
          {!token && !isExceeded && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
              <span>{messages.rateLimit.guest}</span>
            </div>
          )}

          {token && !isExceeded && (
            <div className="flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              <span>{messages.rateLimit.authenticated}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
