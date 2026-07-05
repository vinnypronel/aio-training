"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const STAGGER_MS = 80;
const MAX_STAGGER_MS = 560;

declare global {
  interface Window {
    __revealFailsafe?: ReturnType<typeof setTimeout>;
  }
}

/**
 * Site-wide scroll-reveal driver. Mounted once in the root layout.
 *
 * Tag elements with `data-reveal` (or `data-reveal="fade"`) to have them
 * animate in the first time they enter the viewport. Put `data-reveal-group`
 * on a container to cascade its `data-reveal` children with a stagger.
 * Elements only animate once; styles live in globals.css and respect
 * prefers-reduced-motion there.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    // The inline script in layout.tsx adds this class before first paint and
    // arms a failsafe that removes it if hydration never happens. We own the
    // class from here on.
    clearTimeout(window.__revealFailsafe);
    document.documentElement.classList.add("reveal-js");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return; // CSS never hides anything for reduced-motion users
    }

    const reveal = (el: HTMLElement, delay = 0) => {
      if (delay) el.style.setProperty("--reveal-delay", `${delay}ms`);
      el.classList.add("is-revealed");
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = entry.target as HTMLElement;
          io.unobserve(target);
          if (target.hasAttribute("data-reveal-group")) {
            const items = Array.from(
              target.querySelectorAll<HTMLElement>("[data-reveal]")
            ).filter((el) => !el.classList.contains("is-revealed"));
            items.forEach((el, i) =>
              reveal(el, Math.min(i * STAGGER_MS, MAX_STAGGER_MS))
            );
          } else if (!target.classList.contains("is-revealed")) {
            reveal(target);
          }
        }
      },
      // Fire once the element clears the bottom ~8% of the viewport.
      { rootMargin: "0px 0px -8% 0px", threshold: 0 }
    );

    document
      .querySelectorAll<HTMLElement>("[data-reveal-group]")
      .forEach((group) => io.observe(group));
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      if (!el.closest("[data-reveal-group]") && !el.classList.contains("is-revealed")) {
        io.observe(el);
      }
    });

    return () => io.disconnect();
  }, [pathname]);

  return null;
}
