"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import RSVPForm from "./RSVPForm";
import ScheduleSlide from "./ScheduleSlide";
import { event } from "@/lib/event";
import MusicToggle from "@/components/MusicToggle";
/**
 * A different photo per screen. Drop your photos into /public/images
 * named exactly photo-1.jpg through photo-5.jpg (date/location, day 1
 * morning, day 1 evening, day 2, RSVP — in that order). Any one that's
 * missing just falls back to the generated gradient automatically, so
 * it's safe to add them gradually.
 * (The greeting screen uses the light wave background instead of a photo,
 * and the countdown screen uses a video — see VideoBackground below.)
 */
const PHOTOS = [
  "/images/hotel2.jpeg",
  "/images/conf3.jpeg",
  "/images/buggy.jpeg",
  "/images/up.jpeg",
  "/images/photo-5.jpeg",
];

const mapLinkHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.mapQuery)}`;

// Container/item pair: re-triggers every time a panel becomes active
// (animate="show" only when its index === the current active index),
// so the reveal plays again on every swipe, not just on first load.
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

function useCountdown(target: string) {
  const calc = () => {
    const diff = new Date(target).getTime() - Date.now();
    const clamped = Math.max(diff, 0);
    return {
      days: Math.floor(clamped / 86400000),
      hours: Math.floor((clamped / 3600000) % 24),
      minutes: Math.floor((clamped / 60000) % 60),
      seconds: Math.floor((clamped / 1000) % 60),
      done: diff <= 0,
    };
  };
  // Start as null so the server-rendered markup and the client's first render match
  // exactly (both render the placeholder). The real, Date.now()-based value is only
  // computed after mount, client-side only — this avoids a hydration mismatch since
  // the server and the browser would otherwise compute this at slightly different times.
  const [t, setT] = useState<ReturnType<typeof calc> | null>(null);
  useEffect(() => {
    setT(calc());
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  return t;
}

/**
 * Soft, light wave background for the greeting screen only — everything
 * else in the invite keeps the dark photo look. Pure CSS/SVG, no image file
 * needed.
 */
function GreetingBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-[#eef4fb]">
      <svg
        className="absolute top-0 inset-x-0 h-40 w-full sm:h-56"
        viewBox="0 0 800 230"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0,0 L800,0 L800,90 C680,150 560,60 420,120 C260,190 120,50 0,130 Z"
          fill="#dbe9f9"
        />
        <path
          d="M0,0 L800,0 L800,170 C700,230 600,140 460,200 C300,270 150,150 0,230 Z"
          fill="#c9def4"
          opacity="0.7"
        />
      </svg>
      <svg
        className="absolute bottom-0 inset-x-0 h-40 w-full sm:h-56"
        viewBox="0 1370 800 230"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0,1600 L800,1600 L800,1500 C680,1440 560,1530 420,1470 C260,1400 120,1520 0,1450 Z"
          fill="#dbe9f9"
        />
        <path
          d="M0,1600 L800,1600 L800,1430 C700,1370 600,1460 460,1400 C300,1330 150,1450 0,1380 Z"
          fill="#c9def4"
          opacity="0.7"
        />
      </svg>
    </div>
  );
}
function ImageBackground({
  src,
  desktopSrc,
  alt,
  fit = "cover",
}: {
  src: string;
  /** Optional wider/landscape image swapped in at >=768px viewports via a
   * <picture> media query (pure CSS, no JS/layout-shift). Use this when the
   * mobile art is portrait and would otherwise letterbox on desktop. */
  desktopSrc?: string;
  alt: string;
  /** "cover" fills the screen and crops; "contain" shows the whole image
   * letterboxed on the bg color — use "contain" for art with fixed
   * logo/text placement so nothing gets cropped off on viewports with a
   * different aspect ratio than the source image. */
  fit?: "cover" | "contain";
}) {
  const fitClass = fit === "contain" ? "object-contain" : "object-cover";
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-[#faf6f0]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <picture>
        {desktopSrc && <source media="(min-width: 768px)" srcSet={desktopSrc} />}
        <img src={src} alt={alt} className={`h-full w-full ${fitClass}`} />
      </picture>
    </div>
  );
}
function PanelBackground({ photoIndex, active }: { photoIndex: number; active: boolean }) {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-white">
      {/* generated placeholder texture — shows through until a real photo is added, or behind transparent areas of one */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.16), transparent 42%), radial-gradient(circle at 85% 10%, rgba(255,255,255,0.10), transparent 38%), radial-gradient(circle at 50% 100%, rgba(0,0,0,0.35), transparent 50%)",
        }}
      />
      {/* real photo, filled/cropped on smaller screens where it fits closely,
          shown whole (no crop) on desktop where the aspect ratio differs more */}
      <motion.img
        src={PHOTOS[photoIndex % PHOTOS.length]}
        alt=""
        className="relative h-full w-full object-cover"
        initial={{ scale: 1.06 }}
        animate={{ scale: active ? 1.14 : 1.06 }}
        transition={{ duration: 12, ease: "linear" }}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />
      <div className="absolute inset-0 bg-black/5" />
      <div className="absolute inset-0 bg-grain" />
    </div>
  );
}

/**
 * Same look as PanelBackground, but plays a looping video instead of a
 * still photo. Used on the countdown screen. Drop your video into
 * /public/images named countdown-bg.mp4 (webm/mov also work — just update
 * the src below to match). If it's missing or fails to load, it silently
 * falls back to the same generated gradient the photo panels use.
 */
function VideoBackground({ src, active }: { src: string; active: boolean }) {
  const [broken, setBroken] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [active]);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-white">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.16), transparent 42%), radial-gradient(circle at 85% 10%, rgba(255,255,255,0.10), transparent 38%), radial-gradient(circle at 50% 100%, rgba(0,0,0,0.35), transparent 50%)",
        }}
      />
      {!broken && (
        <video
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          preload="auto"
          className="relative h-full w-full object-cover"
          onError={() => setBroken(true)}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />
      <div className="absolute inset-0 bg-black/5" />
      <div className="absolute inset-0 bg-grain" />
    </div>
  );
}

// Container/item pair for the details panel: each info block fades/slides in
// one after another and then STAYS on screen — nothing is removed or swapped out.
const detailsContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.5, delayChildren: 0.3 } },
};
const detailsItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

function DetailsPanel({ active }: { active: boolean }) {
  return (
    <div className="flex h-full flex-col items-center px-8 text-center text-white">
      <motion.div
        variants={detailsContainer}
        initial="hidden"
        animate={active ? "show" : "hidden"}
        className="m-auto flex w-full max-w-xs flex-col items-center gap-7"
      >
        {/* Date */}
        <motion.div variants={detailsItem} className="flex flex-col items-center gap-3">
          <p className="text-xs uppercase tracking-[0.3em] text-white">Save the date</p>
          <p className="font-display text-3xl italic sm:text-4xl">{event.dateLabel}</p>
          <div className="hairline w-12" />
        </motion.div>

        {/* Schedule stop(s) */}
        {event.schedule.map((stop) => (
          <motion.div key={stop.venue} variants={detailsItem} className="flex flex-col items-center gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-white">{stop.time}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-white">{stop.label}</p>
            <p className="font-display text-2xl italic sm:text-3xl">{stop.venue}</p>
            <p className="text-sm text-white">{stop.city}</p>
          </motion.div>
        ))}

        {/* Location — a static card, not a live embedded map, so a swipe that
            starts here isn't swallowed by the map's own pan/zoom gesture. */}
        <motion.a
          variants={detailsItem}
          href={mapLinkHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center gap-3 rounded-xl border border-white/25 bg-white/10 px-5 py-4 text-left transition-colors hover:bg-white/15"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 flex-shrink-0 text-white">
            <path
              d="M12 22s7-7.58 7-12.5A7 7 0 0 0 5 9.5C5 14.42 12 22 12 22Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <span className="flex-1 min-w-0">
            <span className="block text-[10px] uppercase tracking-[0.2em] text-white">Find us here</span>
            <span className="block truncate text-sm text-white/90">{event.mapQuery}</span>
          </span>
          <span className="flex-shrink-0 text-[10px] uppercase tracking-[0.15em] text-white">Open ↗</span>
        </motion.a>
      </motion.div>
    </div>
  );
}

function Dots({ count, index, light = false }: { count: number; index: number; light?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-7 z-20 flex justify-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === index
              ? light
                ? "w-6 bg-slate-700"
                : "w-6 bg-white"
              : light
                ? "w-1.5 bg-slate-700/30"
                : "w-1.5 bg-white"
          }`}
        />
      ))}
    </div>
  );
}

