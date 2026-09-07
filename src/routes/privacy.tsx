import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Valkyrie Aero" },
      { name: "description", content: "Privacy practices for the Valkyrie Aero public website." },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <LegalPage eyebrow="PUBLIC SITE · DATA PRACTICES" title="Privacy Policy" updated="SEPTEMBER 7, 2026">
      <section><h2>Overview</h2><p>This public demonstration website presents Valkyrie Aero training and aviation capabilities. It does not provide user accounts, accept payments, or intentionally collect sensitive personal information.</p></section>
      <section><h2>Information handled</h2><p>The site does not currently include a contact form or analytics service. If you contact Valkyrie Aero through your own email application, your message is handled by the email providers and recipients involved in that communication.</p></section>
      <section><h2>Cookies and local storage</h2><p>The site does not intentionally set advertising or analytics cookies. It may store small preferences in your browser to remember whether the optional cinematic briefing has already been viewed and whether day or night display mode was selected. Those preferences remain on your device.</p></section>
      <section><h2>Hosting and operational logs</h2><p>GitHub Pages hosts this site and may process ordinary request information such as IP addresses, browser details, and access logs under GitHub's own privacy practices.</p></section>
      <section><h2>External services</h2><p>Links or email actions may open services operated by third parties. Their privacy practices apply when you use them.</p></section>
      <section><h2>Changes and contact</h2><p>This notice may be updated as site features change. Questions may be directed to <a href="mailto:info@valkyrieaero.com">info@valkyrieaero.com</a>.</p></section>
    </LegalPage>
  );
}
