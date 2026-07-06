"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="flex min-h-[calc(70vh/var(--dz,1))] flex-col items-center justify-center bg-aio-black px-6 text-center text-white">
      <p className="text-xs font-black uppercase tracking-[0.28em] text-aio-red">
        Error
      </p>
      <h1 className="mt-4 font-brand-display text-[clamp(2rem,6vw,4rem)] font-black uppercase leading-none">
        False Start.
      </h1>
      <p className="mt-4 max-w-[420px] text-sm font-semibold text-aio-muted">
        Something went wrong loading this page.
      </p>
      <button
        onClick={reset}
        className="mt-8 inline-flex min-h-12 items-center bg-aio-red px-8 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:bg-aio-red-hover"
      >
        Try Again
      </button>
    </section>
  );
}
