import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

const APP_NAME = "Valkyrie Aero";
const PAGE_TITLE = "A-29 Super Tucano Pilot Training | Valkyrie Aero";
const PAGE_DESCRIPTION =
  "Valkyrie Aero delivers military air-school, JTAC, and A-29 Super Tucano pilot training while developing emerging counter-UAS mission capabilities.";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESCRIPTION },
      { name: "application-name", content: APP_NAME },
      { name: "author", content: "Valkyrie Aero" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      {
        name: "keywords",
        content:
          "Valkyrie Aero, A-29 Super Tucano, military pilot training, air school, JTAC training, tactical aviation, counter-UAS",
      },
      { name: "theme-color", content: "#06162f" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: APP_NAME },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESCRIPTION },
      { property: "og:image", content: "https://oosanssmithoo.github.io/Valkyrie-Aero/og.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: "Valkyrie Aero A-29 Super Tucano pilot training at Falcon Field",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: PAGE_TITLE },
      { name: "twitter:description", content: PAGE_DESCRIPTION },
      { name: "twitter:image", content: "https://oosanssmithoo.github.io/Valkyrie-Aero/og.jpg" },
    ],
    links: [
      { rel: "canonical", href: "https://oosanssmithoo.github.io/Valkyrie-Aero/" },
      { rel: "icon", type: "image/svg+xml", href: "favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "brand/valkyrie-mark.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Barlow:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  component: () => (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-void text-paper">
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
