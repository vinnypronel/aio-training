"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const backdrops = [
  {
    key: "huddle",
    src: "/assets/images/pricing-hero-athlete-huddle.webp",
    position: "object-bottom",
  },
  {
    key: "baseball",
    src: "/assets/images/pricing-parallax-baseball.webp",
    position: "object-center",
  },
  {
    key: "basketball",
    src: "/assets/images/pricing-parallax-basketball.webp",
    position: "object-center",
  },
  {
    key: "football",
    src: "/assets/images/pricing-parallax-football.webp",
    position: "object-center",
  },
];

function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}

export default function PricingScrollBackdrops() {
  const [weights, setWeights] = useState<Record<string, number>>({});

  useEffect(() => {
    let frame = 0;

    const update = () => {
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-pricing-bg]")
      );
      const viewportCenter = window.innerHeight / 2;
      const nextWeights: Record<string, number> = {};

      for (const section of sections) {
        const key = section.dataset.pricingBg;
        if (!key) continue;

        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const reach = Math.max(window.innerHeight * 0.78, rect.height * 0.45);
        const weight = clamp(1 - Math.abs(sectionCenter - viewportCenter) / reach);
        nextWeights[key] = Math.max(nextWeights[key] ?? 0, weight);
      }

      setWeights(nextWeights);
      frame = 0;
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const strongest = Math.max(0, ...Object.values(weights));

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 bg-aio-black transition-opacity duration-500"
      style={{ opacity: strongest > 0 ? 1 : 0 }}
    >
      {backdrops.map((backdrop) => (
        <Image
          key={backdrop.key}
          src={backdrop.src}
          alt=""
          fill
          sizes="100vw"
          className={`object-cover ${backdrop.position} transition-opacity duration-700 ease-out`}
          style={{ opacity: (weights[backdrop.key] ?? 0) * 0.58 }}
        />
      ))}
      <div className="absolute inset-0 bg-[image:linear-gradient(120deg,rgba(10,10,10,0.42),rgba(10,10,10,0.16),rgba(10,10,10,0.5))]" />
    </div>
  );
}
