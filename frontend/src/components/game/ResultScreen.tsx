import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { gqlClient } from "../../graphql/client";
import { SAVE_GAME_RESULT_MUTATION } from "../../graphql/mutations";

interface ResultScreenProps {
  totalTimeMs: number;
  rawMs: number;
  wrongAttempts: number;
  penaltyMs: number;
  isNewBest: boolean;
  localBest: number | null;
  onPlayAgain: () => void;
  onOpenAuth?: () => void;
}

export default function ResultScreen({
  totalTimeMs,
  rawMs,
  wrongAttempts,
  isNewBest,
  localBest,
  onPlayAgain,
  onOpenAuth,
}: ResultScreenProps) {
  const { token, user } = useAuth();
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const hasSavedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!token || hasSavedRef.current) return;

    hasSavedRef.current = true;
    setSaveStatus("saving");

    gqlClient(
      SAVE_GAME_RESULT_MUTATION,
      {
        totalTimeMs: Math.round(totalTimeMs),
        correctCount: 20,
        wrongAttempts: Math.round(wrongAttempts),
        penaltyMs: Math.round(wrongAttempts * 500),
      },
      token
    )
      .then(() => {
        setSaveStatus("saved");
      })
      .catch((err: unknown) => {
        setSaveStatus("error");
        setSaveError(err instanceof Error ? err.message : "Failed to save score");
      });
  }, [token, totalTimeMs, wrongAttempts]);

  const formattedTotal = (totalTimeMs / 1000).toFixed(2);
  const formattedRaw = (rawMs / 1000).toFixed(2);

  return (
    <div className="result-card-frame">
      <div className="hero-result-time">{formattedTotal}s</div>

      {isNewBest ? (
        <div className="result-sub-banner">
          New personal best {localBest ? `— down from ${(localBest / 1000).toFixed(2)}s` : ""}
        </div>
      ) : (
        localBest && (
          <div className="result-sub-banner">
            Personal best: {(localBest / 1000).toFixed(2)}s
          </div>
        )
      )}

      <div className="result-inline-stats">
        {wrongAttempts} mistake{wrongAttempts !== 1 ? "s" : ""} &nbsp;·&nbsp; {formattedRaw}s raw
        &nbsp;·&nbsp; 20/20 characters
      </div>

      <button className="btn-try-again" onClick={onPlayAgain}>
        Try again
      </button>

      {!user && onOpenAuth && (
        <button className="result-auth-link" onClick={onOpenAuth}>
          Log in to submit this run to the global leaderboard
        </button>
      )}

      {user && (
        <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
          {saveStatus === "saving" && "Saving score to server…"}
          {saveStatus === "saved" && "✓ Score saved to global leaderboard!"}
          {saveStatus === "error" && `Could not save score: ${saveError}`}
        </div>
      )}
    </div>
  );
}




