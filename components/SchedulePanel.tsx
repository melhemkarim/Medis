"use client";

import { useEffect, useRef, useState } from "react";
import { event } from "@/lib/event";

// Flatten both days into one ordered list so a single counter can drive the
// reveal + the traveling dot across the whole timeline. Day headers are
// attached to the item that starts that day.
type Row = { time: string; label: string; dayHeader?: { day: string; date: string } };

const ROWS: Row[] = event.program.flatMap((day, di) =>
  day.items.map((it, ii) => ({
    ...it,
    ...(ii === 0 ? { dayHeader: { day: day.eyebrow, date: day.date } } : {}),
  }))
);

const STEP_MS = 1100; // time between each row lighting up

export default function SchedulePanel({ active }: { active: boolean }) {
  // How many rows are currently revealed (0 = none yet).
  const [revealed, setRevealed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!active) {
      // Reset so it plays again the next time this panel is opened.
      setRevealed(0);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    let step = 0;
    timerRef.current = setInterval(() => {
      step += 1;
      setRevealed(step);
      if (step >= ROWS.length && timerRef.current) {
        clearInterval(timerRef.current);
      }
    }, STEP_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [active]);

  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-white">
      <div
        className="w-full max-w-sm transition-opacity duration-700"
        style={{ opacity: active ? 1 : 0 }}
      >
        <p className="mb-6 text-center text-xs uppercase tracking-[0.3em] text-white">
          The Program
        </p>

        <div className="relative pl-9">
          <div className="absolute bottom-1 left-[9px] top-1 w-px bg-white/15" />
          {ROWS.map((row, i) => {
            const isRevealed = i < revealed;
            const isCurrent = i === revealed - 1;
            return (
              <div key={i}>
                {row.dayHeader && (
                  <div
                    className={i === 0 ? "mb-3" : "mb-3 mt-6"}
                    style={{
                      opacity: isRevealed ? 1 : 0,
                      transition: "opacity 500ms ease",
                    }}
                  >
                    <p className="-ml-9 font-display text-lg italic sm:text-xl">{row.dayHeader.day}</p>
                    <p className="-ml-9 text-[9px] uppercase tracking-[0.2em] text-white">
                      {row.dayHeader.date}
                    </p>
                  </div>
                )}
                <div className="relative flex items-baseline gap-3 pb-3.5 last:pb-0">
                  <span
                    className="absolute -left-9 top-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-white"
                    style={{
                      opacity: isRevealed ? 1 : 0.25,
                      boxShadow: isCurrent ? "0 0 0 4px rgba(255,255,255,0.18)" : "none",
                      transform: isCurrent ? "scale(1.25)" : "scale(1)",
                      transition: "opacity 600ms ease, box-shadow 600ms ease, transform 600ms ease",
                    }}
                  />
                  <span className="w-14 flex-shrink-0 text-[10px] uppercase tracking-[0.15em] text-white">
                    {row.time}
                  </span>
                  <span
                    className="font-display text-base italic sm:text-lg"
                    style={{
                      opacity: isRevealed ? 1 : 0.35,
                      transition: "opacity 650ms ease",
                    }}
                  >
                    {row.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
