import LegalPage from "@/components/LegalPage";

export const metadata = {
  title: "Accessibility Statement | AIO Training",
};

export default function AccessibilityPage() {
  return (
    <LegalPage
      title="Accessibility Statement"
      effectiveDate="May 4, 2026"
      lastUpdated="June 30, 2026"
      intro="This accessibility statement explains how All In One Training approaches the accessibility of this website: what we have done, how we test, and how to reach us about an accessibility problem."
      clauses={[
        {
          heading: "Our Commitment to Accessibility",
          paragraphs: [
            "All In One Training is committed to making this website usable by as many people as possible, including people who rely on assistive technologies. We treat accessibility as ongoing work rather than a one-time task.",
          ],
        },
        {
          heading: "Target Standard",
          paragraphs: [
            "We use the Web Content Accessibility Guidelines (WCAG) 2.2, Level AA, as our target standard. We aim to meet this standard and treat it as a goal we keep working toward. We do not claim that the website meets every success criterion.",
          ],
        },
        {
          heading: "Measures We Take",
          paragraphs: [
            "We build accessibility into how this website is made. Measures include semantic HTML structure, theme colors checked for contrast, automated axe-core accessibility checks that run as part of our launch checks, and support for the prefers-reduced-motion setting so motion can be reduced.",
          ],
        },
        {
          heading: "How We Test",
          paragraphs: [
            "We check this website with automated accessibility tooling, including axe-core, as part of our launch checks, and we aim to follow up with manual review. We have not recorded a formal accessibility evaluation for this website, so this statement does not claim a completed audit.",
          ],
        },
        {
          heading: "Assessment Date",
          paragraphs: [
            "A formal evidence-based assessment date has not been recorded for this website yet. Automated testing and manual review are ongoing.",
          ],
        },
        {
          heading: "Known Limitations",
          paragraphs: [
            "Some parts of this website may not yet meet our target standard. Known limitations include some third-party tools, media, or email software that may not meet the same accessibility standard as the rest of the site.",
            "If you run into a problem that is not listed here, please tell us. Email Trainingallin1@gmail.com or call (714) 440-8053.",
          ],
        },
        {
          heading: "Feedback",
          paragraphs: [
            "We welcome your feedback on the accessibility of this website. If you find a barrier, please let us know. Email Trainingallin1@gmail.com or call (714) 440-8053.",
            "We take all feedback seriously and aim to respond to accessibility inquiries or barrier reports within 3 business days.",
          ],
        },
        {
          heading: "Ongoing Work",
          paragraphs: [
            "Conformance with accessibility standards is ongoing work for this website. We review and improve accessibility over time, and we update this statement as that work continues.",
          ],
        },
      ]}
    />
  );
}
