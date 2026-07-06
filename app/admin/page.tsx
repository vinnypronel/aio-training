import Image from "next/image";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export const metadata = { title: "Admin | AIO Training" };

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) redirect("/admin/dashboard");

  return (
    <section className="flex min-h-[calc(100vh/var(--dz,1)-80px)] items-center justify-center bg-aio-black px-6">
      <div className="w-full max-w-[420px]">
        <div className="border border-aio-line bg-aio-panel">
          {/* Red accent top bar */}
          <div className="h-1 bg-aio-red" />

          <div className="px-8 pb-10 pt-8">
            {/* Logo */}
            <div className="flex justify-center">
              <Image
                src="/assets/images/aio-logo-reverse.png"
                alt="AIO Training"
                width={600}
                height={270}
                className="h-auto w-[140px]"
                priority
              />
            </div>

            {/* Divider */}
            <div className="mx-auto mt-6 h-px w-12 bg-aio-red" />

            <h1 className="mt-5 text-center font-brand-display text-2xl font-black uppercase leading-none tracking-wide">
              Admin Portal
            </h1>
            <p className="mt-2 text-center text-xs font-semibold text-aio-muted">
              Authorized access only
            </p>

            <LoginForm />
          </div>
        </div>

        <p className="mt-4 text-center text-[0.65rem] font-semibold text-aio-muted">
          &copy; {new Date().getFullYear()} All In One Training
        </p>
      </div>
    </section>
  );
}
