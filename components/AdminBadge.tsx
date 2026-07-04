"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { logout } from "@/app/admin/actions";

export default function AdminBadge() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/status")
      .then((r) => r.json())
      .then((d) => {
        if (active) setIsAdmin(!!d.isAdmin);
      })
      .catch(() => {
        // not signed in / request failed — leave the badge hidden
      });
    return () => {
      active = false;
    };
  }, []);

  if (!isAdmin) return null;

  return (
    <div className="fixed bottom-4 left-20 z-[45] flex items-center gap-2">
      <Link
        href="/admin/dashboard"
        aria-label="Admin mode — go to dashboard"
        className="inline-flex items-center gap-2 border border-aio-red/50 bg-aio-black/90 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-aio-red shadow-[0_8px_24px_rgba(0,0,0,0.5)] backdrop-blur transition hover:border-aio-red hover:text-aio-red-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aio-red focus-visible:ring-offset-2 focus-visible:ring-offset-aio-black"
      >
        <span className="h-2 w-2 rounded-full bg-aio-red" />
        Admin Mode
      </Link>
      <form action={logout}>
        <button
          type="submit"
          className="inline-flex items-center border border-aio-line-strong bg-aio-black/90 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white shadow-[0_8px_24px_rgba(0,0,0,0.5)] backdrop-blur transition hover:border-white hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-aio-black"
        >
          Log Out
        </button>
      </form>
    </div>
  );
}
