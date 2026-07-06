import SportPage from "@/components/SportPage";

export const metadata = {
  title: "Baseball Training | AIO Training",
};

export default function BaseballTrainingPage() {
  return (
    <SportPage
      sport="Baseball Training"
      heroImage="/assets/images/baseball-hero-batting-cage.webp"
      heroImageAlt="Youth baseball player swinging a bat in an outdoor batting cage"
      heroImagePosition="object-[65%_center]"
      heroLineOne="Built For The"
      heroLineTwo="Diamond."
      heroBlurb="Precision and power development for hitters, pitchers, fielders, and baseball athletes building mechanics that hold up in games."
      introLabel="Our Baseball Program"
      introTitle="Mechanics, Power, And Game Transfer."
      introBody="AIO baseball sessions pair sport-specific skill work with the strength and movement qualities athletes need through a long season."
      pillars={[
        { number: "01", title: "Hitting Mechanics", body: "Swing path, contact point, lower-half timing, and repeatable bat speed." },
        { number: "02", title: "Pitching Development", body: "Throwing patterns, arm care, mound confidence, and velocity-safe progressions." },
        { number: "03", title: "Fielding And Running", body: "First-step work, glove position, base running reads, and defensive confidence." },
        { number: "04", title: "Strength And Durability", body: "Rotational power, lower-body force, shoulder control, and season-ready capacity." },
      ]}
      tiersIntro="Training intensity and detail scale with age, training history, and season timing."
      tiers={[
        { number: "01", ageLabel: "Ages 8-12", title: "Youth Development", body: "Fundamentals, coordination, confidence, and safe athletic movement." },
        { number: "02", ageLabel: "Ages 13-14", title: "Middle School", body: "Big-diamond adjustments, early resistance training, and sharper skill detail." },
        { number: "03", ageLabel: "Ages 15-18", title: "High School", body: "Advanced mechanics, physical maturity, and game-speed decision making.", callout: "Position, season timing, and goals guide the training block." },
      ]}
      program={{
        programLabel: "Baseball Program",
        programTitle: "Baseball Development",
        description: "Baseball sessions are built around hitting, throwing, fielding, strength transfer, and the athlete's current season needs.",
        scope: "Hitting, fielding, throwing, and strength transfer",
        serviceArea: "Middlesex and Monmouth County athletes",
        tags: ["Hitting", "Fielding", "Throwing", "Strength"],
        ctaLabel: "Ask About Baseball Training",
      }}
      ctaWordmark="Prospect"
      ctaWordmarkClassName="md:!right-[25px]"
      ctaTitle={
        <>
          Build Your<br /><span className="text-black">Baseball Plan.</span>
        </>
      }
      ctaBlurb="Tell us the athlete's age, position, season timing, and current training goal."
    />
  );
}
