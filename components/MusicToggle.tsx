"use client";

import { useEffect, useRef, useState } from "react";

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Try a muted autoplay first — this is allowed by every browser and
    // gets the <audio> element "warmed up" so the unmute below is instant.
    audio.volume = 0.5;
    audio.muted = true;
    audio.play().catch(() => {});

    // On the visitor's first tap/click anywhere on the page, unmute and
    // actually start the music. This satisfies every browser's autoplay
    // policy since it's tied to a real user gesture.
    const unlock = () => {
      audio.muted = false;
      audio.play().then(() => setPlaying(true)).catch(() => {});
      setReady(true);
      window.removeEventListener("pointerdown", unlock);
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    return () => window.removeEventListener("pointerdown", unlock);
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.muted = false;
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }

  return (
    <>
      <audio ref={audioRef} src="/audio/theme.mp3" loop preload="auto" />
      <button
        onClick={toggle}
        aria-label={playing ? "Mute background music" : "Play background music"}
        className="fixed right-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-opacity hover:bg-black/30 sm:right-6 sm:top-6"
      >
        {playing ? (
          // speaker / playing icon
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M4 9v6h4l5 5V4L8 9H4z" fill="currentColor" />
            <path d="M16.5 8.5a5 5 0 0 1 0 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M19 6a9 9 0 0 1 0 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          </svg>
        ) : (
          // muted icon
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M4 9v6h4l5 5V4L8 9H4z" fill="currentColor" />
            <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </>
  );
}