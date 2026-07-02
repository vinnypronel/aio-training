import SportPage from "@/components/SportPage";

export const metadata = {
  title: "Football Training | AIO Training",
};

export default function FootballTrainingPage() {
  return (
    <SportPage
      sport="Football Performance"
      heroImage="/assets/images/football-hero-turf.webp"
      heroImageAlt="Youth football athlete sprinting on outdoor turf"
      heroLineOne="Own The"
      heroLineTwo="Gridiron."
      heroBlurb="Position-specific football development for athletes building speed, power, body control, and confidence inside the lines."
      introLabel="The Methodology"
      introTitle="Build The Total Player."
      introBody="Football sessions connect movement, strength, role-specific technique, and game understanding so athletes can train with purpose."
      pillars={[
        { number: "01", title: "Position-Specific Training", body: "Footwork, stance, release, backpedal, leverage, and contact skills mapped to role." },
        { number: "02", title: "Speed And Agility", body: "Acceleration, deceleration, change of direction, hip control, and reactive burst." },
        { number: "03", title: "Strength And Power", body: "Ground force, collision readiness, trunk stiffness, and durable athletic mass." },
        { number: "04", title: "Game IQ", body: "Situational awareness, assignment detail, and decision making under fatigue." },
      ]}
      tiersTitle="Athlete Development Pipeline"
      tiersIntro="The training block changes as the athlete moves from foundation work to high school demands."
      tiers={[
        { number: "01", ageLabel: "Ages 8-12", title: "Youth Development", body: "Movement basics, safe contact patterns, and early football coordination." },
        { number: "02", ageLabel: "Ages 13-14", title: "Middle School", body: "Position detail, leverage, core strength, and speed mechanics." },
        { number: "03", ageLabel: "Ages 15-18", title: "High School", body: "Varsity-level conditioning, speed work, and role-specific intensity.", callout: "Position, season timing, and goals guide the training block." },
      ]}
      program={{
        programLabel: "Football Program",
        programTitle: "Football Development",
        description: "Football sessions connect position work, speed, strength, and game awareness for the athlete's current role.",
        scope: "Position technique, speed, strength, and game IQ",
        serviceArea: "Middlesex and Monmouth County athletes",
        tags: ["Speed", "Agility", "Strength", "Game IQ"],
        ctaLabel: "Ask About Football Training",
      }}
      ctaWordmark="Dominate"
      ctaTitle="Train For The Next Down."
      ctaBlurb="Start with the athlete's age, position, season schedule, and the skill gap that matters most."
    />
  );
}
