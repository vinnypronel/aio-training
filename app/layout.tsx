import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RouteTransition from "@/components/RouteTransition";

export const metadata: Metadata = {
  title: "AIO Training | Athlete Development in Central NJ",
  description:
    "All In One Training develops baseball, football, basketball, soccer, and personal training athletes across Middlesex and Monmouth County.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-aio-black text-white antialiased">
        <Nav />
        <main className="flex-1 pt-20 lg:pt-24">{children}</main>
        <Footer />
        <RouteTransition />
      </body>
    </html>
  );
}
