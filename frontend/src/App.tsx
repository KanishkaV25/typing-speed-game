import { useState, useEffect } from "react";
import { useTypingGame } from "./hooks/useTypingGame";
import { useAuth } from "./context/AuthContext";
import CharacterDisplay from "./components/game/CharacterDisplay";
import ProgressBar from "./components/game/ProgressBar";
import Timer from "./components/game/Timer";
import ResultScreen from "./components/game/ResultScreen";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import LeaderboardTable from "./components/leaderboard/LeaderboardTable";
import HistoryList from "./components/history/HistoryList";

export default function App() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"game" | "leaderboard" | "history">("game");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("typing_game_theme") as "light" | "dark") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("typing_game_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const {
    status,
    letters,
    currentIndex,
    wrongAttempts,
    penaltyMs,
    totalTimeMs,
    currentRawMs,
    isNewBest,
    localBest,
    wrongFlash,
    inputRef,
    focusInput,
    startGame,
    handleKeyDown,
  } = useTypingGame();

  const handleContainerClick = () => {
    if (!showAuthModal && activeTab === "game") {
      focusInput();
    }
  };

  return (
    <div className="game-container" onClick={handleContainerClick}>
      {/* Hidden input to capture keystrokes reliably */}
      <input
        ref={inputRef}
        type="text"
        className="hidden-input"
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (!showAuthModal && activeTab === "game") focusInput();
        }}
        autoFocus
      />

      <div className="main-wrapper">
        {/* key_pace Header Bar (Screenshot 1-5 Exact Match) */}
        <header className="app-header">
          <span className="brand-logo" onClick={() => setActiveTab("game")}>
            key_pace
          </span>

          <nav className="header-nav">
            <button className="theme-btn" onClick={toggleTheme} title="Toggle Theme">
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            <button
              className={`nav-link ${activeTab === "leaderboard" ? "active" : ""}`}
              onClick={() => setActiveTab("leaderboard")}
              title="Global Rankings"
            >
              Leaderboard
            </button>

            {user ? (
              <button className="nav-link" onClick={logout}>
                Log out
              </button>
            ) : (
              <>
                <button
                  className="nav-link"
                  onClick={() => {
                    setAuthMode("login");
                    setShowAuthModal(true);
                  }}
                >
                  Log in
                </button>
                <button
                  className="btn-signup"
                  onClick={() => {
                    setAuthMode("register");
                    setShowAuthModal(true);
                  }}
                >
                  Sign up
                </button>
              </>
            )}
          </nav>
        </header>

        {/* Tab Content */}
        {activeTab === "game" && (
          <div>
            {status === "idle" && (
              <div className="idle-container">
                <h1 className="idle-title">key_pace</h1>
                <p className="idle-desc">
                  Type 20 random letters as fast as you can. Wrong keypresses incur a +0.5s penalty.
                </p>
                <button className="btn-start-game" onClick={startGame}>
                  Start Game 🚀
                </button>
              </div>
            )}

            {status === "playing" && (
              <div className="hero-display-wrapper">
                <CharacterDisplay
                  letters={letters}
                  currentIndex={currentIndex}
                  wrongFlash={wrongFlash}
                />

                <div className="ticks-progress-container">
                  <ProgressBar currentIndex={currentIndex} totalLetters={letters.length} />
                  <div className="stats-divider" />
                  <Timer
                    rawMs={currentRawMs}
                    penaltyMs={penaltyMs}
                    wrongAttempts={wrongAttempts}
                    currentIndex={currentIndex}
                    totalLetters={letters.length}
                  />
                </div>
              </div>
            )}

            {status === "finished" && (
              <ResultScreen
                totalTimeMs={totalTimeMs}
                rawMs={currentRawMs}
                wrongAttempts={wrongAttempts}
                penaltyMs={penaltyMs}
                isNewBest={isNewBest}
                localBest={localBest}
                onPlayAgain={startGame}
                onOpenAuth={() => {
                  setAuthMode("login");
                  setShowAuthModal(true);
                }}
              />
            )}
          </div>
        )}

        {activeTab === "leaderboard" && (
          <LeaderboardTable
            onOpenAuth={() => {
              setAuthMode("login");
              setShowAuthModal(true);
            }}
          />
        )}

        {activeTab === "history" && (
          <HistoryList
            onOpenAuth={() => {
              setAuthMode("login");
              setShowAuthModal(true);
            }}
          />
        )}
      </div>

      {/* Footer (Screenshot 1-5 Exact Match) */}
      <footer className="app-footer">
        <span>© 2024 key_pace</span>
        <span>
          <span className="footer-key-badge">ESC</span> Restart
        </span>
        <span>
          <span className="footer-key-badge">TAB</span> Skip
        </span>
      </footer>

      {/* Auth Modal Overlay */}
      {showAuthModal && (
        <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAuthModal(false)}>
              ✕
            </button>
            {authMode === "login" ? (
              <LoginForm
                onSuccess={() => setShowAuthModal(false)}
                onSwitchToRegister={() => setAuthMode("register")}
              />
            ) : (
              <RegisterForm
                onSuccess={() => setShowAuthModal(false)}
                onSwitchToLogin={() => setAuthMode("login")}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}




