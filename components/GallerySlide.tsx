"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Photos AND short video clips from a previous event, cycling automatically
 * while this panel is active. Drop files into /public/images named
 * gallery-1, gallery-2, etc. — the extension decides whether it's treated
 * as a photo (.jpg/.jpeg/.png/.webp) or a video (.mp4/.webm/.mov).
 *
 * Photos hold for PHOTO_DURATION_MS, then crossfade to the next item.
 * Videos autoplay muted (required by browsers) and advance as soon as they
 * finish playing — keep clips short (a few seconds) so the slideshow
 * doesn't stall on any one clip. Missing files are skipped silently, so
 * it's safe to list more than you've added yet.
 */
const GALLERY_ITEMS = [
  "/images/1.jpeg",
  "/images/2.jpeg",
  "/images/3.jpeg",
  "/images/4.jpeg",
  "/images/5.jpeg",
  "/images/6.jpeg",
  "/images/7.mp4",
  "/images/8.mp4",
  "/images/9.jpeg",
  "/images/10.jpeg",

];

const PHOTO_DURATION_MS = 3200;
// Safety cap per video in case its `ended` event never fires (e.g. a
// corrupt file) — keeps the slideshow from getting stuck.
const VIDEO_SAFETY_MS = 15000;

function isVideo(src: string) {
  return /\.(mp4|webm|mov)$/i.test(src);
}

export default function GallerySlide({ active }: { active: boolean }) {
  const [i, setI] = useState(0);
  const [broken, setBroken] = useState<Record<number, boolean>>({});
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const advance = () => {
    setI((prev) => {
      for (let step = 1; step <= GALLERY_ITEMS.length; step++) {
        const candidate = (prev + step) % GALLERY_ITEMS.length;
        if (!broken[candidate]) return candidate;
      }
      return prev;
    });
  };

  // Reset to the first (working) item whenever the panel becomes active.
  useEffect(() => {
    if (!active) return;
    setI((prev) => (broken[prev] ? 0 : prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Timing for the current item: photos hold for a fixed duration; videos
  // advance on their own `onEnded` handler below, with this as a fallback.
  useEffect(() => {
    if (!active || broken[i]) return;
    const current = GALLERY_ITEMS[i];
    const ms = isVideo(current) ? VIDEO_SAFETY_MS : PHOTO_DURATION_MS;
    const t = setTimeout(advance, ms);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, i, broken]);

  // Play/pause the active video clip in sync with the panel and slide index.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active && isVideo(GALLERY_ITEMS[i])) {
      v.currentTime = 0;
      v.play().catch(() => {
        /* autoplay can be blocked in rare cases — the safety timeout still advances the slideshow */
      });
    } else {
      v.pause();
    }
  }, [active, i]);

  const visibleCount = GALLERY_ITEMS.length - Object.keys(broken).length;
  const current = GALLERY_ITEMS[i];

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-white">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.16), transparent 42%), radial-gradient(circle at 85% 10%, rgba(255,255,255,0.10), transparent 38%), radial-gradient(circle at 50% 100%, rgba(0,0,0,0.35), transparent 50%)",
        }}
      />
      {!broken[i] && (
        <AnimatePresence mode="sync">
          {isVideo(current) ? (
            <motion.video
              key={i}
              ref={videoRef}
              src={current}
              muted
              playsInline
              autoPlay
              preload="auto"
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              onEnded={advance}
              onError={() => setBroken((b) => ({ ...b, [i]: true }))}
            />
          ) : (
            <motion.img
              key={i}
              src={current}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              onError={() => setBroken((b) => ({ ...b, [i]: true }))}
            />
          )}
        </AnimatePresence>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/40 to-black/80" />
      <div className="absolute inset-0 bg-black/25" />
      <div className="absolute inset-0 bg-grain" />

      {visibleCount > 1 && (
        <div className="pointer-events-none absolute inset-x-0 top-8 z-10 flex justify-center gap-1.5">
          {GALLERY_ITEMS.map((_, idx) =>
            broken[idx] ? null : (
              <span
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === i ? "w-5 bg-white/90" : "w-1 bg-white/35"
                }`}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}
