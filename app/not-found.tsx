import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center bg-aio-black px-6 text-center text-white">
      <p className="text-xs font-black uppercase tracking-[0.28em] text-aio-red">
        404
      </p>
      <h1 className="mt-4 font-brand-display text-[clamp(2.5rem,8vw,5rem)] font-black uppercase leading-none">
        Out Of Bounds.
      </h1>
      <p className="mt-4 max-w-[420px] text-sm font-semibold text-aio-muted">
        That page doesn&apos;t exist. Head back and get back in the game.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-12 items-center bg-aio-red px-8 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:bg-aio-red-hover"
      >
        Back To Home
      </Link>
    </section>
  );
}
