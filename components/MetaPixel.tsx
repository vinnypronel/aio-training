"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  CONSENT_EVENT,
  getConsent,
  loadPixel,
  pageview,
  track,
} from "@/lib/pixel";

// Paths treated as "specific service or pricing content" for the ViewContent
// event, matching the language in the privacy policy.
const VIEW_CONTENT_PREFIXES = [
  "/pricing-packages",
  "/training-services",
  "/baseball-training",
];

function fireForPath(path: string) {
  pageview();
  if (VIEW_CONTENT_PREFIXES.some((p) => path.startsWith(p))) {
    track("ViewContent", { content_category: "service-or-pricing", path });
  }
}

export default function MetaPixel() {
  const pathname = usePathname();
  const pathRef = useRef(pathname);
  pathRef.current = pathname;
  const firstNav = useRef(true);

  // Activate on mount (returning visitor who already accepted) and whenever the
  // consent choice changes (visitor clicks Accept in the banner).
  useEffect(() => {
    function activate() {
      if (getConsent() !== "granted" || !loadPixel()) return;
      fireForPath(pathRef.current);
    }
    activate();
    window.addEventListener(CONSENT_EVENT, activate);
    return () => window.removeEventListener(CONSENT_EVENT, activate);
  }, []);

  // Fire on subsequent client navigations only. The first render is covered by
  // activate() above, so skip it here to avoid a duplicate PageView.
  useEffect(() => {
    if (firstNav.current) {
      firstNav.current = false;
      return;
    }
    if (getConsent() !== "granted" || !loadPixel()) return;
    fireForPath(pathname);
  }, [pathname]);

  // Clicks on contact links (phone / email) anywhere on the site.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (getConsent() !== "granted" || !window.fbq) return;
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.("a");
      const href = anchor?.getAttribute("href") || "";
      if (href.startsWith("tel:") || href.startsWith("mailto:")) {
        track("Contact", {
          method: href.startsWith("tel:") ? "phone" : "email",
        });
      }
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
