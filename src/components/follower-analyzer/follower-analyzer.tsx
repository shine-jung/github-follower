import { useState } from "react";
import { Activity, AlertCircle } from "lucide-react";
import { useLanguage } from "../../contexts/language-context";
import { useFollowerAnalyzer } from "../../hooks/use-follower-analyzer";
import { UserSearch } from "./user-search";
import { AnalysisResults } from "./analysis-results";
import type { GitHubUser } from "../../types/github";

export function FollowerAnalyzer() {
  const { t } = useLanguage();
  const {
    isAnalyzing,
    progress,
    error,
    result,
    analyzeFollowerRelationships,
    resetAnalysis,
  } = useFollowerAnalyzer();

  const [currentUser, setCurrentUser] = useState<GitHubUser | null>(null);

  const handleUserSelect = async (user: GitHubUser) => {
    setCurrentUser(user);
    resetAnalysis();

    try {
      await analyzeFollowerRelationships(user.login);
    } catch (err) {
      console.error("Analysis failed:", err);
    }
  };

  const handleRetry = async () => {
    if (currentUser) {
      resetAnalysis();
      try {
        await analyzeFollowerRelationships(currentUser.login);
      } catch (err) {
        console.error("Retry analysis failed:", err);
      }
    }
  };

  const handleReset = () => {
    resetAnalysis();
    setCurrentUser(null);
  };

  return (
    <div className="space-y-8">
      {/* Main Content */}
      {!isAnalyzing && !result && !error && (
        <div className="text-center space-y-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              <span className="md:hidden">{t("analysis.titleShort")}</span>
              <span className="hidden md:inline">{t("analysis.title")}</span>
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
              <span className="md:hidden">
                {t("analysis.descriptionShort")}
              </span>
              <span className="hidden md:inline">
                {t("analysis.description")}
              </span>
            </p>
          </div>
          <UserSearch onUserSelect={handleUserSelect} disabled={isAnalyzing} />
        </div>
      )}

      {/* Analysis Progress */}
      {isAnalyzing && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-8">
              <div className="text-center space-y-6">
                {/* Progress Icon */}
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                  <Activity
                    size={32}
                    className="text-blue-600 dark:text-blue-400 animate-pulse"
                  />
                </div>

                {/* Progress Info */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {t("analysis.inProgress")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {progress.step || t("analysis.steps.fetchingUser")}
                  </p>

                  {progress.total > 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {progress.current} / {progress.total}
                    </p>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="w-full">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>{t("analysis.progress")}</span>
                    <span>{Math.round(progress.progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${progress.progress}%` }}
                    />
                  </div>
                </div>

                {/* User Info */}
                {currentUser && (
                  <div className="flex items-center justify-center space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <img
                      src={currentUser.avatar_url}
                      alt={currentUser.login}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      @{currentUser.login} {t("analysis.inProgress")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isAnalyzing && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-800 shadow-sm">
            <div className="p-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle
                    size={32}
                    className="text-red-600 dark:text-red-400"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {t("common.error")}
                  </h3>
                  <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                </div>

                <div className="flex justify-center space-x-3">
                  <button
                    onClick={handleRetry}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
                  >
                    {t("common.retry")}
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
                  >
                    {t("analysis.newAnalysis")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && !isAnalyzing && (
        <div className="space-y-6">
          <AnalysisResults
            result={result}
            onRetry={handleRetry}
            loading={isAnalyzing}
          />

          <div className="text-center">
            <button
              onClick={handleReset}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
            >
              {t("analysis.newAnalysis")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
