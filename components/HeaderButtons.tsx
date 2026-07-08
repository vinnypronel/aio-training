"use client";

import { useState } from "react";
import Link from "next/link";

export default function HeaderButtons() {
  return (
    <div className="hidden items-center gap-3 lg:flex">
      <HeaderPhoneButton />
      <HeaderGetStartedButton />
    </div>
  );
}

function HeaderPhoneButton() {
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsHovered(true);
  };

  return (
    <a
      href="tel:+17144408053"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative inline-flex min-h-11 items-center justify-center overflow-hidden border border-aio-line-strong px-4 text-xs font-black tracking-[0.08em] uppercase text-white transition-colors duration-300 hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aio-red focus-visible:ring-offset-2 focus-visible:ring-offset-aio-black"
    >
      <span className="relative z-10 mix-blend-difference">(714) 440-8053</span>
      <span
        className={`pointer-events-none absolute rounded-full bg-white -translate-x-1/2 -translate-y-1/2 transition-all ${
          isHovered ? "duration-[1400ms] ease-in-out" : "duration-[800ms] ease-out"
        }`}
        style={{
          left: hoverPos.x,
          top: hoverPos.y,
          width: isHovered ? "360px" : "0px",
          height: isHovered ? "360px" : "0px",
          mixBlendMode: "difference",
        }}
      />
    </a>
  );
}

function HeaderGetStartedButton() {
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsHovered(true);
  };

  return (
    <Link
      href="/booking"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative inline-flex min-h-11 items-center justify-center overflow-hidden bg-aio-red px-5 text-xs font-black tracking-[0.1em] uppercase text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-aio-black"
    >
      <span className={`relative z-10 transition-colors duration-300 ${isHovered ? "text-aio-red" : "text-white"}`}>
        Book Now
      </span>
      <span
        className={`pointer-events-none absolute rounded-full bg-white -translate-x-1/2 -translate-y-1/2 transition-all ${
          isHovered ? "duration-[600ms] ease-in-out" : "duration-[400ms] ease-out"
        }`}
        style={{
          left: hoverPos.x,
          top: hoverPos.y,
          width: isHovered ? "800px" : "0px",
          height: isHovered ? "800px" : "0px",
        }}
      />
    </Link>
  );
}
