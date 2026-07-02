"use client";

import { useState } from "react";
import Image from "next/image";

export default function FlyerDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-aio-line">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between p-5 text-left transition hover:bg-white/5"
      >
        <span className="text-xs font-black uppercase tracking-[0.16em] text-white">
          View Clinic Flyer
        </span>
        <span className="text-lg font-black text-aio-red">
          {open ? "−" : "+"}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          open ? "max-h-[1000px]" : "max-h-0"
        }`}
      >
        <div className="border-t border-aio-line bg-aio-black p-2">
          <Image
            src="/assets/images/football-skills-clinic-flyer.webp"
            alt="AIO Football Skills Clinic flyer"
            width={600}
            height={750}
            className="h-auto w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
