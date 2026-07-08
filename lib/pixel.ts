// Client-only Meta Pixel helper. Every function is a safe no-op on the server,
// before consent is granted, or when no Pixel ID is configured. The pixel script
// is never injected until loadPixel() is called, which only happens after the
// visitor accepts measurement through the consent banner.

const CONSENT_KEY = "aio-consent"; // "granted" | "denied"
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export const CONSENT_EVENT = "aio-consent-change";

type Consent = "granted" | "denied" | null;

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[];
      loaded?: boolean;
      version?: string;
    };
    _fbq?: unknown;
    __aioPixelLoaded?: boolean;
  }
}

export function getConsent(): Consent {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(CONSENT_KEY);
  return v === "granted" || v === "denied" ? v : null;
}

export function setConsent(value: "granted" | "denied") {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

// Inject the Meta Pixel base code once. Returns false (and does nothing) when
// there is no Pixel ID configured, so the plumbing is safe to ship before the
// business pastes its real ID.
export function loadPixel(): boolean {
  if (typeof window === "undefined") return false;
  if (!PIXEL_ID) return false;
  if (window.__aioPixelLoaded) return true;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  (function (f: any, b: Document, e: string, v: string) {
    if (f.fbq) return;
    const n: any = (f.fbq = function () {
      n.callMethod
        ? n.callMethod.apply(n, arguments)
        : n.queue.push(arguments);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s.parentNode?.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable @typescript-eslint/no-explicit-any */

  window.__aioPixelLoaded = true;
  window.fbq?.("init", PIXEL_ID);
  return true;
}

export function pageview() {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", "PageView");
}

export function track(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", event, params);
}
