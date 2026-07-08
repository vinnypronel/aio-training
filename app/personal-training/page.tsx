import SportPage from "@/components/SportPage";

export const metadata = {
  title: "Personal Training | AIO Training",
};

export default function PersonalTrainingPage() {
  return (
    <SportPage
      sport="Personal Training"
      heroImage="/assets/images/personal-training-hero.webp"
      heroImageAlt="Coach working one on one with a youth athlete"
      heroLineOne="Built One Rep"
      heroLineTwo="At A Time."
      heroBlurb="Private coaching for athletes who need focused attention, custom programming, and a training block built around one athlete at a time."
      introLabel="Precision Over Protocol"
      introTitle="One Athlete. One Focused Plan."
      introBody="Private training is for athletes who need coaching attention on the details that group sessions can miss."
      pillars={[
        { number: "01", title: "Full Coach Attention", body: "Execution, safety, and technical correction stay centered on one athlete." },
        { number: "02", title: "Customized Programming", body: "Training blocks match sport, age, baseline, schedule, and current capacity." },
        { number: "03", title: "Accelerated Progression", body: "Progressions move when the athlete is ready instead of waiting on a group cycle." },
        { number: "04", title: "Flexible Focus Areas", body: "Strength, speed, mobility, return-to-play, or skill transfer can lead the session." },
      ]}
      tiersLight
      tiersLabel="Platform Architecture"
      tiersTitle={"The\u00a01:1\u00a0Blueprint"}
      tiersIntro="Private sessions map the starting point, build the block, and keep the next action clear."
      tiers={[
        { number: "01", ageLabel: "Step 01", title: "Individual Assessment", body: "Movement, strength, mobility, skill, and confidence baselines." },
        { number: "02", ageLabel: "Step 02", title: "Training Integration", body: "Strength, conditioning, movement quality, and sport transfer in one plan." },
        { number: "03", ageLabel: "Step 03", title: <>Progress<br />Review</>, body: "Coach feedback keeps the next block aligned with the athlete's current work." },
      ]}
      program={{
        programLabel: "Personal Training Program",
        programTitle: "Private Athlete Development",
        programName: "AIO TRAINING",
        tagLabel: "Lead Personal Trainer",
        description: "Jon Guzman leads AIO Training with a focus on private athlete development, sport-transfer work, and session plans built around the athlete in front of him.",
        scope: "Private strength, speed, skill transfer, and mobility work",
        serviceArea: "Middlesex and Monmouth County athletes",
        tags: ["Strength", "Speed", "Mobility", "Skill Transfer"],
        ctaLabel: "Ask About Personal Training",
      }}
      ctaWordmark="Intent"
      ctaTitle={
        <>
          Book Focused<br /><span className="text-black">1:1 Work.</span>
        </>
      }
      ctaBlurb="Private sessions are planned around the athlete's sport, schedule, movement needs, and next competitive moment."
    />
  );
}
