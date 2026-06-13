import { BanksSection } from "@/components/landing/BanksSection";
import { HelpFab } from "@/components/landing/HelpFab";
import { HeroSection } from "@/components/landing/HeroSection";
import { SchemesSection } from "@/components/landing/SchemesSection";
import { StickyNavbar } from "@/components/landing/StickyNavbar";

export default function Home() {
  return (
    <div className="min-h-screen">
      <StickyNavbar />
      <HeroSection />
      <SchemesSection />
      <BanksSection />
      <HelpFab />
    </div>
  );
}
