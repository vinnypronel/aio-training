import Link from "next/link";
import Image from "next/image";
import MobileMenu from "@/components/MobileMenu";
import NavLinks from "@/components/NavLinks";
import HeaderButtons from "@/components/HeaderButtons";

export default function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-aio-line bg-aio-black shadow-[0_1px_0_rgba(255,255,255,0.04)]">
      <div className="mx-auto flex h-20 max-w-[1580px] items-center justify-between px-5 md:px-6 lg:h-24">
        <Link
          href="/"
          aria-label="All In One Training, home"
          className="group flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aio-red focus-visible:ring-offset-2 focus-visible:ring-offset-aio-black"
        >
          <Image
            src="/assets/images/aio-logo-reverse.png"
            alt="All In One Training"
            width={600}
            height={270}
            priority
            className="h-auto w-[132px] sm:w-[150px] lg:w-[168px]"
          />
        </Link>

        <NavLinks />

        <HeaderButtons />

        <MobileMenu />
      </div>
    </nav>
  );
}

