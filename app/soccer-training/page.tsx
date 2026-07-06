import SportPage from "@/components/SportPage";

export const metadata = {
  title: "Soccer Training | AIO Training",
};

export default function SoccerTrainingPage() {
  return (
    <SportPage
      sport="Soccer Training"
      heroImage="/assets/images/soccer-training-hero.webp"
      heroImageAlt="Youth soccer player on the field"
      heroImagePosition="object-[60%_center]"
      heroLineOne="Win The"
      heroLineTwo="First Touch."
      heroBlurb="Technical and athletic development for players who want a cleaner touch, sharper footwork, and the speed to take over on the ball."
      introLabel="Our Soccer Program"
      introTitle="Cleaner Touch, Sharper Decisions."
      introBody="AIO soccer sessions train the ball skills, footwork, and conditioning a player needs to stay comfortable under pressure and make faster reads on the field."
      pillars={[
        { number: "01", title: "Ball Mastery And First Touch", body: "Close control, both feet, and a settling touch that buys time in tight space." },
        { number: "02", title: "Passing And Receiving", body: "Weight and timing on the pass, body shape to receive, and play under pressure." },
        { number: "03", title: "1v1 Attacking And Defending", body: "Change of pace, feints, contained pressure, and recovery angles on defense." },
        { number: "04", title: "Speed, Agility, And Footwork", body: "Acceleration, cutting mechanics, ladder footwork, and reactive change of direction." },
      ]}
      tiersIntro="The soccer path scales from base ball control to game-speed application in small-sided play."
      tiers={[
        { number: "01", ageLabel: "Ages 8-12", title: "Youth Development", body: "Ball control, both-foot touch, coordination, and confidence on the ball." },
        { number: "02", ageLabel: "Ages 13-14", title: "Middle School", body: "Receiving under pressure, passing range, 1v1 detail, and sharper footwork." },
        { number: "03", ageLabel: "Ages 15-18", title: "High School", body: "Finishing, position-specific work, conditioning, and small-sided reads.", callout: "Position, season timing, and goals guide the training block." },
      ]}
      program={{
        programLabel: "Soccer Program",
        programTitle: "Soccer Development",
        description: "Soccer sessions connect ball mastery, passing, 1v1 play, finishing, and conditioning to the player's position and season.",
        scope: "Touch, passing, 1v1, finishing, and conditioning",
        serviceArea: "Middlesex and Monmouth County athletes",
        tags: ["First Touch", "Passing", "1v1", "Footwork"],
        ctaLabel: "Ask About Soccer Training",
      }}
      ctaWordmark="Pitch"
      ctaWordmarkClassName="!right-[45px]"
      ctaTitle="Build A Sharper Soccer Player."
      ctaBlurb="Tell us the player's age, position, season timing, and the skill that needs focused work."
    />
  );
}
