"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { inviteConfig } from "@/lib/invite-config";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/invite/magnetic-button";

const ROWS = 6;
const COLS = 5;

const KEYBOARD_ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

const MISS_HINTS = [
  "Not quite — the syllabus would call that an interesting interpretation.",
  "Close! Like knowing the chapter title but not the footnote.",
  "Wrong combo — try channeling your best open-book energy.",
  "Hmm. The cap is still buffering. One more thesis statement?",
];

const SUCCESS_LINES = [
  "Five letters, zero regrets. Details unlocked.",
  "Honors-level guessing. Welcome to the setlist.",
  "Wordle who? You just passed the final boss of invites.",
];

type TileState = "empty" | "correct" | "present" | "absent";

function normalizeAnswer(raw: string): string {
  const u = raw.toUpperCase().replace(/[^A-Z]/g, "");
  if (u.length === COLS) return u;
  return "GRADS";
}

function scoreGuess(guess: string, answer: string): TileState[] {
  const states: TileState[] = Array(COLS).fill("absent");
  const avail = new Map<string, number>();
  for (const ch of answer) {
    avail.set(ch, (avail.get(ch) ?? 0) + 1);
  }
  for (let i = 0; i < COLS; i++) {
    if (guess[i] === answer[i]) {
      states[i] = "correct";
      avail.set(guess[i]!, (avail.get(guess[i]!) ?? 1) - 1);
    }
  }
  for (let i = 0; i < COLS; i++) {
    if (states[i] === "correct") continue;
    const ch = guess[i]!;
    const left = avail.get(ch) ?? 0;
    if (left > 0) {
      states[i] = "present";
      avail.set(ch, left - 1);
    }
  }
  return states;
}

