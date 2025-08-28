import { LanguageProvider, useLanguage } from "./contexts/language-context";
import { GitHubApiProvider } from "./contexts/github-api-context";
import { Header } from "./components/header/header";
import { TokenInput } from "./components/token-input/token-input";
import { FollowerAnalyzer } from "./components/follower-analyzer/follower-analyzer";

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
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                    clipRule="evenodd"
                  />
                </svg>
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
