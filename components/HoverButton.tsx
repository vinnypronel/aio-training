"use client";

import { useState } from "react";
import Link from "next/link";

type Variant = "red" | "black" | "outline";

type BaseProps = {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
};

type LinkProps = BaseProps & {
  href: string;
  type?: never;
  disabled?: never;
  onClick?: never;
};

type ButtonProps = BaseProps & {
  href?: never;
  type?: "submit" | "button";
  disabled?: boolean;
  onClick?: () => void;
};

type Props = LinkProps | ButtonProps;

const baseClass =
  "group relative inline-flex min-h-12 cursor-pointer items-center justify-center overflow-hidden px-6 text-sm font-black uppercase tracking-[0.08em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

const variantStyles: Record<Variant, { container: string; textHover: string; blob: string }> = {
  red: {
    container:
      "bg-aio-red text-white shadow-[var(--aio-shadow-red)] focus-visible:ring-white focus-visible:ring-offset-aio-black",
    textHover: "text-aio-red",
    blob: "bg-white",
  },
  black: {
    container:
      "bg-aio-black text-white focus-visible:ring-white focus-visible:ring-offset-aio-red",
    textHover: "text-aio-black",
    blob: "bg-white",
  },
  outline: {
    container:
      "border border-white/35 text-white hover:border-white focus-visible:ring-white focus-visible:ring-offset-aio-black",
    textHover: "text-aio-black",
    blob: "bg-white",
  },
};

export default function HoverButton({
  children,
  variant = "red",
  className = "",
  ...rest
}: Props) {
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const v = variantStyles[variant];

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const inner = (
    <>
      <span
        className={`relative z-10 transition-colors duration-300 ${isHovered ? v.textHover : ""}`}
      >
        {children}
      </span>
      <span
        className={`pointer-events-none absolute rounded-full ${v.blob} transition-all duration-1000 ease-out -translate-x-1/2 -translate-y-1/2`}
        style={{
          left: hoverPos.x,
          top: hoverPos.y,
          width: isHovered ? "800px" : "0px",
          height: isHovered ? "800px" : "0px",
        }}
      />
    </>
  );

  const sharedProps = {
    onMouseEnter: () => setIsHovered(true),
    onMouseMove: handleMouseMove,
    onMouseLeave: () => setIsHovered(false),
    className: `${baseClass} ${v.container} ${className}`,
  };

  if ("href" in rest && rest.href) {
    const isExternal =
      rest.href.startsWith("http") ||
      rest.href.startsWith("mailto:") ||
      rest.href.startsWith("tel:") ||
      rest.href.startsWith("#");

    if (isExternal) {
      return (
        <a href={rest.href} {...sharedProps}>
          {inner}
        </a>
      );
    }

    return (
      <Link href={rest.href} {...sharedProps}>
        {inner}
      </Link>
    );
  }

  const { type = "button", disabled, onClick } = rest as ButtonProps;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      {...sharedProps}
      className={`${sharedProps.className} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {inner}
    </button>
  );
}
