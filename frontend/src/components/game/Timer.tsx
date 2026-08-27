interface TimerProps {
  rawMs: number;
  penaltyMs: number;
  wrongAttempts: number;
  currentIndex: number;
  totalLetters: number;
}

export default function Timer({
  rawMs,
  penaltyMs,
  currentIndex,
  totalLetters,
}: TimerProps) {
  const totalMs = rawMs + penaltyMs;
  const totalSecNum = totalMs / 1000;
  const minutes = Math.floor(totalSecNum / 60);
  const remSec = (totalSecNum % 60).toFixed(1);
  const padSec = Number(remSec) < 10 ? `0${remSec}` : remSec;
  const timeFormatted = `0${minutes}:${padSec}s`;

  const padProg = currentIndex < 10 ? `0${currentIndex}` : `${currentIndex}`;

  return (
    <div className="live-stats-row">
      <div className="stat-item">
        <span className="stat-label">PROG</span>
        <span className="stat-value">
          {padProg} / {totalLetters}
        </span>
      </div>
      <div className="stat-item" style={{ textAlign: "right" }}>
        <span className="stat-label">TIME</span>
        <span className="stat-value">{timeFormatted}</span>
      </div>
    </div>
  );
}


