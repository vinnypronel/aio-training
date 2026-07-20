"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

type Phase = "hidden" | "enter" | "exit";

const COVER_MS = 450;
const HOLD_MS = 80;
const EXIT_MS = 450;
const PROGRESS_START_DELAY_MS = 170;

export default function RouteTransition() {
  const pathname = usePathname();
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("hidden");
  const [progress, setProgress] = useState(0);
  const pendingHref = useRef<string | null>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as Element | null)?.closest(
        "a",
      ) as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("http://") ||
        href.startsWith("https://")
      ) {
        return;
      }

      let url: URL;
      try {
        url = new URL(href, window.location.origin);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === pathname) return;

      e.preventDefault();
      pendingHref.current = url.pathname + url.search + url.hash;
      setProgress(0);
      setPhase("enter");

      window.setTimeout(() => {
        if (pendingHref.current) {
          router.push(pendingHref.current);
          pendingHref.current = null;
        }
      }, COVER_MS);
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname, router]);

  const lastSettled = useRef(pathname);
  useEffect(() => {
    if (pathname === lastSettled.current) return;
    lastSettled.current = pathname;

    if (phase !== "enter") return;

    const exitTimer = window.setTimeout(() => setPhase("exit"), HOLD_MS);
    const hideTimer = window.setTimeout(
      () => setPhase("hidden"),
      HOLD_MS + EXIT_MS,
    );
    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(hideTimer);
    };
  }, [pathname, phase]);

  useEffect(() => {
    let frame = 0;

    if (phase === "hidden") {
      frame = window.requestAnimationFrame(() => setProgress(0));
      return () => window.cancelAnimationFrame(frame);
    }

    if (phase === "exit") {
      frame = window.requestAnimationFrame(() => setProgress(100));
      return () => window.cancelAnimationFrame(frame);
    }

    const start = performance.now() + PROGRESS_START_DELAY_MS;

    const tick = (now: number) => {
      if (now < start) {
        setProgress(0);
        frame = window.requestAnimationFrame(tick);
        return;
      }

      const elapsed = now - start;
      const nextProgress = Math.min(92, Math.round((elapsed / COVER_MS) * 92));
      setProgress(nextProgress);

      if (elapsed < COVER_MS) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [phase]);

  const visible = phase !== "hidden";

  return (
    <div
      aria-hidden={!visible}
      className="pointer-events-none fixed inset-0 z-[200]"
    >
      <div
        className={`absolute inset-0 bg-aio-black ${
          phase === "hidden"
            ? "-translate-y-full"
            : phase === "enter"
              ? "translate-y-0 transition-transform duration-[450ms] ease-out"
              : "-translate-y-full transition-transform duration-[450ms] ease-in"
        }`}
      />
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 ${
          phase === "enter" ? "opacity-100 delay-150" : "opacity-0"
        }`}
      >
        <div className="mb-5 h-1 w-16 -skew-x-[18deg] bg-aio-red" />
        <Image
          src="/assets/images/aio-logo-reverse.png"
          alt=""
          width={600}
          height={270}
          priority
          className="h-auto w-[270px] sm:w-[330px]"
        />
        <p className="mt-5 text-xs font-black uppercase tracking-[0.32em] text-aio-red-on-dark">
          All In One Training
        </p>
        <div className="mt-7 w-[260px] sm:w-[320px]">
          <div className="h-1.5 overflow-hidden bg-white/10">
            <div
              className="h-full bg-[linear-gradient(90deg,#a86f17,#e5b451,#f7d27a,#b67a1d)] transition-[width] duration-150 ease-out"
              style={{
                width: `${progress}%`,
                transitionDuration: progress === 0 ? "0ms" : "150ms",
              }}
            />
          </div>
          <p className="mt-3 text-center font-brand-display text-sm font-black uppercase tracking-[0.2em] text-[#e5b451]">
            {progress}%
          </p>
        </div>
      </div>
    </div>
  );
}
