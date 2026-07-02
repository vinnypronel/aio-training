"use client";

import { useState } from "react";

export default function CallCTAButton() {
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <a
      href="tel:+17144408053"
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsHovered(false)}
      className="relative inline-flex min-h-12 items-center justify-center overflow-hidden bg-aio-black px-6 text-sm font-black uppercase tracking-[0.08em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-aio-red"
    >
      <span className="relative z-10 mix-blend-difference">Call (714) 440-8053</span>
      <span
        className="pointer-events-none absolute rounded-full bg-white transition-all duration-700 ease-out -translate-x-1/2 -translate-y-1/2"
        style={{
          left: hoverPos.x,
          top: hoverPos.y,
          width: isHovered ? "600px" : "0px",
          height: isHovered ? "600px" : "0px",
          mixBlendMode: "difference",
        }}
      />
    </a>
  );
}
