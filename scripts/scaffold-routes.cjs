const fs = require("fs");
const path = require("path");

const routes = [
  { dir: "accessibility", title: "Accessibility" },
  { dir: "baseball-training", title: "Baseball Training" },
  { dir: "basketball-training", title: "Basketball Training" },
  { dir: "contact-us", title: "Contact Us" },
  { dir: "events", title: "Events" },
  { dir: "events/football-skills-clinic", title: "Football Skills Clinic" },
  { dir: "events/grand-opening-combine", title: "Grand Opening Combine" },
  { dir: "football-training", title: "Football Training" },
  { dir: "personal-training", title: "Personal Training" },
  { dir: "pricing-packages", title: "Pricing & Packages" },
  { dir: "privacy", title: "Privacy" },
  { dir: "soccer-training", title: "Soccer Training" },
  { dir: "tos", title: "Terms of Service" },
  { dir: "training-services", title: "Training & Services" },
];

const componentName = (slug) =>
  slug
    .split("/")
    .pop()
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("") + "Page";

for (const { dir, title } of routes) {
  const full = path.join("app", dir);
  fs.mkdirSync(full, { recursive: true });
  const file = path.join(full, "page.tsx");
  if (fs.existsSync(file)) {
    console.log(`skip exists: ${file}`);
    continue;
  }
  const name = componentName(dir);
  const content = `export const metadata = {
  title: "${title} | AIO Training",
};

export default function ${name}() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 py-16">
      <h1 className="font-brand-display text-4xl font-black uppercase tracking-tight text-white md:text-6xl">
        ${title}
      </h1>
      <p className="mt-4 text-aio-body">Content coming soon.</p>
    </section>
  );
}
`;
  fs.writeFileSync(file, content);
  console.log(`wrote: ${file}`);
}
