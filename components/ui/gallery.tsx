"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { heroGalleryPhotos } from "@/lib/hero-gallery-photos";

type Direction = "left" | "right";

export type GalleryPhotoItem = {
  id: number;
  src: string;
  alt?: string;
};

type PhotoLayout = {
  order: number;
  x: string;
  y: string;
  zIndex: number;
  direction: Direction;
};

const DEFAULT_LAYOUT: PhotoLayout[] = [
  { order: 0, x: "-320px", y: "15px", zIndex: 50, direction: "left" },
  { order: 1, x: "-160px", y: "32px", zIndex: 40, direction: "left" },
  { order: 2, x: "0px", y: "8px", zIndex: 30, direction: "right" },
  { order: 3, x: "160px", y: "22px", zIndex: 20, direction: "right" },
  { order: 4, x: "320px", y: "44px", zIndex: 10, direction: "left" },
];

/** Tighter fan for split hero columns (~440px wide vs ~860px full layout). */
const COMPACT_FAN_LAYOUT: PhotoLayout[] = [
  { order: 0, x: "-128px", y: "10px", zIndex: 50, direction: "left" },
  { order: 1, x: "-64px", y: "22px", zIndex: 40, direction: "left" },
  { order: 2, x: "0px", y: "5px", zIndex: 30, direction: "right" },
  { order: 3, x: "64px", y: "16px", zIndex: 20, direction: "right" },
  { order: 4, x: "128px", y: "28px", zIndex: 10, direction: "left" },
];

const FULL_PHOTO_PX = 220;
const COMPACT_PHOTO_PX = 168;

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const photoVariants = {
  hidden: {
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
  },
  visible: (custom: { x: string; y: string; order: number }) => ({
    x: custom.x,
    y: custom.y,
    rotate: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 70,
      damping: 12,
      mass: 1,
      delay: custom.order * 0.15,
    },
  }),
};

export function PhotoGallery({
  animationDelay = 0.5,
  compact = false,
  showCaptions = true,
  eyebrow = "A few favorite frames",
  title = "Welcome to our",
  titleHighlight = "graduation",
  titleSuffix = "story",
  photos = [...heroGalleryPhotos],
  primaryLabel = "View all",
  onPrimaryClick,
  showFooterCta = true,
  className,
}: {
  animationDelay?: number;
  compact?: boolean;
  showCaptions?: boolean;
  eyebrow?: string;
  title?: string;
  titleHighlight?: string;
  titleSuffix?: string;
  photos?: readonly GalleryPhotoItem[];
  primaryLabel?: string;
  onPrimaryClick?: () => void;
  /** When false, only the fan renders (use when the parent supplies primary actions). */
  showFooterCta?: boolean;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const visibilityTimer = window.setTimeout(() => {
      setIsVisible(true);
    }, animationDelay * 1000);

    const animationTimer = window.setTimeout(() => {
      setIsLoaded(true);
    }, (animationDelay + 0.4) * 1000);

    return () => {
      window.clearTimeout(visibilityTimer);
      window.clearTimeout(animationTimer);
    };
  }, [animationDelay]);

  const fanLayout = compact ? COMPACT_FAN_LAYOUT : DEFAULT_LAYOUT;
  const photoPx = compact ? COMPACT_PHOTO_PX : FULL_PHOTO_PX;
  const count = Math.min(photos.length, fanLayout.length);
  const layout = fanLayout.slice(0, count);
  const photoItems = photos.slice(0, count).map((p, i) => {
    const L = layout[i];
    return {
      ...p,
      order: L!.order,
      x: L!.x,
      y: L!.y,
      zIndex: L!.zIndex,
      direction: L!.direction,
    };
  });

  return (
    <div
      className={cn(
        "relative",
        compact ? "mt-0" : "mt-40",
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-0 -z-10 w-full bg-transparent bg-[linear-gradient(to_right,#722F37_1px,transparent_1px),linear-gradient(to_bottom,#722F37_1px,transparent_1px)] opacity-[0.12] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] bg-[size:3rem_3rem] max-md:hidden",
          compact ? "top-[80px] h-[240px]" : "top-[200px] h-[300px]",
        )}
      />
      {showCaptions && (
        <>
          <p className="my-2 text-center text-xs font-light uppercase tracking-widest text-[#7a4a52] lg:text-sm">
            {eyebrow}
          </p>
          <h3 className="z-20 mx-auto max-w-2xl bg-gradient-to-r from-[#4a1520] via-[#722F37] to-[#4a1520] bg-clip-text py-3 text-center text-3xl text-transparent md:text-6xl">
            {title}{" "}
            <span className="text-[#B8860B]">{titleHighlight}</span>
            {titleSuffix ? ` ${titleSuffix}` : ""}
          </h3>
        </>
      )}
      <div
        className={cn(
          "relative flex w-full items-center justify-center",
          compact ? "h-[230px] sm:h-[248px]" : "h-[350px]",
          showFooterCta && "mb-8",
        )}
      >
        <motion.div
          className="relative mx-auto flex w-full max-w-7xl justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div
            className="relative flex w-full justify-center"
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
          >
            <div
              className={cn(
                "relative",
                compact ? "h-[168px] w-[168px]" : "h-[220px] w-[220px]",
              )}
            >
              {[...photoItems].reverse().map((photo) => (
                <motion.div
                  key={photo.id}
                  className="absolute left-0 top-0"
                  style={{ zIndex: photo.zIndex }}
                  variants={photoVariants}
                  custom={{
                    x: photo.x,
                    y: photo.y,
                    order: photo.order,
                  }}
                >
                  <Photo
                    width={photoPx}
                    height={photoPx}
                    src={photo.src}
                    alt={photo.alt ?? "Graduation photo"}
                    direction={photo.direction}
                    imageSizes={`${photoPx}px`}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
      {showFooterCta ? (
        <div className="flex w-full justify-center pt-2">
          <Button
            type="button"
            size="lg"
            className="rounded-xl px-8 shadow-md"
            onClick={onPrimaryClick}
          >
            {primaryLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function getRandomNumberInRange(min: number, max: number): number {
  if (min >= max) {
    throw new Error("Min value should be less than max value");
  }
  return Math.random() * (max - min) + min;
}

export const Photo = ({
  src,
  alt,
  className,
  direction = "right",
  width,
  height,
  imageSizes,
}: {
  src: string;
  alt: string;
  className?: string;
  direction?: Direction;
  width: number;
  height: number;
  imageSizes?: string;
}) => {
  const rotation = useMemo(
    () =>
      getRandomNumberInRange(1, 4) * (direction === "left" ? -1 : 1),
    [direction],
  );

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileTap={{ scale: 1.2, zIndex: 9999 }}
      whileHover={{
        scale: 1.1,
        rotateZ: 2 * (direction === "left" ? -1 : 1),
        zIndex: 9999,
      }}
      whileDrag={{
        scale: 1.1,
        zIndex: 9999,
      }}
      initial={{ rotate: 0 }}
      animate={{ rotate: rotation }}
      style={{
        width,
        height,
        perspective: 400,
        zIndex: 1,
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
        touchAction: "none",
      }}
      className={cn(
        className,
        "relative mx-auto shrink-0 cursor-grab active:cursor-grabbing",
      )}
      tabIndex={0}
    >
      <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-sm">
        <Image
          className={cn("rounded-3xl object-cover")}
          fill
          src={src}
          alt={alt}
          sizes={imageSizes ?? "220px"}
          draggable={false}
        />
      </div>
    </motion.div>
  );
};