export function WordlePuzzle({ onSolved }: { onSolved: () => void }) {
  const reduce = useReducedMotion();
  const answer = useMemo(
    () => normalizeAnswer(inviteConfig.wordleAnswer ?? "Grads"),
    [],
  );

  const [grid, setGrid] = useState<string[]>(() =>
    Array.from({ length: ROWS }, () => " ".repeat(COLS)),
  );
  const [rowStates, setRowStates] = useState<TileState[][]>(() =>
    Array.from({ length: ROWS }, () => Array(COLS).fill("empty") as TileState[]),
  );
  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  const [solved, setSolved] = useState(false);
  const [outOfTurns, setOutOfTurns] = useState(false);
  const [shakeRow, setShakeRow] = useState<number | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [hintIndex, setHintIndex] = useState(0);
  const [keyHints, setKeyHints] = useState<Record<string, "correct" | "present" | "absent">>(
    {},
  );
  const [successLine] = useState(
    () => SUCCESS_LINES[Math.floor(Math.random() * SUCCESS_LINES.length)]!,
  );

  const complete = useCallback(() => {
    setSolved(true);
    onSolved();
  }, [onSolved]);

  const submit = useCallback(() => {
    if (solved || outOfTurns || row >= ROWS) return;
    const line = grid[row]!.replace(/ /g, "");
    if (line.length !== COLS) {
      setShakeRow(row);
      window.setTimeout(() => setShakeRow(null), 450);
      return;
    }

    const states = scoreGuess(line, answer);
    setRowStates((prev) => {
      const next = [...prev];
      next[row] = states;
      return next;
    });

    setKeyHints((prev) => {
      const next = { ...prev };
      const rank = { correct: 3, present: 2, absent: 1 } as const;
      for (let i = 0; i < COLS; i++) {
        const ch = line[i]!;
        const st = states[i]!;
        if (st === "empty") continue;
        const cur = next[ch];
        const curR = cur ? rank[cur] : 0;
        if (rank[st] >= curR) next[ch] = st;
      }
      return next;
    });

    if (line === answer) {
      setSolved(true);
      window.setTimeout(() => onSolved(), 480);
      return;
    }

    if (row === ROWS - 1) {
      setOutOfTurns(true);
      setHint(
        `The word was ${answer} — you still get the party. Tap below to continue.`,
      );
      return;
    }

    const miss = MISS_HINTS[hintIndex % MISS_HINTS.length]!;
    setHintIndex((i) => i + 1);
    setHint(miss);
    setRow((r) => r + 1);
    setCol(0);
  }, [answer, grid, hintIndex, onSolved, outOfTurns, row, solved]);

  const backspace = useCallback(() => {
    if (solved || outOfTurns) return;
    if (col === 0) return;
    const r = row;
    const c = col - 1;
    setGrid((g) => {
      const next = [...g];
      const line = next[r]!;
      next[r] = line.slice(0, c) + " " + line.slice(c + 1);
      return next;
    });
    setCol(c);
  }, [col, outOfTurns, row, solved]);

  const typeLetter = useCallback(
    (letter: string) => {
      if (solved || outOfTurns || row >= ROWS) return;
      if (col >= COLS) return;
      const L = letter.toUpperCase();
      if (!/^[A-Z]$/.test(L)) return;
      setGrid((g) => {
        const next = [...g];
        const line = next[row]!;
        next[row] = line.slice(0, col) + L + line.slice(col + 1);
        return next;
      });
      setCol((c) => c + 1);
    },
    [col, outOfTurns, row, solved],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (solved || outOfTurns) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "Enter") {
        e.preventDefault();
        submit();
      } else if (e.key === "Backspace") {
        e.preventDefault();
        backspace();
      } else if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        e.preventDefault();
        typeLetter(e.key);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [backspace, outOfTurns, solved, submit, typeLetter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ type: "spring", stiffness: 200, damping: 26 }}
      className="relative z-[1] mx-auto flex w-full max-w-lg flex-col items-center gap-6 px-4"
    >
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B8860B]">
          Last pop quiz (honor system)
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#4a1520] sm:text-3xl">
          Guess the five-letter password
        </h2>
        <p className="mt-2 text-sm text-[#7a4a52]">
          Wordle rules: green is the right letter in the right spot, gold is in
          the word somewhere else, gray is a no-show. Six tries — you’ve survived
          worse curves.
        </p>
      </div>

      <div
        className="w-full max-w-[340px] rounded-3xl border border-[#722F37]/15 bg-white/90 p-4 shadow-[0_20px_50px_rgba(114,47,55,0.08),0_0_0_1px_rgba(212,175,55,0.12)_inset] backdrop-blur-md sm:p-6"
        role="group"
        aria-label="Word puzzle grid"
      >
        <div className="flex flex-col gap-2">
          {grid.map((line, ri) => (
            <motion.div
              key={ri}
              animate={
                shakeRow === ri
                  ? { x: [0, -6, 6, -4, 4, 0] }
                  : { x: 0 }
              }
              transition={{ duration: 0.45 }}
              className="grid grid-cols-5 gap-2"
            >
              {Array.from({ length: COLS }).map((_, ci) => {
                const ch = line[ci] === " " ? "" : line[ci];
                const st = rowStates[ri]![ci]!;
                const showLetter = ch !== "";
                const isActiveRow = ri === row && !solved && !outOfTurns;
                const borderActive = isActiveRow && ci === col && !ch;

                return (
                  <motion.div
                    key={ci}
                    initial={false}
                    animate={
                      st !== "empty" && ch
                        ? reduce
                          ? {}
                          : { rotateX: [12, 0], transition: { delay: ci * 0.07 } }
                        : {}
                    }
                    className={cn(
                      "flex aspect-square items-center justify-center rounded-lg border-2 text-lg font-bold uppercase tracking-tight sm:text-xl",
                      st === "empty"
                        ? borderActive
                          ? "border-[#722F37]/55 bg-white text-[#4a1520]"
                          : "border-[#722F37]/20 bg-white/80 text-[#4a1520]"
                        : st === "correct"
                          ? "border-[#166534] bg-[#166534] text-white"
                          : st === "present"
                            ? "border-[#B8860B] bg-[#D4AF37] text-[#3f2a0a]"
                            : "border-[#a8a29e] bg-[#78716c] text-white",
                    )}
                  >
                    {showLetter ? ch : ""}
                  </motion.div>
                );
              })}
            </motion.div>
          ))}
        </div>

        {solved && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center text-sm font-medium text-[#B8860B]"
          >
            {successLine}
          </motion.p>
        )}
      </div>

      <div
        className="flex w-full max-w-[380px] flex-col gap-2"
        aria-label="On-screen keyboard"
      >
        {KEYBOARD_ROWS.map((keys, ri) => (
          <div
            key={keys}
            className={cn(
              "flex justify-center gap-1 sm:gap-1.5",
              ri === 1 && "px-4 sm:px-6",
            )}
          >
            {ri === 2 && (
              <button
                type="button"
                onClick={submit}
                className="mr-1 flex h-10 min-w-[2.75rem] items-center justify-center rounded-md bg-[#722F37]/12 px-2 text-[10px] font-semibold uppercase tracking-wide text-[#722F37] sm:h-11 sm:text-xs"
              >
                Enter
              </button>
            )}
            {keys.split("").map((k) => {
              const kh = keyHints[k];
              return (
                <button
                  key={k}
                  type="button"
                  disabled={solved || outOfTurns}
                  onClick={() => typeLetter(k)}
                  className={cn(
                    "flex h-10 min-w-[1.65rem] flex-1 items-center justify-center rounded-md text-sm font-semibold uppercase sm:h-11 sm:min-w-[1.85rem] sm:text-base",
                    !kh && "bg-[#722F37]/10 text-[#4a1520] hover:bg-[#722F37]/18",
                    kh === "correct" && "bg-[#166534] text-white",
                    kh === "present" && "bg-[#D4AF37] text-[#3f2a0a]",
                    kh === "absent" && "bg-[#78716c] text-white",
                  )}
                >
                  {k}
                </button>
              );
            })}
            {ri === 2 && (
              <button
                type="button"
                onClick={backspace}
                className="ml-1 flex h-10 min-w-[2.75rem] items-center justify-center rounded-md bg-[#722F37]/12 px-2 text-[10px] font-semibold uppercase tracking-wide text-[#722F37] sm:h-11 sm:text-xs"
              >
                ⌫
              </button>
            )}
          </div>
        ))}
      </div>

      {hint && !solved && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm text-[#8B6914]"
        >
          {hint}
        </motion.p>
      )}

      {!solved && outOfTurns && (
        <MagneticButton
          type="button"
          className="rounded-xl px-6 py-3 text-sm"
          onClick={complete}
        >
          I’m headlining — show the setlist
        </MagneticButton>
      )}

      <div className="flex flex-col items-center gap-3">
        <p className="text-center text-xs text-[#7a4a52]">
          Puzzles aren’t your genre? Same — you already turned in the hard
          stuff.
        </p>
        <MagneticButton
          type="button"
          className="rounded-xl px-6 py-3 text-sm"
          onClick={complete}
        >
          Skip to the details
        </MagneticButton>
      </div>
    </motion.div>
  );
}
