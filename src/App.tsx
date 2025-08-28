import { LanguageProvider, useLanguage } from "./contexts/language-context";
import { GitHubApiProvider } from "./contexts/github-api-context";
import { Header } from "./components/header/header";
import { TokenInput } from "./components/token-input/token-input";
import { FollowerAnalyzer } from "./components/follower-analyzer/follower-analyzer";
import { Github } from "lucide-react";

function AppContent() {
  const { t } = useLanguage();

  return (
    <GitHubApiProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
        <Header />

        <main className="container mx-auto px-4 py-8 space-y-8 flex-grow">
          {/* Token Input Section */}
          <section className="animate-fade-in">
            <TokenInput />
          </section>

          {/* Follower Analyzer Section */}
          <section className="animate-slide-up">
            <FollowerAnalyzer />
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm text-gray-600 dark:text-gray-400">
              <p>{t("footer.madeWith")}</p>
              <span className="hidden sm:inline text-gray-300 dark:text-gray-600">
                •
              </span>
              <p>{t("footer.description")}</p>
              <span className="hidden sm:inline text-gray-300 dark:text-gray-600">
                •
              </span>
              <a
                href="https://github.com/shine-jung/github-follower"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
              >
                <Github className="w-3 h-3" />
                <span>{t("footer.sourceCode")}</span>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </GitHubApiProvider>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
