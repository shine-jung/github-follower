import { useLanguage } from "../../contexts/language-context";
import { LanguageToggle } from "./language-toggle";
import { RateLimitDisplay } from "../rate-limit/rate-limit-display";

export function Header() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <img
              src="/logo.svg"
              alt="GFC Logo"
              className="h-10 w-10 rounded-lg"
            />
            <div>
              <h1 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100">
                <span className="md:hidden">{t("app.titleShort")}</span>
                <span className="hidden md:inline">{t("app.title")}</span>
              </h1>
              <p className="hidden sm:block text-xs md:text-sm text-gray-600 dark:text-gray-400">
                <span className="lg:hidden">{t("app.descriptionShort")}</span>
                <span className="hidden lg:inline">{t("app.description")}</span>
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Rate Limit Display */}
            <div className="hidden md:block">
              <RateLimitDisplay />
            </div>

            {/* Language Toggle */}
            <div className="flex items-center">
              <LanguageToggle />
            </div>
          </div>
        </div>

        {/* Mobile Rate Limit Display */}
        <div className="pb-3 md:hidden">
          <RateLimitDisplay />
        </div>
      </div>
    </header>
  );
}
