"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Status = "idle" | "submitting" | "done" | "error";
type Choice = "yes" | "no";

export default function RSVPForm({ name, slug }: { name: string; slug: string }) {
  const [attending, setAttending] = useState<Choice | null>(null);
  const [plusOne, setPlusOne] = useState<Choice | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  // The plus-one question only makes sense if they're actually coming.
  const needsPlusOne = attending === "yes";
  const canConfirm = attending === "no" || (attending === "yes" && plusOne !== null);

  async function submit() {
    if (!canConfirm) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          attending,
          plusOne: needsPlusOne ? plusOne : null,
        }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="font-display text-3xl italic text-[#4e2a6e]">
          {attending === "yes" ? "We look forward to seeing you." : "Thank you for letting us know."}
        </p>
        {attending === "yes" && (
          <p className="mt-2 text-sm text-[#4e2a6e]/60">
            {plusOne === "yes" ? "See you and your plus one there." : "See you there."}
          </p>
        )}
        <p className="mt-3 text-sm text-[#4e2a6e]/60">Your response has been recorded.</p>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-center gap-3">
        {(["yes", "no"] as const).map((choice) => (
          <button
            key={choice}
            onClick={() => {
              setAttending(choice);
              if (choice === "no") setPlusOne(null);
            }}
            className={`rounded-sm border px-6 py-2 text-sm uppercase tracking-[0.15em] transition-colors ${
  attending === choice
    ? "border-[#4e2a6e] bg-[#4e2a6e] text-white"
    : "border-[#4e2a6e]/40 text-[#4e2a6e]/80 hover:border-[#4e2a6e] hover:text-[#4e2a6e]"
}`}
          >
            {choice === "yes" ? " Accept" : " Decline"}
          </button>
        ))}
      </div>

      {needsPlusOne && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex flex-col items-center gap-3"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[#4e2a6e]/70">Bringing a plus one?</p>
          <div className="flex justify-center gap-3">
            {(["yes", "no"] as const).map((choice) => (
              <button
                key={choice}
                onClick={() => setPlusOne(choice)}
                className={`rounded-sm border px-6 py-1.5 text-xs uppercase tracking-[0.15em] transition-colors ${
  plusOne === choice
    ? "border-[#4e2a6e] bg-[#4e2a6e] text-white"
    : "border-[#4e2a6e]/40 text-[#4e2a6e]/80 hover:border-[#4e2a6e] hover:text-[#4e2a6e]"
}`}
              >
                {choice === "yes" ? "Yes" : "No"}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {attending && canConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 flex justify-center"
        >
          <button
            onClick={submit}
            disabled={status === "submitting"}
            className="rounded-sm bg-[#4e2a6e] px-8 py-2.5 text-sm font-medium uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {status === "submitting" ? "Sending..." : "Confirm response"}
          </button>
        </motion.div>
      )}

      {status === "error" && (
        <p className="mt-3 text-center text-sm text-red-200">
          Something went wrong sending your response — please try again.
        </p>
      )}
    </div>
  );
}
