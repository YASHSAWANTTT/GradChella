"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export interface MediaItemType {
  id: number;
  type: "image" | "video";
  url: string;
  span: string;
}

function isHeic(url: string) {
  return url.toLowerCase().endsWith(".heic");
}

const MediaItem = ({
  item,
  className,
  onClick,
}: {
  item: MediaItemType;
  className?: string;
  onClick?: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);

  useEffect(() => {
    if (item.type !== "video") return;
    const options = { root: null, rootMargin: "50px", threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => setIsInView(entry.isIntersecting));
    }, options);

    const current = videoRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
      observer.disconnect();
    };
  }, [item.type]);

  useEffect(() => {
    if (item.type !== "video") return;
    let mounted = true;
    const currentVideo = videoRef.current;

    const handleVideoPlay = async () => {
      const video = videoRef.current;
      if (!video || !isInView || !mounted) return;
      try {
        if (video.readyState >= 3) {
          setIsBuffering(false);
          await video.play();
          return;
        }

        setIsBuffering(true);
        await new Promise<void>((resolve) => {
          video.oncanplay = () => resolve();
        });
        if (!mounted) return;
        setIsBuffering(false);
        await video.play();
      } catch (error) {
        console.warn("Video playback failed:", error);
      }
    };

    if (isInView) {
      handleVideoPlay();
    } else {
      currentVideo?.pause();
    }

    return () => {
      mounted = false;
      currentVideo?.pause();
    };
  }, [isInView, item.type]);

  if (item.type === "video") {
    return (
      <div className={`${className ?? ""} relative overflow-hidden`}>
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          onClick={onClick}
          playsInline
          muted
          loop
          preload="auto"
          style={{
            opacity: isBuffering ? 0.8 : 1,
            transition: "opacity 0.2s",
            transform: "translateZ(0)",
            willChange: "transform",
          }}
        >
          <source src={item.url} type="video/mp4" />
        </video>
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          </div>
        )}
      </div>
    );
  }

  if (isHeic(item.url)) {
    return (
      <div
        className={`${className ?? ""} relative h-full w-full cursor-pointer`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.url}
          alt=""
          className="h-full w-full object-cover"
          onClick={onClick}
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  return (
    <div className={`${className ?? ""} relative h-full w-full cursor-pointer`}>
      <Image
        src={item.url}
        alt=""
        fill
        className="object-cover"
        onClick={onClick}
        loading="lazy"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
};

interface GalleryModalProps {
  selectedItem: MediaItemType;
  isOpen: boolean;
  onClose: () => void;
  setSelectedItem: (item: MediaItemType | null) => void;
  mediaItems: MediaItemType[];
}

const GalleryModal = ({
  selectedItem,
  isOpen,
  onClose,
  setSelectedItem,
  mediaItems,
}: GalleryModalProps) => {
  const [dockPosition, setDockPosition] = useState({ x: 0, y: 0 });
  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ scale: 0.98 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="fixed inset-0 z-40 w-full min-h-screen overflow-hidden rounded-none backdrop-blur-lg sm:h-[90vh] sm:rounded-lg md:h-[600px] md:rounded-xl"
      >
        <div className="flex h-full flex-col">
          <div className="flex flex-1 items-center justify-center bg-white/50 p-2 sm:p-3 md:p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedItem.id}
                className="relative h-auto max-h-[70vh] w-full max-w-[95%] overflow-hidden rounded-lg shadow-md sm:max-w-[85%] md:max-w-3xl"
                initial={{ y: 20, scale: 0.97 }}
                animate={{
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    mass: 0.5,
                  },
                }}
                exit={{ y: 20, scale: 0.97, transition: { duration: 0.15 } }}
                onClick={onClose}
              >
                <MediaItem
                  item={selectedItem}
                  className="aspect-[16/9] w-full bg-black/20 object-contain"
                  onClick={onClose}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <motion.button
          type="button"
          aria-label="Close gallery"
          className="absolute right-2 top-2 rounded-full bg-gray-200/80 p-2 text-gray-700 backdrop-blur-sm hover:bg-gray-300/80 sm:right-2.5 sm:top-2.5 md:right-3 md:top-3"
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="h-3 w-3" />
        </motion.button>
      </motion.div>

      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.1}
        initial={false}
        animate={{ x: dockPosition.x, y: dockPosition.y }}
        onDragEnd={(_, info) => {
          setDockPosition((prev) => ({
            x: prev.x + info.offset.x,
            y: prev.y + info.offset.y,
          }));
        }}
        className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 touch-none"
      >
        <motion.div className="relative cursor-grab rounded-xl border border-[#D4AF37]/40 bg-[#722F37]/20 shadow-lg backdrop-blur-xl active:cursor-grabbing">
          <div className="flex max-w-[92vw] items-center gap-1 overflow-x-auto px-3 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {mediaItems.map((item, index) => (
              <motion.div
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedItem(item);
                }}
                style={{
                  zIndex:
                    selectedItem.id === item.id ? 30 : mediaItems.length - index,
                }}
                className={`relative h-8 w-8 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg sm:h-9 sm:w-9 md:h-10 md:w-10 ${
                  selectedItem.id === item.id
                    ? "ring-2 ring-white/70 shadow-lg"
                    : "hover:ring-2 hover:ring-white/30"
                } group hover:z-20`}
                initial={{ rotate: index % 2 === 0 ? -15 : 15 }}
                animate={{
                  scale: selectedItem.id === item.id ? 1.2 : 1,
                  rotate:
                    selectedItem.id === item.id
                      ? 0
                      : index % 2 === 0
                        ? -15
                        : 15,
                  y: selectedItem.id === item.id ? -8 : 0,
                }}
                whileHover={{
                  scale: 1.3,
                  rotate: 0,
                  y: -10,
                  transition: { type: "spring", stiffness: 400, damping: 25 },
                }}
              >
                <MediaItem
                  item={item}
                  className="h-full w-full"
                  onClick={() => setSelectedItem(item)}
                />
                {selectedItem.id === item.id && (
                  <motion.div
                    layoutId="activeGlow"
                    className="pointer-events-none absolute -inset-2 bg-white/20 blur-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

interface InteractiveBentoGalleryProps {
  mediaItems: MediaItemType[];
  title: string;
  description: string;
  showHeader?: boolean;
  className?: string;
}

export default function InteractiveBentoGallery({
  mediaItems,
  title,
  description,
  showHeader = true,
  className,
}: InteractiveBentoGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<MediaItemType | null>(null);
  const [items, setItems] = useState(mediaItems);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className={`mx-auto w-full max-w-4xl px-2 py-4 sm:px-4 ${className ?? ""}`}>
      {showHeader && (
        <div className="mb-8 text-center">
          <motion.h1
            className="bg-gradient-to-r from-[#4a1520] via-[#722F37] to-[#4a1520] bg-clip-text text-2xl font-bold text-transparent sm:text-3xl md:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {title}
          </motion.h1>
          <motion.p
            className="mt-2 text-sm text-[#7a4a52] sm:text-base"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {description}
          </motion.p>
        </div>
      )}
      <AnimatePresence mode="wait">
        {selectedItem ? (
          <GalleryModal
            selectedItem={selectedItem}
            isOpen
            onClose={() => setSelectedItem(null)}
            setSelectedItem={setSelectedItem}
            mediaItems={items}
          />
        ) : (
          <motion.div
            className="grid auto-rows-[56px] grid-cols-1 gap-2.5 sm:auto-rows-[60px] sm:grid-cols-3 md:grid-cols-4 md:gap-3"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
            }}
          >
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                layoutId={`media-${item.id}`}
                className={`relative cursor-move overflow-hidden rounded-xl ${item.span}`}
                onClick={() => !isDragging && setSelectedItem(item)}
                variants={{
                  hidden: { y: 50, scale: 0.9, opacity: 0 },
                  visible: {
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    transition: {
                      type: "spring",
                      stiffness: 350,
                      damping: 25,
                      delay: index * 0.04,
                    },
                  },
                }}
                whileHover={{ scale: 1.02 }}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={1}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={(_, info) => {
                  setIsDragging(false);
                  const moveDistance = info.offset.x + info.offset.y;
                  if (Math.abs(moveDistance) <= 50) return;

                  const newItems = [...items];
                  const draggedItem = newItems[index];
                  const targetIndex =
                    moveDistance > 0
                      ? Math.min(index + 1, items.length - 1)
                      : Math.max(index - 1, 0);
                  newItems.splice(index, 1);
                  newItems.splice(targetIndex, 0, draggedItem);
                  setItems(newItems);
                }}
              >
                <MediaItem
                  item={item}
                  className="absolute inset-0 h-full w-full"
                  onClick={() => !isDragging && setSelectedItem(item)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
