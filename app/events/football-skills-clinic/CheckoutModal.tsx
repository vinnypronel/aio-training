"use client";

import { useCallback, useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface CheckoutModalProps {
  formData: {
    parentName: string;
    email: string;
    phone: string;
    athletes: Array<{ name: string; ageGroup: string; sport: string }>;
    selectedDays: string[];
    emergencyNotes: string;
  };
  onClose: () => void;
}

export default function CheckoutModal({ formData, onClose }: CheckoutModalProps) {
  const [error, setError] = useState("");

  useEffect(() => {
    // Save original body overflow styling
    const originalStyle = window.getComputedStyle(document.body).overflow;
    // Lock scrolling on mount
    document.body.style.overflow = "hidden";

    // Restore styling when unmounted
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const fetchClientSecret = useCallback(async () => {
    setError("");
    const res = await fetch("/api/checkout/clinic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok || !data.clientSecret) {
      setError(data.error || "Failed to start checkout. Please try again.");
      throw new Error(data.error || "No client secret");
    }

    return data.clientSecret;
  }, [formData]);

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-black/85 p-4 pt-[140px] backdrop-blur-sm">
      {/* Modal */}
      <div className="relative w-full max-w-[540px]">
        {/* Header bar */}
        <div className="flex items-center justify-between bg-aio-black px-6 py-4 border border-aio-line border-b-0">
          <div>
            <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-aio-red">
              Secure Checkout
            </p>
            <p className="mt-0.5 text-sm font-black text-white">
              AIO Football Skills Group Session
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex cursor-pointer items-center gap-1.5 text-[0.65rem] font-black uppercase tracking-[0.14em] text-aio-muted transition hover:text-white"
            aria-label="Close checkout"
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
            Cancel
          </button>
        </div>

        {/* Stripe Embedded Checkout */}
        <div className="border border-aio-line bg-white">
          {error ? (
            <div className="p-8 text-center">
              <p className="text-sm font-bold text-red-600">{error}</p>
              <button
                onClick={onClose}
                className="mt-4 border border-gray-300 px-6 py-2 text-xs font-bold uppercase text-gray-700 hover:border-gray-500"
              >
                Go Back
              </button>
            </div>
          ) : (
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ fetchClientSecret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 border border-aio-line border-t-0 bg-aio-black px-6 py-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="h-3.5 w-3.5 text-aio-muted"
          >
            <rect x={3} y={11} width={18} height={11} rx={2} ry={2} />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className="text-[0.58rem] font-semibold text-aio-muted">
            Payments secured by Stripe · SSL encrypted
          </span>
        </div>
      </div>
    </div>
  );
}
