"use client";

import { useEffect, useRef, useState } from "react";

type ScheduleItem = { time: string; label: string };
export type ScheduleDay = {
  eyebrow: string;
  heading: string;
  date: string;
  items: ScheduleItem[];
  dressCode?: string;
  note?: string;
};

const STEP_MS = 1100; // time between each row lighting up

export default function ScheduleSlide({ data, active }: { data: ScheduleDay; active: boolean }) {
  const [revealed, setRevealed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!active) {
      // Reset so it plays again the next time this slide is opened.
      setRevealed(0);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    let step = 0;
    timerRef.current = setInterval(() => {
      step += 1;
      setRevealed(step);
      if (step >= data.items.length && timerRef.current) {
        clearInterval(timerRef.current);
      }
    }, STEP_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [active, data.items.length]);

  const allRevealed = revealed >= data.items.length;

  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-white">
      <div
        className="w-full max-w-sm transition-opacity duration-700"
        style={{ opacity: active ? 1 : 0 }}
      >
        <p className="text-center text-xs uppercase tracking-[0.3em] text-white">{data.eyebrow}</p>
        <p className="mt-2 text-center font-display text-3xl italic sm:text-4xl">{data.heading}</p>
        <p className="mb-9 mt-1 text-center text-[10px] uppercase tracking-[0.2em] text-white">
          {data.date}
        </p>

        <div className="relative pl-9">
          <div className="absolute bottom-1 left-[9px] top-1 w-px bg-white/15" />
          {data.items.map((it, i) => {
            const isRevealed = i < revealed;
            const isCurrent = i === revealed - 1;
            return (
              <div key={i} className="relative pb-6 last:pb-0">
                <span
                  className="absolute -left-9 top-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-white"
                  style={{
                    opacity: isRevealed ? 1 : 0.25,
                    boxShadow: isCurrent ? "0 0 0 4px rgba(255,255,255,0.18)" : "none",
                    transform: isCurrent ? "scale(1.25)" : "scale(1)",
                    transition: "opacity 600ms ease, box-shadow 600ms ease, transform 600ms ease",
                  }}
                />
                <p
                  className="text-[10px] uppercase tracking-[0.15em] text-white"
                  style={{ opacity: isRevealed ? 1 : 0.35, transition: "opacity 650ms ease" }}
                >
                  {it.time}
                </p>
                <p
                  className="mt-0.5 font-dis
                  ay text-lg italic sm:text-xl"
                  style={{ opacity: isRevealed ? 1 : 0.35, transition: "opacity 650ms ease" }}
                >
                  {it.label}
                </p>
              </div>
            );
          })}
        </div>

        {(data.dressCode || data.note) && (
          <div
            className="mt-6 border-t border-white/15 pt-5 text-center"
            style={{ opacity: allRevealed ? 1 : 0, transition: "opacity 700ms ease" }}
          >
            {data.dressCode && (
              <p className="text-[10px] uppercase tracking-[0.25em] text-white">
                Dress code — <span className="text-white">{data.dressCode}</span>
              </p>
            )}
            {data.note && (
              <p className="mt-2 font-display text-lg italic text-white">{data.note}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
