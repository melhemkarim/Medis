export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand px-6 text-center">
      <div className="max-w-md rounded-sm border border-white/40 bg-white/95 px-8 py-10 text-navy shadow-[0_20px_60px_rgba(2,20,30,0.35)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/medispharm-logo.png" alt="MedisPharm" className="mx-auto h-9 w-auto" />
        <h1 className="mt-6 font-display text-2xl font-semibold text-brand">
          We couldn&apos;t find that invitation.
        </h1>
        <p className="mt-4 text-sm text-navy/60">
          Double check the link, or contact us directly.
        </p>
      </div>
    </main>
  );
}
