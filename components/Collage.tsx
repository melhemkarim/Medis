"use client";

import { motion } from "framer-motion";

// Same single photo used across the whole site — see components/InviteCard.tsx
const PHOTO = "/images/photo-1.jpg";

export default function Collage() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-brand-deep">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.16), transparent 42%), radial-gradient(circle at 85% 10%, rgba(255,255,255,0.10), transparent 38%), radial-gradient(circle at 50% 100%, rgba(0,0,0,0.35), transparent 50%)",
        }}
      />
      <motion.img
        src={PHOTO}
        alt=""
        className="relative h-full w-full object-cover"
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      <div className="absolute inset-0 bg-brand mix-blend-color" />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-deep/80 via-brand-deep/60 to-brand-deep/90" />
      <div className="absolute inset-0 bg-grain" />
    </div>
  );
}
