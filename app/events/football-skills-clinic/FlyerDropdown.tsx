"use client";

import { useState } from "react";
import Image from "next/image";

export default function FlyerDropdown() {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-l-4 border-aio-red">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between p-5 text-left transition hover:bg-white/5"
        aria-expanded={open}
      >
        <span className="text-xs font-black uppercase tracking-[0.16em] text-white">
          View Group Session Flyer
        </span>
        <span
          className="text-lg font-black text-aio-red transition-transform duration-300"
          style={{ display: "inline-block", transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          +
        </span>
      </button>

      {/*
        CSS grid-template-rows trick: animates from 0fr → 1fr
        This is the smoothest CSS height animation — no max-height jump,
        no layout shift, and the inner div stays in document flow so
        Good To Know naturally slides down.
      */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div className="px-5 pb-5">
            <Image
              src="/assets/images/group_session_flyer.png"
              alt="AIO Football Skills Group Session flyer"
              width={600}
              height={750}
              className="h-auto max-h-[500px] w-full object-contain mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

