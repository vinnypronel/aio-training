import SportPage from "@/components/SportPage";

export const metadata = {
  title: "Basketball Training | AIO Training",
};

export default function BasketballTrainingPage() {
  return (
    <SportPage
      sport="Basketball Training"
      heroImage="/assets/images/basketball-hero-shooting.webp"
      heroImageAlt="Youth basketball player shooting on an outdoor court"
      heroLineOne="Take Over"
      heroLineTwo="The Court."
      heroBlurb="Basketball development for athletes building handle confidence, shooting consistency, lateral quickness, and two-way habits."
      introLabel="Core Philosophy"
      introTitle="The Foundation Of Dominance."
      introBody="AIO basketball training ties skill detail to the athletic qualities that let players separate, defend, finish, and compete with control."
      pillars={[
        { number: "01", title: "Ball Handling And IQ", body: "Handle pressure, read space, and make cleaner decisions with the ball." },
        { number: "02", title: "Shooting Mechanics", body: "Footwork, balance, release consistency, and shot prep in game-like situations." },
        { number: "03", title: "Defensive Principles", body: "Closeouts, lateral movement, containment angles, and help-side responsibility." },
        { number: "04", title: "Athletic Development", body: "Vertical force, first-step acceleration, mobility, and conditioning for the court." },
      ]}
      tiersIntro="The basketball path moves from foundation work to game-speed skill application."
      tiers={[
        { number: "01", ageLabel: "Ages 8-12", title: "Youth Development", body: "Base handle confidence, form shooting, footwork, and competitive intent." },
        { number: "02", ageLabel: "Ages 13-14", title: "Middle School", body: "Contact finishes, transition choices, screen reads, and defensive containment." },
        { number: "03", ageLabel: "Ages 15-18", title: "High School", body: "Advanced shot creation, multi-level scoring, conditioning, and team concepts.", callout: "Role, season timing, and goals guide the training block." },
      ]}
      program={{
        programLabel: "Basketball Program",
        programTitle: "Basketball Development",
        description: "Basketball sessions tie ball handling, shooting, defense, movement, and conditioning to the athlete's role.",
        scope: "Handle, shooting, defense, and athletic development",
        serviceArea: "Middlesex and Monmouth County athletes",
        tags: ["Shooting", "Handle", "Defense", "Conditioning"],
        ctaLabel: "Ask About Basketball Training",
      }}
      ctaWordmark="Court"
      ctaTitle="Build Court Habits That Hold."
      ctaBlurb="Bring the athlete's age, role, season timing, and the court skill that needs focused work."
    />
  );
}
