import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingHero } from '@/components/landing/LandingHero';
import { ProblemComparison } from '@/components/landing/ProblemComparison';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { ConversionBlocks } from '@/components/landing/ConversionBlocks';
import { SmartBioCreationDemo } from '@/components/landing/SmartBioCreationDemo';
import { AiOnboardingSection } from '@/components/landing/AiOnboardingSection';
import { RecommendationToConversionSection } from '@/components/landing/RecommendationToConversionSection';
import { TrackingIntegrationSection } from '@/components/landing/TrackingIntegrationSection';
import { PricingCards } from '@/components/landing/PricingCards';
import { FAQ } from '@/components/landing/FAQ';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { Footer } from '@/components/landing/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/10">
      <LandingNavbar />
      <main>
        <LandingHero />
        <ProblemComparison />
        <HowItWorks />
        <ConversionBlocks />
        <SmartBioCreationDemo />
        <AiOnboardingSection />
        <RecommendationToConversionSection />
        <TrackingIntegrationSection />
        <PricingCards />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
