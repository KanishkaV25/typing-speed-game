import { useState, useEffect, useRef, useCallback } from "react";
import { getLocalBestScore, setLocalBestScore } from "../lib/localStorage";

export type GameStatus = "idle" | "playing" | "finished";

const TOTAL_LETTERS = 20;
const PENALTY_PER_WRONG_MS = 500;
const CHAR_SET = "abcdefghijklmnopqrstuvwxyz";

function generateRandomLetters(count: number): string[] {
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * CHAR_SET.length);
    result.push(CHAR_SET[randomIndex]);
  }
  return result;
}

export function useTypingGame() {
  const [status, setStatus] = useState<GameStatus>("idle");
  const [letters, setLetters] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [wrongAttempts, setWrongAttempts] = useState<number>(0);
  const [startTimeMs, setStartTimeMs] = useState<number | null>(null);
  const [endTimeMs, setEndTimeMs] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [isNewBest, setIsNewBest] = useState<boolean>(false);
  const [localBest, setLocalBest] = useState<number | null>(null);
  const [wrongFlash, setWrongFlash] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const wrongAttemptsRef = useRef<number>(0);

  // Load initial local best score
  useEffect(() => {
    setLocalBest(getLocalBestScore());
  }, []);

  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Update timer continuously during gameplay
  useEffect(() => {
    if (status !== "playing" || !startTimeMs) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const updateTimer = () => {
      setElapsedMs(Date.now() - startTimeMs);
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    };

    animationFrameRef.current = requestAnimationFrame(updateTimer);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [status, startTimeMs]);

  const startGame = useCallback(() => {
    const newLetters = generateRandomLetters(TOTAL_LETTERS);
    setLetters(newLetters);
    setCurrentIndex(0);
    setWrongAttempts(0);
    wrongAttemptsRef.current = 0;
    const now = Date.now();
    setStartTimeMs(now);
    setEndTimeMs(null);
    setElapsedMs(0);
    setIsNewBest(false);
    setStatus("playing");
    setLocalBest(getLocalBestScore());
    setTimeout(() => {
      focusInput();
    }, 0);
  }, [focusInput]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (status !== "playing" || currentIndex >= TOTAL_LETTERS) return;

      const key = e.key.toLowerCase();
      // Ignore control/system keys
      if (key.length !== 1 || e.ctrlKey || e.altKey || e.metaKey) {
        return;
      }

      e.preventDefault();

      const targetLetter = letters[currentIndex];

      if (key === targetLetter) {
        setWrongFlash(false);
        const nextIndex = currentIndex + 1;
        if (nextIndex === TOTAL_LETTERS) {
          const now = Date.now();
          setEndTimeMs(now);
          setStatus("finished");

          const finalRawTime = now - (startTimeMs || now);
          const finalPenalty = wrongAttemptsRef.current * PENALTY_PER_WRONG_MS;
          const finalTotal = finalRawTime + finalPenalty;

          const prevBest = getLocalBestScore();
          const beatBest = prevBest === null || finalTotal < prevBest;
          setIsNewBest(beatBest);

          setLocalBestScore(finalTotal);
          setLocalBest(getLocalBestScore());
        } else {
          setCurrentIndex(nextIndex);
        }
      } else {
        // Wrong key press -> increment penalty synchronously & in state
        wrongAttemptsRef.current += 1;
        setWrongAttempts((prev) => prev + 1);
        setWrongFlash(true);
        setTimeout(() => setWrongFlash(false), 200);
      }
    },
    [status, currentIndex, letters, startTimeMs]
  );

  const penaltyMs = wrongAttempts * PENALTY_PER_WRONG_MS;
  const currentRawMs =
    status === "finished" && startTimeMs && endTimeMs
      ? endTimeMs - startTimeMs
      : elapsedMs;
  const totalTimeMs = currentRawMs + penaltyMs;

  return {
    status,
    letters,
    currentIndex,
    wrongAttempts,
    penaltyMs,
    startTimeMs,
    endTimeMs,
    totalTimeMs,
    currentRawMs,
    isNewBest,
    localBest,
    wrongFlash,
    inputRef,
    focusInput,
    startGame,
    handleKeyDown,
  };
}


