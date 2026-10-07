import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RouteTransition from "@/components/RouteTransition";
import AdminBadge from "@/components/AdminBadge";
import ScrollReveal from "@/components/ScrollReveal";
import MetaPixel from "@/components/MetaPixel";
import ConsentBanner from "@/components/ConsentBanner";
import Scrollbar from "@/components/Scrollbar";
import SmoothScroll from "@/components/SmoothScroll";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.trainingaio.com"),
  title: "AIO Training | Athlete Development in Central NJ",
  description:
    "All In One Training develops baseball, football, basketball, soccer, and personal training athletes across Middlesex and Monmouth County.",
  openGraph: {
    type: "website",
    siteName: "AIO Training",
    title: "AIO Training | Athlete Development in Central NJ",
    description:
      "Sport-specific training for baseball, football, basketball, soccer, and private athlete development in Central NJ.",
    images: [
      {
        url: "/assets/images/og-image.png",
        width: 1024,
        height: 1024,
        alt: "AIO Training | Athlete Development in Central NJ",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-aio-black text-white antialiased">
        {/* Proportional desktop downscale. The CSS `zoom: tan(atan2(100vw,1920px))`
            rule only works in newer Chrome; iPad Safari and older engines reject
            the trig expression, leaving the 1920px design at full size so it
            overflows and clips. Drive the same ratio (innerWidth / 1920) from JS
            so every browser >=1024px shows the identical composition, scaled.
            Runs before paint to avoid a flash; updates on resize and rotation. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){function s(){var w=window.innerWidth,h=document.documentElement;if(w>=1024){var z=w/1920;h.style.setProperty('--dz',z);h.style.zoom=z;}else{h.style.removeProperty('--dz');h.style.zoom='';}}s();window.addEventListener('resize',s);window.addEventListener('orientationchange',s);})();",
          }}
        />
        {/* Arm the reveal system before first paint so above-fold content
            enters instead of flashing. If hydration never happens (JS off or
            crashed), the failsafe un-hides everything after 4s. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('reveal-js');window.__revealFailsafe=setTimeout(function(){document.documentElement.classList.remove('reveal-js')},4000);",
          }}
        />
        <Nav />
        <main id="main-content" className="flex-1 pt-20 lg:pt-24 overflow-x-clip">{children}</main>
        <Footer />
        <RouteTransition />
        <AdminBadge />
        <SmoothScroll />
        <ScrollReveal />
        <MetaPixel />
        <ConsentBanner />
        <Scrollbar />
        <Analytics />
      </body>
    </html>
  );
}
