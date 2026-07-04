import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import HoverButton from "@/components/HoverButton";

export const metadata = {
  title: "Contact Us | AIO Training",
};

const contactInfo = [
  { label: "Phone", value: "(714) 440-8053", href: "tel:+17144408053" },
  {
    label: "Email",
    value: "Trainingallin1@gmail.com",
    href: "mailto:Trainingallin1@gmail.com",
  },
  {
    label: "Session Locations",
    value: "Confirmed by schedule before each athlete arrives for training.",
  },
  {
    label: "Service Area",
    value:
      "Scheduled sessions across Middlesex and Monmouth County at permitted fields, courts, or availability-dependent partner facilities.",
  },
];

const reasons = [
  {
    title: "Fast Response",
    body: "Call, text, or email with the athlete's sport, age, schedule, and goal.",
  },
  {
    title: "Direct Coach Access",
    body: "Questions route to AIO for program guidance, not an anonymous intake queue.",
  },
  {
    title: "No Pressure",
    body: "Start with a coach conversation about the right fit for the athlete.",
  },
];

export default function ContactUsPage() {
  return (
    <>
      <section className="relative -mt-20 flex h-[100svh] min-h-[560px] items-center overflow-hidden bg-aio-black text-white lg:-mt-24">
        <Image
          src="/assets/images/contact-hero-coach-consult.webp"
          alt="Coach consulting with an athlete and parent"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[image:var(--aio-hero-gradient)] opacity-95 mix-blend-multiply"
        />
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 pt-24 lg:pt-32">
          <div className="h-1 w-12 -skew-x-[18deg] bg-aio-red" />
          <p className="mt-3 text-xs font-black uppercase tracking-[0.28em] text-aio-red">
            Support Online
          </p>
          <h1 className="mt-4 max-w-[920px] font-brand-display text-balance text-[clamp(2.75rem,8vw,6.5rem)] font-black uppercase leading-[0.9]">
            Let&apos;s Get <span className="text-aio-red">To Work.</span>
          </h1>
          <p className="mt-7 max-w-[680px] text-base font-semibold leading-8 text-white md:text-lg">
            Ready to book a session or ask about a program? Send the athlete&apos;s sport, age, and goal so AIO can point you to the right next step.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <HoverButton href="tel:+17144408053">
              Call AIO
            </HoverButton>
            <HoverButton href="mailto:Trainingallin1@gmail.com" variant="outline">
              Email AIO
            </HoverButton>
          </div>
        </div>
      </section>

      <section className="bg-aio-paper pt-20 pb-8 md:pt-24 md:pb-10">
        <div className="mx-auto grid max-w-[1280px] gap-8 px-6 lg:grid-cols-[1fr_1fr] lg:items-stretch">
          {/* Left — contact info card */}
          <div className="bg-white p-8 text-aio-ink shadow-[0_12px_40px_rgba(0,0,0,0.18)] md:p-10">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-aio-red">
              Get In Touch
            </p>
            <h2 className="mt-2 font-brand-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-black uppercase leading-none">
              Contact AIO Training.
            </h2>
            <p className="mt-4 max-w-[520px] text-sm font-semibold leading-7 text-aio-ink/75">
              Text, call, or email to ask about training options. For detailed
              program questions, include the athlete&apos;s sport, age, and
              season timing.
            </p>
            <dl className="mt-6 space-y-4">
              {contactInfo.map((item) => (
                <div
                  key={item.label}
                  className="border-l-4 border-aio-red bg-aio-paper p-6"
                >
                  <dt className="text-sm font-black uppercase tracking-[0.18em] text-aio-red">
                    {item.label}
                  </dt>
                  <dd className="mt-3 text-base font-semibold leading-7 text-aio-ink">
                    {item.href ? (
                      <a
                        href={item.href}
                        className="font-black text-aio-ink transition hover:text-aio-red [overflow-wrap:anywhere]"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span className="font-black text-aio-ink">{item.value}</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right — dark form card */}
          <div id="contact-form" className="bg-aio-black px-6 py-10 text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] md:px-10 md:py-12">
            <h2 className="font-brand-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-black uppercase leading-none">
              Send Us A Message
            </h2>
            <p className="mt-4 text-sm font-semibold leading-7 text-aio-body">
              Send a message through the secure AIO contact form. Do not include medical details, injury notes, or sensitive health information here.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="bg-aio-paper pb-16 md:pb-20">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="grid gap-5 md:grid-cols-3">
            {reasons.map((r) => (
              <article
                key={r.title}
                className="bg-white p-6 text-aio-ink shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
              >
                <h3 className="font-brand-display text-xl font-black uppercase leading-none">
                  {r.title}
                </h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-aio-ink/65">
                  {r.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-aio-red py-16 text-white md:py-20">
        <span aria-hidden className="pointer-events-none absolute right-[calc(-5%+425px)] top-1/2 -translate-y-1/2 -mt-[60px] select-none font-brand-display text-[16rem] font-black uppercase leading-none text-white/10">
          CALL
        </span>
        <div className="relative mx-auto flex max-w-[1280px] flex-col gap-6 px-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[760px]">
            <p className="text-xs font-black uppercase tracking-[0.24em]">
              Prefer To Talk?
            </p>
            <h2 className="mt-3 font-brand-display text-[clamp(2.5rem,6vw,5rem)] font-black uppercase leading-[0.9]">
              Call AIO Training.
            </h2>
            <p className="mt-5 max-w-[620px] text-base font-bold leading-8">
              Talk through the athlete&apos;s sport, age, schedule, and training goal.
            </p>
          </div>
          <div className="translate-y-[35px]">
            <HoverButton href="tel:+17144408053" variant="black">
              Call (714) 440-8053
            </HoverButton>
          </div>
        </div>
      </section>
    </>
  );
}
