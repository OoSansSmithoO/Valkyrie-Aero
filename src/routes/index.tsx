import { createFileRoute } from "@tanstack/react-router";
import { CinematicIntro } from "@/components/intro/CinematicIntro";
import { Homepage } from "@/components/site/Homepage";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main className="min-h-dvh bg-void text-paper">
      <Homepage />
      <CinematicIntro />
    </main>
  );
}
