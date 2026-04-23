"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { inviteConfig } from "@/lib/invite-config";
import { heroBentoMedia } from "@/lib/hero-bento-media";
import { GradientBackground } from "@/components/ui/paper-design-shader-background";
import { ConfettiCanvas } from "@/components/invite/confetti-canvas";
import { InteractiveEnvelope } from "@/components/invite/interactive-envelope";
import { Button } from "@/components/ui/button";
import InteractiveBentoGallery from "@/components/ui/interactive-bento-gallery";
import { WordlePuzzle } from "@/components/invite/wordle-puzzle";
import { InviteReveal } from "@/components/invite/invite-reveal";

type Phase = "intro" | "envelope" | "puzzle" | "revealed";

const fade = {
  initial: { opacity: 0, y: 24, filter: "blur(10px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -16, filter: "blur(8px)" },
  transition: { type: "spring" as const, stiffness: 220, damping: 28 },
};

export function InviteExperience() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [confetti, setConfetti] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const envelopeDoneRef = useRef(false);

  const launchConfetti = useCallback(() => {
    setConfettiKey((k) => k + 1);
    setConfetti(true);
  }, []);

  const handleEnvelopeDone = useCallback(() => {
    if (envelopeDoneRef.current) return;
    envelopeDoneRef.current = true;
    launchConfetti();
    window.setTimeout(() => setPhase("puzzle"), 1500);
  }, [launchConfetti]);

  const skipToDetails = useCallback(() => {
    setPhase("revealed");
    setConfetti(false);
  }, []);

  const endConfetti = useCallback(() => setConfetti(false), []);

  return (
    <main className="relative min-h-screen overflow-x-hidden text-[#4a1520]">
      <GradientBackground />

      <ConfettiCanvas key={confettiKey} active={confetti} onComplete={endConfetti} />

      <div className="relative z-[10] flex min-h-screen flex-col">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {phase === "intro" && (
              <motion.section
                key="intro"
                className="relative flex flex-1 flex-col items-center justify-center overflow-x-hidden py-12 lg:min-h-[min(100dvh,900px)] lg:py-16"
                {...fade}
              >
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  {Array.from({ length: 22 }).map((_, i) => (
                    <motion.span
                      key={i}
                      className="absolute rounded-full bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.85)]"
                      style={{
                        left: `${(i * 47) % 100}%`,
                        top: `${(i * 61) % 100}%`,
                        width: i % 3 === 0 ? 3 : 2,
                        height: i % 3 === 0 ? 3 : 2,
                      }}
                      animate={{
                        opacity: [0.2, 0.95, 0.2],
                        scale: [0.85, 1.65, 0.85],
                      }}
                      transition={{
                        duration: 2.8 + (i % 5) * 0.4,
                        repeat: Infinity,
                        delay: i * 0.07,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>

                <div className="relative z-10 grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:items-start lg:gap-10 xl:gap-12">
                  <div className="mx-auto w-full max-w-lg text-center lg:mx-0 lg:max-w-xl lg:justify-self-start lg:text-left">
                    

                    <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                      <span className="bg-gradient-to-br from-[#4a1520] via-[#722F37] to-[#5c1f28] bg-clip-text text-transparent">
                        GradChella
                      </span>
                      <br />
                      <span className="bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#C5A028] bg-clip-text text-transparent">
                        2026.
                      </span>
                    </h1>

                    <p className="mx-auto mt-5 max-w-md text-pretty text-base leading-relaxed text-[#7a4a52] sm:text-lg lg:mx-0">
                      The syllabus is closed. The guest list is not. One night, zero finals energy.
                    </p>

                    <motion.div
                      className="mt-8 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, ...fade.transition }}
                    >
                      <Button
                        type="button"
                        size="lg"
                        className="rounded-xl px-8 shadow-md"
                        onClick={() => setPhase("envelope")}
                      >
                        Open the invite
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="rounded-xl border-[#722F37]/35 bg-white/90 text-[#722F37] shadow-sm backdrop-blur-md hover:bg-[#FFFBF0]"
                        onClick={skipToDetails}
                      >
                        I’m boring — show details
                      </Button>
                    </motion.div>
                  </div>

                  <div className="mx-auto w-full max-w-[min(100%,520px)] justify-self-center lg:max-w-[560px] lg:justify-self-end">
                    <InteractiveBentoGallery
                      mediaItems={heroBentoMedia}
                      title="Gallery Shots Collection"
                      description="Drag and explore our curated collection of shots"
                      showHeader={false}
                    />
                  </div>
                </div>
              </motion.section>
            )}

            {phase === "envelope" && (
              <motion.section
                key="envelope"
                className="flex w-full flex-1 flex-col items-center justify-center py-14 sm:py-16"
                {...fade}
              >
                <InteractiveEnvelope
                  title={inviteConfig.title}
                  year={inviteConfig.year}
                  onOpenComplete={handleEnvelopeDone}
                />
              </motion.section>
            )}

            {phase === "puzzle" && (
              <motion.section
                key="puzzle"
                className="flex w-full flex-1 flex-col items-center justify-center py-10 sm:py-16"
                {...fade}
              >
                <WordlePuzzle onSolved={() => setPhase("revealed")} />
              </motion.section>
            )}

            {phase === "revealed" && (
              <motion.div
                key="revealed"
                id="party-details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 26 }}
                className="w-full flex-1 py-6 sm:py-8"
              >
                <InviteReveal />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {phase !== "intro" && phase !== "revealed" && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={skipToDetails}
            className="fixed bottom-6 right-4 z-[70] rounded-full border border-[#722F37]/25 bg-white/95 px-4 py-2 text-xs font-medium text-[#722F37] shadow-[0_12px_40px_rgba(114,47,55,0.12)] backdrop-blur-md transition-colors hover:border-[#D4AF37]/80 hover:text-[#4a1520] sm:right-6 lg:right-8"
          >
            Skip to details
          </motion.button>
        )}
      </div>
    </main>
  );
}
