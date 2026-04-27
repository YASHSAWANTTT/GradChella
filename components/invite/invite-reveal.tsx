"use client";

import { motion } from "framer-motion";
import { inviteConfig } from "@/lib/invite-config";
import { cn } from "@/lib/utils";
import { GoogleFormEmbed } from "@/components/invite/google-form-embed";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 28 },
  },
};

function TiltCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{
        rotateX: -4,
        rotateY: 4,
        scale: 1.02,
        transition: { type: "spring", stiffness: 320, damping: 22 },
      }}
      style={{ transformStyle: "preserve-3d" }}
      className={cn(
        "rounded-2xl border border-[#722F37]/12 bg-white/95 p-6 shadow-[0_20px_50px_rgba(114,47,55,0.08)] backdrop-blur-xl [transform-style:preserve-3d] ring-1 ring-[#D4AF37]/15",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

export function InviteReveal() {
  const { when, where, gradChellaBlurb, rsvpUrl, tagline } = inviteConfig;

  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="relative z-[1] mx-auto flex w-full max-w-6xl flex-col gap-12 pb-24 pt-2"
      aria-label="Party details"
    >
      <motion.div variants={item} className="text-center">
        <p className="text-sm font-medium uppercase tracking-[0.35em] text-[#B8860B]">
          The details
        </p>
        <h2 className="mt-3 bg-gradient-to-r from-[#4a1520] via-[#722F37] to-[#B8860B] bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl">
          {tagline}
        </h2>
      </motion.div>

      <div className="grid gap-5">
        <motion.div variants={item}>
          <TiltCard className="h-full">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#B8860B]">
              When &amp; where
            </h3>
            <p className="mt-4 text-lg font-medium text-[#4a1520]">{when}</p>
            <p className="mt-2 text-base leading-relaxed text-[#5c2a32]">{where}</p>
            <p className="mt-6 text-sm leading-relaxed text-[#7a4a52]">{gradChellaBlurb}</p>
          </TiltCard>
        </motion.div>

        <motion.div variants={item}>
          <TiltCard className="overflow-hidden">
            <div className="mb-4 text-center sm:text-left">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#B8860B]">
                RSVP
              </h3>
              <p className="mt-2 text-sm text-[#7a4a52]">
                Fill out the form below — or{" "}
                <a
                  href={rsvpUrl}
                  className="font-medium text-[#722F37] underline-offset-4 hover:text-[#B8860B] hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  open it in a new tab
                </a>
                .
              </p>
            </div>
            <GoogleFormEmbed />
          </TiltCard>
        </motion.div>
      </div>
    </motion.section>
  );
}
