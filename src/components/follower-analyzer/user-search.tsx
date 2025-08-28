import React, { useState } from "react";
import {
  Search,
  User,
  ExternalLink,
  Users,
  UserPlus,
  GitFork,
} from "lucide-react";
import { useLanguage } from "../../contexts/language-context";
import { useGetUser } from "../../hooks/use-github-api";
import {
  cn,
  isValidGitHubUsername,
  extractGitHubUsername,
  formatNumber,
} from "../../utils/helpers";
import { MESSAGES } from "../../utils/constants";
import type { GitHubUser } from "../../types/github";

interface UserSearchProps {
  onUserSelect: (user: GitHubUser) => void;
  disabled?: boolean;
}

export function UserSearch({
  onUserSelect,
  disabled = false,
}: UserSearchProps) {
  const { language } = useLanguage();
  const messages = MESSAGES[language];
  const [query, setQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<GitHubUser | null>(null);

  const { loading, error, execute: searchUser, reset } = useGetUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading || disabled) return;

    // URL에서 사용자명 추출 시도
    const extractedUsername = extractGitHubUsername(query.trim());
    const username = extractedUsername || query.trim();

    if (!isValidGitHubUsername(username)) {
      return;
    }

    try {
      const userData = await searchUser(username);
      if (userData) {
        setSelectedUser(userData);
      }
    } catch {
      setSelectedUser(null);
    }
  };

  const handleUserSelect = () => {
    if (selectedUser) {
      onUserSelect(selectedUser);
      setQuery("");
      setSelectedUser(null);
      reset();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // 입력값이 변경되면 이전 검색 결과 초기화
    if (selectedUser) {
      setSelectedUser(null);
      reset();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={messages.search.placeholder}
            className={cn(
              "w-full pl-12 pr-4 py-4 rounded-xl border",
              "bg-white dark:bg-gray-800",
              "text-gray-900 dark:text-gray-100",
              "placeholder-gray-500 dark:placeholder-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              "transition-colors duration-200",
              "border-gray-300 dark:border-gray-600",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={loading || disabled}
          />
        </div>

        <button
          type="submit"
          disabled={!query.trim() || loading || disabled}
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2",
            "px-6 py-2 rounded-lg font-medium transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            "dark:focus:ring-offset-gray-800",
            query.trim() && !loading && !disabled
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
          )}
        >
          {loading ? messages.search.searching : messages.search.search}
        </button>
      </form>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex items-center space-x-2 text-red-700 dark:text-red-300">
            <User size={16} />
            <span className="font-medium">{messages.search.notFound}</span>
          </div>
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {messages.search.notFoundDetail.replace("{{query}}", query)}
          </p>
        </div>
      )}

      {/* User Result */}
      {selectedUser && !loading && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="p-6">
            <div className="text-center">
              <img
                src={selectedUser.avatar_url}
                alt={selectedUser.login}
                className="w-16 h-16 rounded-full mx-auto mb-4"
              />

              <div className="flex items-center justify-center space-x-2 mb-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {selectedUser.name || selectedUser.login}
                </h3>
                <a
                  href={selectedUser.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <ExternalLink size={16} />
                </a>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-3">
                @{selectedUser.login}
              </p>

              {selectedUser.bio && (
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {selectedUser.bio}
                </p>
              )}

              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <GitFork size={14} />
                  <span>{formatNumber(selectedUser.public_repos)} repos</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users size={14} />
                  <span>{formatNumber(selectedUser.followers)} followers</span>
                </div>
                <div className="flex items-center space-x-1">
                  <UserPlus size={14} />
                  <span>{formatNumber(selectedUser.following)} following</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleUserSelect}
                disabled={disabled}
                className={cn(
                  "w-full px-4 py-3 rounded-lg font-semibold transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                  "dark:focus:ring-offset-gray-800",
                  !disabled
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                )}
              >
                {messages.search.startAnalysis}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
