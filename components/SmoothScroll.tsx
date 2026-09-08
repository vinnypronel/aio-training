"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // Accessibility: disable smooth scrolling if user prefers reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Initialize Lenis with inertial momentum configuration from SMOOTH_SCROLL_GUIDE.md
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    window.__lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Intercept clicks on anchor links starting with '#' to scroll smoothly with Lenis
    function handleAnchorClick(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        const element = document.querySelector(href);
        if (element) {
          e.preventDefault();
          lenis.scrollTo(element as HTMLElement, { offset: -80 });
        }
      }
    }

    document.addEventListener("click", handleAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  // Handle route navigation: reset scroll position or scroll to target hash
  useEffect(() => {
    if (!window.__lenis) return;

    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        window.__lenis.scrollTo(target as HTMLElement, { offset: -80, immediate: false });
        return;
      }
    }

    window.__lenis.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
