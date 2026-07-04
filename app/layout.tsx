import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RouteTransition from "@/components/RouteTransition";
import AdminBadge from "@/components/AdminBadge";

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
        url: "/assets/images/home-hero-poster.webp",
        width: 1200,
        height: 675,
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
    <html lang="en" className="h-full" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col bg-aio-black text-white antialiased">
        <Nav />
        <main className="flex-1 pt-20 lg:pt-24">{children}</main>
        <Footer />
        <RouteTransition />
        <AdminBadge />
      </body>
    </html>
  );
}
