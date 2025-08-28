export const APP_NAME = "GitHub Follower Checker";

export const GITHUB_API = {
  BASE_URL: "https://api.github.com",
  USER_AGENT: "GitHub-Follower-Checker/1.0",
  RATE_LIMIT: {
    AUTHENTICATED: 5000,
    UNAUTHENTICATED: 60,
  },
  ENDPOINTS: {
    USER: "/user",
    USER_BY_LOGIN: "/users/{username}",
    FOLLOWERS: "/user/followers",
    FOLLOWING: "/user/following",
    USER_FOLLOWERS: "/users/{username}/followers",
    USER_FOLLOWING: "/users/{username}/following",
    RATE_LIMIT: "/rate_limit",
  },
} as const;

export const STORAGE_KEYS = {
  LANGUAGE: "github-follower-language",
  TOKEN: "github-follower-token",
  ANALYSES: "github-follower-analyses",
  SETTINGS: "github-follower-settings",
} as const;

export const MESSAGES = {
  en: {
    app: {
      title: "GitHub Follower Checker",
      titleShort: "Follower Checker",
      description: "Analyze GitHub follower relationships at a glance",
      descriptionShort: "Analyze follower relationships",
    },
    footer: {
      madeWith: "Made with ❤️ for GitHub community",
      description: "A service for analyzing GitHub follower relationships",
      sourceCode: "View Source Code",
    },
    common: {
      loading: "Loading...",
      error: "Something went wrong",
      retry: "Retry",
      cancel: "Cancel",
      confirm: "Confirm",
      close: "Close",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      copy: "Copy",
      search: "Search",
      expand: "Expand",
      collapse: "Collapse",
    },

    language: {
      korean: "한국어",
      english: "English",
      toggle: "Toggle Language",
    },
    token: {
      title: "GitHub Token",
      placeholder: "Enter your GitHub Personal Access Token",
      help: "You can use without token, but with API limitations",
      connected: "Connected: @{{username}}",
      validating: "Validating...",
      save: "Save Token",
      collapse: "Collapse",
      remove: "Remove Token",
      noTokenNotice: "You can use this without a token!",
      tokenBenefits:
        "But with a token, you can make more API requests. Create a",
      validation: {
        invalid: "Invalid token",
        expired: "Expired token",
        noPermission: "Insufficient permissions",
      },
    },
    rateLimit: {
      remaining: "Remaining",
      resetTime: "Reset time",
      guest: "Guest",
      authenticated: "Auth",
      exceeded: "API Rate Limit Exceeded",
      exceededMessage:
        "GitHub API rate limit has been exceeded. Authenticated requests get a higher rate limit.",
      resetIn: "Reset in",
    },
    search: {
      placeholder: "Enter GitHub username",
      notFound: "User not found",
      searching: "Searching...",
      search: "Search",
      notFoundDetail: "User '{{query}}' not found",
      startAnalysis: "Start Analysis",
    },
    analysis: {
      title: "GitHub Follower Relationship Analysis",
      titleShort: "Follower Analysis",
      description:
        "Enter the GitHub username you want to analyze follower relationships for",
      descriptionShort: "Enter GitHub username",
      newAnalysis: "Start New Analysis",
      inProgress: "Analyzing...",
      complete: "Analysis Complete!",
      completedTitle: "Analysis Complete! 🎉",
      completedDesc: "Follower relationship analysis for @{{user}}",
      retryAnalysis: "Analyze Again",
      exportData: "Export Data",
      relationshipOverview: "Follower Relationships Overview",
      analyzedAt: "Analyzed at: {{time}}",
      steps: {
        fetchingUser: "Fetching user information...",
        fetchingFollowers: "Fetching followers list...",
        analyzing: "Analyzing relationships...",
        saving: "Saving results...",
      },
      progress: "Progress",
      tabs: {
        overview: "Overview",
        mutual: "Mutual Followers",
        followingOnly: "Following Only",
        followerOnly: "Follower Only",
      },
      relationships: {
        mutual: "Mutual Follow",
        followingOnly: "Following Only",
        followerOnly: "Follower Only",
      },
      stats: {
        followers: "Followers",
        following: "Following",
        mutualFollow: "Mutual Follow",
        followerOnlyCount: "Follower Only",
      },
      cards: {
        healthyRelation: "Mutual Connections",
        healthyDesc: "Mutual follow with {{count}} people",
        oneWayInterest: "One-way Interest",
        oneWayDesc: "Following {{count}} people one-way",
        beingFollowed: "Being Followed",
        beingFollowedDesc: "{{count}} people follow you one-way",
      },
      emptyMessages: {
        noMutual: "No mutual followers yet",
        noFollowingOnly: "No one-way following relationships",
        noFollowerOnly: "No one-way followers",
      },
    },
  },
  ko: {
    app: {
      title: "GitHub 팔로우 체커",
      titleShort: "팔로우 체커",
      description: "GitHub 팔로워 관계를 한눈에 파악해보세요",
      descriptionShort: "팔로워 관계 분석",
    },
    footer: {
      madeWith: "GitHub 커뮤니티를 위해 ❤️로 제작",
      description: "GitHub 팔로워 관계 분석 서비스",
      sourceCode: "소스코드 보기",
    },
    common: {
      loading: "잠시만요...",
      error: "문제가 생겼어요",
      retry: "다시 시도",
      cancel: "취소",
      confirm: "확인",
      close: "닫기",
      save: "저장",
      delete: "삭제",
      edit: "수정",
      copy: "복사",
      search: "검색",
      expand: "펼치기",
      collapse: "접기",
    },

    language: {
      korean: "한국어",
      english: "English",
      toggle: "언어 변경",
    },
    token: {
      title: "GitHub 토큰",
      placeholder: "GitHub Personal Access Token을 입력하세요",
      help: "토큰 없이도 사용할 수 있지만, API 제한이 있어요",
      connected: "연결됨: @{{username}}",
      validating: "검증 중...",
      save: "토큰 저장",
      collapse: "접기",
      remove: "토큰 삭제",
      noTokenNotice: "토큰 없이도 사용 가능해요!",
      tokenBenefits:
        "하지만 토큰을 사용하시면 더 많은 API 요청을 할 수 있어요. GitHub에서",
      validation: {
        invalid: "유효하지 않은 토큰이에요",
        expired: "만료된 토큰이에요",
        noPermission: "필요한 권한이 없어요",
      },
    },
    rateLimit: {
      remaining: "남은 요청",
      resetTime: "리셋 시간",
      guest: "게스트",
      authenticated: "인증됨",
      exceeded: "API 요청 한도 초과",
      exceededMessage:
        "GitHub API 요청 한도를 모두 사용했어요. 인증된 토큰을 사용하면 더 높은 한도를 받을 수 있어요.",
      resetIn: "리셋까지",
    },
    search: {
      placeholder: "GitHub 사용자명을 입력하세요",
      notFound: "사용자를 찾을 수 없어요",
      searching: "검색 중...",
      search: "검색",
      notFoundDetail: "'{{query}}'에 해당하는 사용자를 찾을 수 없어요",
      startAnalysis: "분석 시작",
    },
    analysis: {
      title: "GitHub 팔로워 관계 분석",
      titleShort: "팔로워 분석",
      description: "팔로워 관계를 분석하고 싶은 GitHub 사용자명을 입력하세요",
      descriptionShort: "GitHub 사용자명 입력",
      newAnalysis: "새로운 분석 시작",
      inProgress: "분석 중...",
      complete: "분석 완료!",
      completedTitle: "분석 완료! 🎉",
      completedDesc: "{{user}}의 팔로워 관계 분석 결과",
      retryAnalysis: "다시 분석",
      exportData: "데이터 내보내기",
      relationshipOverview: "팔로워 관계 한눈에 보기",
      analyzedAt: "분석 완료: {{time}}",
      steps: {
        fetchingUser: "사용자 정보 가져오는 중...",
        fetchingFollowers: "팔로워 목록 가져오는 중...",
        analyzing: "관계 분석 중...",
        saving: "결과 저장 중...",
      },
      progress: "진행률",
      tabs: {
        overview: "전체 요약",
        mutual: "상호 팔로워",
        followingOnly: "나만 팔로우",
        followerOnly: "상대만 팔로우",
      },
      relationships: {
        mutual: "상호 팔로우",
        followingOnly: "나만 팔로우",
        followerOnly: "상대만 팔로우",
      },
      stats: {
        followers: "팔로워",
        following: "팔로잉",
        mutualFollow: "상호 팔로우",
        followerOnlyCount: "상대만 팔로우",
      },
      cards: {
        healthyRelation: "상호 연결",
        healthyDesc: "{{count}}명과 상호 팔로우 중이에요",
        oneWayInterest: "일방적 관심",
        oneWayDesc: "{{count}}명을 일방적으로 팔로우 중이에요",
        beingFollowed: "팔로우 받는 관계",
        beingFollowedDesc: "{{count}}명이 나를 일방적으로 팔로우해요",
      },
      emptyMessages: {
        noMutual: "아직 상호 팔로우하는 사용자가 없어요",
        noFollowingOnly: "일방적으로 팔로우하는 사용자가 없어요",
        noFollowerOnly: "나를 일방적으로 팔로우하는 사용자가 없어요",
      },
    },
  },
} as const;

export const ANIMATION_DELAYS = {
  SHORT: 150,
  MEDIUM: 300,
  LONG: 500,
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const;
