interface CharacterDisplayProps {
  letters: string[];
  currentIndex: number;
  wrongFlash: boolean;
}

export default function CharacterDisplay({
  letters,
  currentIndex,
  wrongFlash,
}: CharacterDisplayProps) {
  const prevChar = currentIndex > 0 ? letters[currentIndex - 1] : "";
  const currentChar = letters[currentIndex] || "";

  return (
    <div className="hero-character-box">
      {prevChar && <span className="hero-char ghost">{prevChar}</span>}
      <span className={`hero-char current ${wrongFlash ? "wrong-shake" : ""}`}>
        {currentChar}
      </span>
      <span className="hero-cursor">|</span>
    </div>
  );
}


