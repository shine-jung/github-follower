import React, { useState } from "react";
import {
  Users,
  ExternalLink,
  Download,
  RefreshCw,
  Heart,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useLanguage } from "../../contexts/language-context";
import { cn, formatRelativeTime } from "../../utils/helpers";
import { MESSAGES } from "../../utils/constants";
import type { AnalysisResult, FollowerRelationship } from "../../types/app";

interface AnalysisResultsProps {
  result: AnalysisResult;
  onRetry?: () => void;
  loading?: boolean;
}

type TabType = "overview" | "mutual" | "following-only" | "follower-only";

interface TabInfo {
  id: TabType;
  label: string;
  icon: React.ReactNode;
  color: string;
  count: number;
}

interface UserListProps {
  users: FollowerRelationship[];
  emptyMessage: string;
}

function UserList({ users, emptyMessage }: UserListProps) {
  const { language } = useLanguage();

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  const getRelationshipBadge = (relationshipType: string) => {
    const messages = MESSAGES[language];

    switch (relationshipType) {
      case "mutual":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            {messages.analysis.relationships.mutual}
          </span>
        );
      case "following-only":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {messages.analysis.relationships.followingOnly}
          </span>
        );
      case "follower-only":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            {messages.analysis.relationships.followerOnly}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((relationship, index) => (
        <div
          key={`${relationship.user.id}-${index}`}
          className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <img
            src={relationship.user.avatar_url}
            alt={relationship.user.login}
            className="w-16 h-16 rounded-full mb-3"
          />

          <div className="text-center min-w-0 w-full">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
                {relationship.user.name || relationship.user.login}
              </span>
              <a
                href={`https://github.com/${relationship.user.login}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0"
                title="GitHub 프로필 보기"
              >
                <ExternalLink size={14} />
              </a>
            </div>
            {relationship.user.name && (
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 truncate">
                @{relationship.user.login}
              </div>
            )}
          </div>

          <div className="mt-2">
            {getRelationshipBadge(relationship.relationship)}
          </div>
        </div>
      ))}
    </div>
  );
}

export function AnalysisResults({
  result,
  onRetry,
  loading = false,
}: AnalysisResultsProps) {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const messages = MESSAGES[language];

  const handleExportData = () => {
    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `github-analysis-${result.targetUser}-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const tabs: TabInfo[] = [
    {
      id: "overview",
      label: messages.analysis.tabs.overview,
      icon: <Users size={16} />,
      color: "text-gray-600 dark:text-gray-400",
      count: 0,
    },
    {
      id: "mutual",
      label: messages.analysis.tabs.mutual,
      icon: <Heart size={16} />,
      color: "text-green-600 dark:text-green-400",
      count: result.stats?.mutualCount || 0,
    },
    {
      id: "following-only",
      label: messages.analysis.tabs.followingOnly,
      icon: <ArrowRight size={16} />,
      color: "text-blue-600 dark:text-blue-400",
      count: result.stats?.followingOnlyCount || 0,
    },
    {
      id: "follower-only",
      label: messages.analysis.tabs.followerOnly,
      icon: <ArrowLeft size={16} />,
      color: "text-purple-600 dark:text-purple-400",
      count: result.stats?.followerOnlyCount || 0,
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {messages.analysis.completedTitle}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {messages.analysis.completedDesc.replace(
                  "{{user}}",
                  result.targetUser
                )}
              </p>
            </div>
            <div className="flex space-x-2">
              {onRetry && (
                <button
                  onClick={onRetry}
                  disabled={loading}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg",
                    "border border-gray-300 dark:border-gray-600",
                    "text-gray-700 dark:text-gray-300",
                    "hover:bg-gray-50 dark:hover:bg-gray-700",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500",
                    "transition-colors duration-200",
                    loading && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <RefreshCw
                    size={16}
                    className={loading ? "animate-spin" : ""}
                  />
                  <span>{messages.analysis.retryAnalysis}</span>
                </button>
              )}
              <button
                onClick={handleExportData}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-lg",
                  "bg-blue-600 text-white hover:bg-blue-700",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                  "dark:focus:ring-offset-gray-800",
                  "transition-colors duration-200"
                )}
              >
                <Download size={16} />
                <span>{messages.analysis.exportData}</span>
              </button>
            </div>
          </div>

          {/* Overview Stats */}
          {result.stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {result.stats.totalFollowers}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {messages.analysis.stats.followers}
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {result.stats.totalFollowing}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {messages.analysis.stats.following}
                </div>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {result.stats.mutualCount}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  {messages.analysis.stats.mutualFollow}
                </div>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {result.stats.followerOnlyCount}
                </div>
                <div className="text-sm text-purple-600 dark:text-purple-400">
                  {messages.analysis.stats.followerOnlyCount}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="px-6">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap",
                    "transition-colors duration-200",
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  )}
                >
                  <span
                    className={
                      activeTab === tab.id
                        ? "text-blue-600 dark:text-blue-400"
                        : tab.color
                    }
                  >
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        activeTab === tab.id
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      )}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {messages.analysis.relationshipOverview}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {messages.analysis.analyzedAt.replace(
                    "{{time}}",
                    formatRelativeTime(result.lastCheckedAt, language)
                  )}
                </p>
              </div>

              {result.stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-green-200 dark:border-green-800 rounded-lg bg-green-50 dark:bg-green-900/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <Heart
                        size={20}
                        className="text-green-600 dark:text-green-400"
                      />
                      <span className="font-medium text-green-800 dark:text-green-200">
                        {messages.analysis.cards.healthyRelation}
                      </span>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {messages.analysis.cards.healthyDesc.replace(
                        "{{count}}",
                        result.stats.mutualCount.toString()
                      )}
                    </p>
                  </div>

                  <div className="p-4 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <ArrowRight
                        size={20}
                        className="text-blue-600 dark:text-blue-400"
                      />
                      <span className="font-medium text-blue-800 dark:text-blue-200">
                        {messages.analysis.cards.oneWayInterest}
                      </span>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {messages.analysis.cards.oneWayDesc.replace(
                        "{{count}}",
                        result.stats.followingOnlyCount.toString()
                      )}
                    </p>
                  </div>

                  <div className="p-4 border border-purple-200 dark:border-purple-800 rounded-lg bg-purple-50 dark:bg-purple-900/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <ArrowLeft
                        size={20}
                        className="text-purple-600 dark:text-purple-400"
                      />
                      <span className="font-medium text-purple-800 dark:text-purple-200">
                        {messages.analysis.cards.beingFollowed}
                      </span>
                    </div>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      {messages.analysis.cards.beingFollowedDesc.replace(
                        "{{count}}",
                        result.stats.followerOnlyCount.toString()
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "mutual" && result.relationships && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                {messages.analysis.tabs.mutual} (
                {result.stats?.mutualCount || 0}
                {language === "ko" ? "명" : ""})
              </h3>
              <UserList
                users={result.relationships.mutual}
                emptyMessage={messages.analysis.emptyMessages.noMutual}
              />
            </div>
          )}

          {activeTab === "following-only" && result.relationships && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                {messages.analysis.tabs.followingOnly} (
                {result.stats?.followingOnlyCount || 0}
                {language === "ko" ? "명" : ""})
              </h3>
              <UserList
                users={result.relationships.followingOnly}
                emptyMessage={messages.analysis.emptyMessages.noFollowingOnly}
              />
            </div>
          )}

          {activeTab === "follower-only" && result.relationships && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                {messages.analysis.tabs.followerOnly} (
                {result.stats?.followerOnlyCount || 0}
                {language === "ko" ? "명" : ""})
              </h3>
              <UserList
                users={result.relationships.followerOnly}
                emptyMessage={messages.analysis.emptyMessages.noFollowerOnly}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
