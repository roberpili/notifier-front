import { HeroComponent } from "@/components/hero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifier | Home",
};

export default function HomePage() {
  return (
    <main className="main">
      <HeroComponent />
    </main>
  );
}
