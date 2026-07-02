import LegalPage from "@/components/LegalPage";

export const metadata = {
  title: "Privacy Policy | AIO Training",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      effectiveDate="May 4, 2026"
      lastUpdated="June 30, 2026"
      intro="This Privacy Policy explains how All In One Training collects, uses, and protects the information shared through this website. It is written in plain English so you understand what we collect and why."
      clauses={[
        {
          heading: "Information We Collect",
          paragraphs: [
            "We collect the information you choose to share when you contact All In One Training through this website. The contact form asks for name, email, phone, message, athlete name, guardian name, athlete age, sport, session, shirt size, emergency note, and guardian consent.",
            "We store form submissions securely in our local server databases for record keeping and communication purposes.",
            "The web host also keeps standard server logs (IP address, browser type, pages visited, and time of visit) for security and reliability. This website uses cookies to support essential functions, such as user sessions, system security, and processing checkout payments through Stripe, as well as optional tracking cookies when you consent to Meta Pixel measurement.",
          ],
        },
        {
          heading: "How We Use Information",
          paragraphs: [
            "We use the information you share to respond to a training inquiry, register a youth athlete for the Grand Opening Combine event, and process a one-time event registration payment.",
            "We do not sell personal information.",
          ],
        },
        {
          heading: "How We Share Information",
          paragraphs: [
            "We share information with the service providers that help us operate this website, and only what each provider needs to do its work. These include: the website host, which runs the servers and keeps the standard server logs described above, and Amazon SES, which delivers contact-form submissions to the business by email. Any payment, advertising, or analytics services this website uses are described in their own sections below.",
            "We also share information when the law requires it, to protect our rights or safety, or to respond to a lawful request. We do not sell personal information.",
            "SMS Consent: No mobile phone numbers or opt-in information collected for SMS updates and communications will be shared with third parties or affiliates for marketing or promotional purposes. All the above categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.",
          ],
        },
        {
          heading: "Payment Processing",
          paragraphs: [
            "When you pay through this website, checkout and card processing happen on Stripe-hosted Checkout under Stripe's own privacy policy. Your card details go directly to Stripe and are never stored on this site. The site keeps only the Stripe session and payment references needed to confirm your payment.",
          ],
        },
        {
          heading: "Advertising Measurement (Meta Pixel)",
          paragraphs: [
            "This website uses Meta ads measurement (the Meta Pixel) to understand which ads and pages lead visitors to get in touch. It can record consent-gated events such as page views, views of specific service or pricing content, clicks on contact links, and successful contact requests, so we can measure those outcomes. Tracking loads only after you accept it through the consent banner. If you decline or ignore the banner, the pixel does not load and no measurement events are sent. Form field contents are never sent to Meta.",
          ],
        },
        {
          heading: "How Long We Keep Information",
          paragraphs: [
            "Contact and event-registration submissions are emailed to the business and stored in the Site form-submissions table. Card details stay inside Stripe and are never stored in Payload. No fixed deletion schedule has been set by the business yet.",
          ],
        },
        {
          heading: "Data Security",
          paragraphs: [
            "We use reasonable administrative, technical, and physical safeguards to protect the information we hold, and the website is served over HTTPS. No website, email system, or electronic storage method is fully secure, so we cannot guarantee absolute security.",
          ],
        },
        {
          heading: "Reviewing and Changing Your Information",
          paragraphs: [
            "You can ask us to review, update, correct, or delete the contact information we hold for you, and you can ask us to stop sending non-essential messages. Email Trainingallin1@gmail.com or call (714) 440-8053. We respond within a reasonable time.",
          ],
        },
        {
          heading: "Do Not Track",
          paragraphs: [
            "Some browsers can send a Do Not Track signal. There is no common industry standard for how to respond to that signal, so this website does not change its behavior in response to Do Not Track. The advertising and analytics measurement this website runs is consent-gated and described above; it loads only after you accept it through the consent banner.",
          ],
        },
        {
          heading: "Global Privacy Control",
          paragraphs: [
            "Where the law requires it, we treat a Global Privacy Control (GPC) signal sent by your browser as a valid request to opt out of the sale or sharing of personal information. This website uses consent-gated advertising and analytics measurement, which can involve sharing personal information for cross-context behavioral advertising. Unless you have deliberately accepted measurement through the consent banner, a GPC signal keeps that measurement from loading, the same outcome as declining the banner. If you do choose to accept measurement, that choice is honored even while GPC is on.",
          ],
        },
        {
          heading: "California Privacy Rights",
          paragraphs: [
            "Under California law, including the California Online Privacy Protection Act, California residents can ask what categories of personal information we collect, ask to review or correct that information, and ask us to delete it. We do not sell personal information. To exercise these rights, email Trainingallin1@gmail.com or call (714) 440-8053.",
          ],
        },
        {
          heading: "Other State Privacy Rights",
          paragraphs: [
            "If you live in a state with its own consumer privacy law (including California, Colorado, Connecticut, Virginia, Utah, and others as those laws take effect), you may have rights to access, correct, delete, or limit the use of your personal information. Email Trainingallin1@gmail.com or call (714) 440-8053.",
          ],
        },
        {
          heading: "Children's Privacy",
          paragraphs: [
            "This website is not intended for children under 13 to submit personal information directly. All In One Training may receive information about a minor when a parent, guardian, or the minor submits it through this website, for example to register for a program, and a parent or guardian should submit website requests on behalf of a minor. If you believe a child provided personal information directly without a parent or guardian, contact us so we can review and remove it.",
          ],
        },
        {
          heading: "Changes to This Policy",
          paragraphs: [
            "We may update this Privacy Policy from time to time. The Last Updated date at the top of this page reflects the most recent revision, and material changes are flagged at the top of the page when reasonable. Continued use of the website after an update means you accept the revised policy.",
          ],
        },
        {
          heading: "Contact Us",
          paragraphs: [
            "Questions about this Privacy Policy are welcome. Email Trainingallin1@gmail.com or call (714) 440-8053.",
          ],
        },
      ]}
    />
  );
}