function NextButton({
  onClick,
  label = "Swipe",
  light = false,
}: {
  onClick: () => void;
  label?: string;
  light?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`group absolute bottom-16 right-6 z-20 flex flex-col items-center gap-1 transition-colors sm:right-10 ${
        light ? "text-slate-500 hover:text-slate-800" : "text-white hover:text-white"
      }`}
      aria-label="Next"
    >
      <span className="text-[10px] uppercase tracking-[0.2em]">{label}</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:translate-x-1">
        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group absolute bottom-16 left-6 z-20 flex flex-col items-center gap-1 text-white transition-colors hover:text-white sm:left-10"
      aria-label="Back"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:-translate-x-1">
        <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-[10px] uppercase tracking-[0.2em]">Back</span>
    </button>
  );
}

export default function InviteCard({ name, slug }: { name: string; slug: string }) {
  const PANEL_COUNT = 7;
  const [index, setIndex] = useState(0);
  const [vw, setVw] = useState(0);
  const t = useCountdown(event.isoDateTime);

  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const goTo = (i: number) => setIndex(Math.max(0, Math.min(PANEL_COUNT - 1, i)));

  return (
    <div className="fixed inset-0 overflow-hidden bg-white">
      <MusicToggle />
      <motion.div
        className="flex h-full"
        animate={{ x: -index * vw }}
        transition={{ type: "tween", duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
        drag="x"
        dragDirectionLock
        dragMomentum={false}
        dragConstraints={{ left: -(PANEL_COUNT - 1) * vw, right: 0 }}
        dragElastic={0.1}
        onDragEnd={(_, info) => {
          const offsetThreshold = vw * 0.15;
          const swipePower = Math.abs(info.offset.x) * info.velocity.x;
          const flungLeft = swipePower < -8000;
          const flungRight = swipePower > 8000;
          if (flungLeft || info.offset.x < -offsetThreshold) goTo(index + 1);
          else if (flungRight || info.offset.x > offsetThreshold) goTo(index - 1);
        }}
      >
        {/* Panel 1 — Greeting */}
<div className="relative h-full w-screen flex-shrink-0">
  <ImageBackground src="/backgrounds/panel1-bg-mobile.png" desktopSrc="/backgrounds/panel1-bg-desktop.png" alt="MedisPharm and AWMU invite you to OATH" />
  <NextButton onClick={() => goTo(1)} light />
  <Dots count={PANEL_COUNT} index={index} light={index === 0} />
</div>

        {/* Panel 2 — Date, time & location, revealed one piece at a time + map */}
        <div className="relative h-full w-screen flex-shrink-0">
          <PanelBackground photoIndex={0} active={index === 1} />
          <DetailsPanel active={index === 1} />
          <BackButton onClick={() => goTo(0)} />
          <NextButton onClick={() => goTo(2)} />
          <Dots count={PANEL_COUNT} index={index} />
        </div>

        {/* Panel 3 — Day One, Morning */}
        <div className="relative h-full w-screen flex-shrink-0">
          <PanelBackground photoIndex={1} active={index === 2} />
          <ScheduleSlide data={event.program[0]} active={index === 2} />
          <BackButton onClick={() => goTo(1)} />
          <NextButton onClick={() => goTo(3)} />
          <Dots count={PANEL_COUNT} index={index} />
        </div>

        {/* Panel 4 — Day One, Evening */}
        <div className="relative h-full w-screen flex-shrink-0">
          <PanelBackground photoIndex={2} active={index === 3} />
          <ScheduleSlide data={event.program[1]} active={index === 3} />
          <BackButton onClick={() => goTo(2)} />
          <NextButton onClick={() => goTo(4)} />
          <Dots count={PANEL_COUNT} index={index} />
        </div>

        {/* Panel 5 — Day Two */}
        <div className="relative h-full w-screen flex-shrink-0">
          <PanelBackground photoIndex={3} active={index === 4} />
          <ScheduleSlide data={event.program[2]} active={index === 4} />
          <BackButton onClick={() => goTo(3)} />
          <NextButton onClick={() => goTo(5)} />
          <Dots count={PANEL_COUNT} index={index} />
        </div>

        {/* Panel 6 — Countdown */}
        <div className="relative h-full w-screen flex-shrink-0">
          <VideoBackground src="/images/countdown-bg.mp4" active={index === 5} />
          <motion.div
            variants={container}
            initial="hidden"
            animate={index === 5 ? "show" : "hidden"}
            className="flex h-full flex-col items-center justify-center px-8 text-center text-white"
          >
            <motion.p variants={item} className="text-xs uppercase tracking-[0.3em] text-white">
              Counting down 
            </motion.p>
            <motion.div variants={item} className="mt-8 flex items-end justify-center gap-8">
              <div className="text-center">
                <p className="font-display text-9xl italic leading-none">{t ? t.days : "--"}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-white">Days</p>
              </div>
              <div className="h-24 w-px bg-white/25" />
              <div className="space-y-5 text-left">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-4xl italic">{t ? t.hours : "--"}</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-white">Hours</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-4xl italic">{t ? t.minutes : "--"}</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-white">Minutes</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-4xl italic">{t ? t.seconds : "--"}</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-white">Seconds</span>
                </div>
              </div>
            </motion.div>
            {t?.done && (
              <motion.p variants={item} className="mt-10 font-display text-lg italic text-white">
                the celebration has begun
              </motion.p>
            )}
          </motion.div>
          <BackButton onClick={() => goTo(4)} />
          <NextButton onClick={() => goTo(6)} />
          <Dots count={PANEL_COUNT} index={index} />
        </div>

        

        {/* Panel 8 — Guest name + RSVP */}
        <div className="relative h-full w-screen flex-shrink-0">
  <ImageBackground src="/backgrounds/panel-last-bg-mobile.jpeg" desktopSrc="/backgrounds/panel-last-bg-desktop.png" alt="Because you are at the heart of what we do — MedisPharm Family" />
  <motion.div
  variants={container}
  initial="hidden"
  animate={index === 6 ? "show" : "hidden"}
  className="flex h-full flex-col items-center justify-center px-8 text-center text-[#4e2a6e]"
>
  <motion.p variants={item} className="text-sm uppercase tracking-[0.2em] text-[#4e2a6e]">
    Dear
  </motion.p>
  <motion.h1 variants={item} className="mt-3 font-display text-4xl italic sm:text-5xl">
    {name}
  </motion.h1>

  <motion.p variants={item} className="mt-6 font-display text-xl italic text-[#4e2a6e]">
    Will you attend?
  </motion.p>

            <motion.div variants={item} className="mt-8 w-full max-w-xs">
              <RSVPForm name={name} slug={slug} />
            </motion.div>
          </motion.div>
          <BackButton onClick={() => goTo(6)} />
          <Dots count={PANEL_COUNT} index={index} />
        </div>
      </motion.div>
    </div>
  );
}
