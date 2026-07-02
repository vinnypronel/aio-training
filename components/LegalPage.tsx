"use client";

import { useEffect } from "react";

export type LegalClause = {
  heading: string;
  paragraphs: string[];
};

export default function LegalPage({
  title,
  effectiveDate,
  lastUpdated,
  intro,
  clauses,
}: {
  title: string;
  effectiveDate: string;
  lastUpdated: string;
  intro: string;
  clauses: LegalClause[];
}) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <section className="bg-aio-paper py-16 text-aio-ink md:py-24">
      <article className="mx-auto max-w-3xl px-6">
        <header className="border-b border-aio-ink/15 pb-8">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-aio-red">
            Legal
          </p>
          <h1 className="mt-3 font-brand-display text-4xl font-black uppercase leading-tight md:text-5xl">
            {title}
          </h1>
          <p className="mt-3 text-xl font-black">All In One Training</p>
          <dl className="mt-6 flex flex-col gap-1 text-sm sm:flex-row sm:gap-6">
            <div className="flex gap-2">
              <dt className="font-black">Effective Date:</dt>
              <dd>{effectiveDate}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-black">Last Updated:</dt>
              <dd>{lastUpdated}</dd>
            </div>
          </dl>
        </header>

        <div className="mt-8 space-y-4 text-lg font-medium leading-relaxed">
          <p>{intro}</p>
        </div>

        <div className="mt-12 space-y-10">
          {clauses.map((clause) => (
            <section key={clause.heading}>
              <h2 className="font-brand-display text-2xl font-black uppercase leading-tight">
                {clause.heading}
              </h2>
              <div className="mt-4 space-y-4 text-base font-medium leading-7">
                {clause.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </section>
  );
}
