import { Globe } from "lucide-react";
import { useLanguage } from "../../contexts/language-context";
import { cn } from "../../utils/helpers";

export function LanguageToggle() {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className={cn(
        "relative flex h-10 items-center space-x-2 px-3",
        "rounded-lg border border-gray-200 bg-white text-gray-600",
        "hover:bg-gray-50 hover:text-gray-900",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        "transition-all duration-200",
        "dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400",
        "dark:hover:bg-gray-700 dark:hover:text-gray-100",
        "dark:focus:ring-offset-gray-900"
      )}
      title={t("language.toggle")}
      aria-label={t("language.toggle")}
    >
      <Globe size={16} />
      <span className="text-sm font-medium">
        {language === "ko" ? "한국어" : "English"}
      </span>

      {/* Language indicator */}
      <div className="flex space-x-0.5">
        <div
          className={cn(
            "h-1.5 w-1.5 rounded-full transition-colors duration-200",
            language === "en" ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
          )}
        />
        <div
          className={cn(
            "h-1.5 w-1.5 rounded-full transition-colors duration-200",
            language === "ko" ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
          )}
        />
      </div>
    </button>
  );
}
