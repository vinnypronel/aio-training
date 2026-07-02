import LegalPage from "@/components/LegalPage";

export const metadata = {
  title: "Terms of Service | AIO Training",
};

export default function TosPage() {
  return (
    <LegalPage
      title="Terms of Service"
      effectiveDate="May 4, 2026"
      lastUpdated="June 30, 2026"
      intro="These Terms of Service explain the baseline rules for using the All In One Training website and requesting services. By using the site, you agree to these Terms and any policies referenced here."
      clauses={[
        {
          heading: "Acceptance of Terms",
          paragraphs: [
            "By using this website or requesting services from All In One Training, you agree to these Terms of Service and to any service-specific policies presented at booking, intake, checkout, or in writing. If you do not agree, please do not use the website or request services.",
          ],
        },
        {
          heading: "Services",
          paragraphs: [
            "All In One Training provides the services described on this website. Availability, scheduling, pricing, and the specific terms of any service may change, and the terms that apply to a particular service are the ones confirmed at booking, checkout, or in writing.",
            "Descriptions on this website are general information, not an offer or a guarantee of a specific result.",
          ],
        },
        {
          heading: "Minors, Participation, and Health",
          paragraphs: [
            "Some programs are intended for minors. A parent or guardian must give permission before a minor participates, submits information, signs a waiver, or makes a payment, and is responsible for that minor's participation. Training and physical activity carry inherent risks. Participants should be in suitable health to take part and should disclose any condition that affects safe participation, and All In One Training may require a signed waiver, medical clearance, or agreement to venue and conduct rules before or during a session. Program descriptions and prior outcomes are not a promise of any specific result, which depends on individual effort, consistency, and other factors outside our control.",
          ],
        },
        {
          heading: "Cancellation And Package Expiration Policy",
          paragraphs: [
            "Scheduling and consistency are critical for athlete development. Private and small-group training sessions canceled with less than 24 hours notice are subject to full forfeiture/charge. Multi-session training packages (such as 3-packs, 5-packs, or 10-packs) expire 90 days from the purchase date, and any unused sessions after expiration are forfeited.",
          ],
        },
        {
          heading: "Media Release And Photo Consent",
          paragraphs: [
            "All In One Training may photograph or record video of sessions and program participants for instructional, training, and promotional use (including social media and website marketing). By participating, parents and legal guardians consent to such photography and recording of minor athletes unless they explicitly opt out in writing to All In One Training prior to the sessions.",
          ],
        },
        {
          heading: "Liability Release And Indemnification",
          paragraphs: [
            "By participating in training sessions, programs, or combines, you acknowledge the risk of injury and agree to defend, indemnify, and hold harmless All In One Training, its owner Jon Guzman, its coaches, and its venue partners from any and all claims, injuries, damages, or liabilities arising out of or related to the athlete's physical participation.",
          ],
        },
        {
          heading: "Intellectual Property",
          paragraphs: [
            "The content on this website, including text, images, logos, graphics, and service descriptions, is owned by All In One Training or used with permission and is protected by intellectual property laws. You may view and use the website for your own personal, non-commercial purposes. You may not copy, republish, scrape, sell, or reuse website content without written permission.",
          ],
        },
        {
          heading: "Acceptable Use",
          paragraphs: [
            "You agree to use this website lawfully. You agree not to interfere with or disrupt the website or its security, attempt to gain unauthorized access to any system or account, scrape or harvest information about other visitors, upload malicious code, or use the website to harass, defraud, or impersonate anyone. We may suspend or restrict access when use of the website is unsafe, abusive, or unlawful.",
          ],
        },
        {
          heading: "Third-Party Links and Embedded Services",
          paragraphs: [
            "This website may link to or embed third-party services that we do not control.",
            "Those third parties operate under their own terms and privacy policies. We are not responsible for the content, availability, or practices of services we do not control, and your use of them is at your own risk.",
          ],
        },
        {
          heading: "Payments",
          paragraphs: [
            "When something on this website is available to purchase, payments are one-time charges processed by Stripe through Stripe-hosted checkout. Your card details go directly to Stripe and are never stored on this website. Refund requests are reviewed case by case. Email Trainingallin1@gmail.com or call (714) 440-8053.",
          ],
        },
        {
          heading: "Disclaimer of Warranties",
          paragraphs: [
            "This website and the information on it are provided on an as-is and as-available basis, without warranties of any kind, whether express or implied, including the implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the website will be uninterrupted, error-free, or free of harmful components, or that the information on it is complete or current. Information on this website is general and is not professional, medical, legal, or financial advice.",
          ],
        },
        {
          heading: "Limitation of Liability",
          paragraphs: [
            "To the fullest extent permitted by law, All In One Training, together with its owners, employees, and contractors, is not liable for any indirect, incidental, consequential, special, or punitive damages arising out of or related to your use of this website or any inability to use it. Where liability cannot be excluded, it is limited to the amount you paid, if any, for the specific service or item giving rise to the claim. Some jurisdictions do not allow certain limitations, so some of these limits may not apply to you.",
          ],
        },
        {
          heading: "Governing Law",
          paragraphs: [
            "These Terms are governed by the laws of the State of New Jersey, without regard to its conflict-of-laws rules. Any dispute will be brought in the state or federal courts located in New Jersey.",
          ],
        },
        {
          heading: "Changes to These Terms",
          paragraphs: [
            "We may update these Terms from time to time. The Last Updated date at the top of this page reflects the most recent revision, and material changes are noted at the top of the page when reasonable. Continued use of the website after an update means you accept the revised Terms.",
          ],
        },
        {
          heading: "Contact Us",
          paragraphs: [
            "Questions about these Terms are welcome. Email Trainingallin1@gmail.com or call (714) 440-8053.",
          ],
        },
      ]}
    />
  );
}
