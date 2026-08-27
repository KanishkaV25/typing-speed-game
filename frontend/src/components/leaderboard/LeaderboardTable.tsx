import { useEffect, useState } from "react";
import { gqlClient } from "../../graphql/client";
import { LEADERBOARD_QUERY } from "../../graphql/queries";
import { useAuth } from "../../context/AuthContext";

export interface LeaderboardEntry {
  userId: string;
  email: string;
  bestTimeMs: number;
  gamesPlayed: number;
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
}

interface LeaderboardTableProps {
  onOpenAuth?: () => void;
}

export default function LeaderboardTable({ onOpenAuth }: LeaderboardTableProps) {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await gqlClient<LeaderboardData>(LEADERBOARD_QUERY, { limit: 10 });
      setEntries(data.leaderboard);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchLeaderboard();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="leaderboard-view">
        <div className="view-header">
          <h2>Global Rankings</h2>
          <p>Top performers across all typing modes.</p>
        </div>
        <div className="kp-error-box" style={{ marginTop: "1rem", justifyContent: "space-between" }}>
          <span>🔐 Authentication required to view the global leaderboard.</span>
          {onOpenAuth && (
            <button className="btn-signup" onClick={onOpenAuth} style={{ padding: "0.4rem 0.8rem" }}>
              Log in / Sign up
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-view">
      <div className="view-header">
        <h2>Global Rankings</h2>
        <p>Top performers across all typing modes.</p>
      </div>

      {loading && <div style={{ color: "var(--color-text-muted)", padding: "2rem 0" }}>Loading rankings...</div>}
      {error && <div className="kp-error-box">{error}</div>}

      {!loading && !error && entries.length === 0 && (
        <div style={{ color: "var(--color-text-muted)", padding: "2rem 0" }}>
          No records yet. Complete a game to claim #1 rank!
        </div>
      )}

      {!loading && !error && entries.length > 0 && (
        <table className="kp-table">
          <thead>
            <tr>
              <th style={{ width: "80px" }}>RANK</th>
              <th>PLAYER</th>
              <th className="right">BEST TIME</th>
              <th className="right">GAMES</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={entry.userId}>
                <td className="rank-num">{index + 1}</td>
                <td className="player-name">{entry.email.split("@")[0]}</td>
                <td className="right" style={{ fontWeight: 600 }}>
                  {(entry.bestTimeMs / 1000).toFixed(2)}s
                </td>
                <td className="right" style={{ color: "var(--color-text-muted)" }}>
                  {entry.gamesPlayed}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


