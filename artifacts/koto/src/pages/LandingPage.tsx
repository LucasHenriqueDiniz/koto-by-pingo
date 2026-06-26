import { useEffect } from 'react';
import { useUser } from '@clerk/react';
import { useLocation } from 'wouter';
import { updatePageSEO } from '@/utils/seo';
import { LandingHero } from '@/components/landing/LandingHero';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { ProductMockSection } from '@/components/landing/ProductMockSection';
import { LearningPathPreview } from '@/components/landing/LearningPathPreview';
import { GamificationSection } from '@/components/landing/GamificationSection';
import { AppDownloadSection } from '@/components/landing/AppDownloadSection';
import { FeaturesGrid } from '@/components/landing/FeaturesGrid';
import { FAQSection } from '@/components/landing/FAQSection';
import { CTAFinalSection } from '@/components/landing/CTAFinalSection';
import { Footer } from '@/components/layout/Footer';

export default function LandingPage() {
  const { user } = useUser();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      setLocation('/home');
    }
  }, [user, setLocation]);

  useEffect(() => {
    updatePageSEO(
      'Aprenda Japonês Grátis | Koto',
      'Hiragana, katakana e vocabulário N5 em treinos diários, 100% offline. Feito para brasileiros.'
    );
  }, []);

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-20">
        {/* 1. Hero */}
        <LandingHero />

        {/* 2. How it works (NEW) */}
        <section id="how-works">
          <HowItWorksSection />
        </section>

        {/* 3. Product demo */}
        <ProductMockSection />

        {/* 4. Learning path */}
        <section id="learning-path">
          <LearningPathPreview />
        </section>

        {/* 5. Gamification */}
        <GamificationSection />

        {/* 6. App download (NEW) */}
        <AppDownloadSection />

        {/* 7. Why Koto is different */}
        <FeaturesGrid />

        {/* 8. FAQ */}
        <FAQSection />

        {/* 9. Final CTA */}
        <CTAFinalSection />
      </div>
      <Footer />
    </div>
  );
}
