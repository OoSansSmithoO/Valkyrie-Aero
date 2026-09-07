import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms and Conditions | Valkyrie Aero" },
      { name: "description", content: "Terms for use of the Valkyrie Aero public demonstration website." },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <LegalPage eyebrow="PUBLIC SITE · CONDITIONS OF USE" title="Terms and Conditions" updated="SEPTEMBER 7, 2026">
      <section><h2>Demonstration purpose</h2><p>This website is provided for public information and demonstration. Content may describe current training activities, forward-looking concepts, or illustrative system behavior. It is not a solicitation, binding offer, operational directive, certification, or guarantee of future capability.</p></section>
      <section><h2>Permitted use</h2><p>You may view and link to the public site for lawful purposes. You may not attempt to disrupt the site, probe systems without authorization, misrepresent its content, or use its materials in a way that implies endorsement.</p></section>
      <section><h2>Intellectual property</h2><p>Unless expressly stated otherwise, site copy, branding, design, software, photographs, video, and other media remain protected by applicable intellectual-property rights. No open-source or media license is granted by display alone.</p></section>
      <section><h2>Third-party names</h2><p>Aircraft, product, military-service, and organization names may be trademarks or identifiers of their respective owners. Their appearance does not independently establish sponsorship or endorsement.</p></section>
      <section><h2>No warranty</h2><p>The site is provided as available for informational use. To the extent permitted by law, no warranty is made regarding uninterrupted availability, completeness, or fitness for a particular purpose.</p></section>
      <section><h2>Contact</h2><p>Questions regarding these terms may be directed to <a href="mailto:info@valkyrieaero.com">info@valkyrieaero.com</a>.</p></section>
    </LegalPage>
  );
}
