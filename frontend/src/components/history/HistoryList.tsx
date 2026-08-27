import { useEffect, useState } from "react";
import { gqlClient } from "../../graphql/client";
import { MY_GAME_HISTORY_QUERY } from "../../graphql/queries";
import { useAuth } from "../../context/AuthContext";

export interface GameHistoryRecord {
  id: string;
  totalTimeMs: number;
  correctCount: number;
  wrongAttempts: number;
  penaltyMs: number;
  createdAt: string;
}

interface HistoryData {
  myGameHistory: GameHistoryRecord[];
}

export default function HistoryList({ onOpenAuth }: { onOpenAuth?: () => void }) {
  const { token, user } = useAuth();
  const [history, setHistory] = useState<GameHistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await gqlClient<HistoryData>(MY_GAME_HISTORY_QUERY, undefined, token);
      setHistory(data.myGameHistory);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchHistory();
    }
  }, [token]);

  if (!user) {
    return (
      <div className="tab-card">
        <h2>📜 Personal Game History</h2>
        <div className="empty-state">
          <p>Please log in to view your saved game history.</p>
          {onOpenAuth && (
            <button className="btn-primary" style={{ marginTop: "1rem" }} onClick={onOpenAuth}>
              Log In / Register
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="tab-card">
      <div className="tab-card-header">
        <h2>📜 Personal Game History</h2>
        <button className="btn-secondary btn-sm" onClick={fetchHistory} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh 🔄"}
        </button>
      </div>

      {loading && <div className="loading-spinner">Loading your history...</div>}
      {error && <div className="auth-error">{error}</div>}

      {!loading && !error && history.length === 0 && (
        <div className="empty-state">You haven't played any logged games yet. Play one now!</div>
      )}

      {!loading && !error && history.length > 0 && (
        <div className="history-list">
          {history.map((record) => {
            const rawDate = Number(record.createdAt);
            const dateStr = !isNaN(rawDate)
              ? new Date(rawDate).toLocaleString()
              : new Date(record.createdAt).toLocaleString();
            const formattedTotal = (record.totalTimeMs / 1000).toFixed(2);
            return (
              <div key={record.id} className="history-item">
                <div className="history-main-info">
                  <span className="history-score">{formattedTotal}s</span>
                  <span className="history-date">{dateStr}</span>
                </div>
                <div className="history-sub-info">
                  <span>Wrong keypresses: {record.wrongAttempts} (+{(record.penaltyMs / 1000).toFixed(1)}s)</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
