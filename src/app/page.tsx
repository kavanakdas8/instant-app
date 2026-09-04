import HeroLanding from "@/components/HeroLanding";
import FooterLanding from "@/components/FooterLanding";

export default function HomePage() {
  return (
    <main className="min-h-screen w-full bg-black">
      {/* Hero Section */}
      <HeroLanding />
      {/* Footer */}
      <FooterLanding />
    </main>
  );
}
