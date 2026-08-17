import Collage from "@/components/Collage";

export default function Home() {
  return (
    <>
      <Collage />
      <main className="relative flex min-h-screen items-center justify-center px-6 text-center">
        <div className="max-w-md rounded-sm border border-white/40 bg-white/95 px-8 py-10 text-navy shadow-[0_20px_60px_rgba(2,20,30,0.35)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/medispharm-logo.png" alt="MedisPharm" className="mx-auto h-9 w-auto" />
          <h1 className="mt-6 font-display text-2xl font-semibold text-brand">
            This invitation is personal.
          </h1>
          <p className="mt-4 text-sm text-navy/60">
            Please use the private link sent to you by email or WhatsApp to view your invitation.
          </p>
        </div>
      </main>
    </>
  );
}
