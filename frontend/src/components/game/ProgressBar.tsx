interface ProgressBarProps {
  currentIndex: number;
  totalLetters: number;
}

export default function ProgressBar({
  currentIndex,
  totalLetters,
}: ProgressBarProps) {
  return (
    <div className="ticks-row">
      {Array.from({ length: totalLetters }).map((_, index) => {
        let status = "";
        if (index < currentIndex) {
          status = "completed";
        } else if (index === currentIndex) {
          status = "current";
        }
        return <div key={index} className={`tick-mark ${status}`} />;
      })}
    </div>
  );
}


