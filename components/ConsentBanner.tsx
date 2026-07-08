"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getConsent, setConsent } from "@/lib/pixel";

const DISMISS_KEY = "aio-consent-dismissed"; // session-only "ask me later"

export default function ConsentBanner() {
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Already made a lasting choice, or dismissed for this browser session.
    if (getConsent() !== null) return;
    if (window.sessionStorage.getItem(DISMISS_KEY)) return;
    setShow(true);
    // Next frame so the entrance transition runs.
    const id = window.setTimeout(() => setVisible(true), 20);
    return () => window.clearTimeout(id);
  }, []);

  function close() {
    setVisible(false);
    window.setTimeout(() => setShow(false), 300);
  }

  function accept() {
    setConsent("granted"); // dispatches the consent-change event -> pixel loads
    close();
  }

  function decline() {
    setConsent("denied");
    close();
  }

  function dismiss() {
    // Not a lasting choice: reappears on the next visit, pixel stays off.
    window.sessionStorage.setItem(DISMISS_KEY, "1");
    close();
  }

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie and measurement consent"
      className="fixed inset-x-0 bottom-0 z-[90] px-4 pb-4"
    >
      <div
        className={`mx-auto max-w-[1180px] transition-all duration-300 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <div className="relative border border-aio-line bg-aio-panel/95 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.6)] backdrop-blur md:flex md:items-center md:gap-8 md:p-6">
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss for now"
            className="absolute right-2 top-2 flex h-10 w-10 cursor-pointer items-center justify-center text-white/50 transition hover:text-aio-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aio-red"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              className="h-4 w-4"
            >
              <line x1={18} y1={6} x2={6} y2={18} />
              <line x1={6} y1={6} x2={18} y2={18} />
            </svg>
          </button>

          <div className="flex-1 pr-8 md:pr-0">
            <p className="text-[0.65rem] font-black uppercase tracking-[0.22em] text-aio-red">
              Your Privacy
            </p>
            <p className="mt-2 max-w-[720px] text-sm font-semibold leading-6 text-aio-body">
              We use essential cookies to run the site and process checkout. With
              your okay, we also use the Meta Pixel to measure which ads and pages
              lead people to reach out. Nothing you type in a form is sent to Meta.
              <span className="block mt-1.5 md:inline md:mt-0 whitespace-nowrap">
                {" "}
                <Link
                  href="/privacy"
                  className="font-black text-white underline decoration-aio-red decoration-2 underline-offset-4 cursor-pointer transition hover:text-aio-red"
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </p>
          </div>

          <div className="mt-5 flex shrink-0 gap-3 md:mt-0">
            <button
              type="button"
              onClick={decline}
              className="flex-1 border border-white/35 px-6 py-3 text-xs font-black uppercase tracking-[0.1em] text-white cursor-pointer transition hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aio-red md:flex-none"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={accept}
              className="flex-1 bg-aio-red px-6 py-3 text-xs font-black uppercase tracking-[0.1em] text-white cursor-pointer transition hover:bg-aio-red-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:flex-none"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
