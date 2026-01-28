import { useState } from 'react';
import { MainHeader } from './sections/MainHeader';
import { HeroSection } from './sections/HeroSection';
import { FeatureSection } from './sections/FeatureSection';
import { HighIntentSection } from './sections/HighIntentSection';
import { AuctionLogSection } from './sections/AuctionLogSection';
import { MonetizeSection } from './sections/MonetizeSection';
import { MainFooter } from './sections/MainFooter';
import { RoleToggle } from './components/RoleToggle';
import type { RoleType } from './components/RoleToggle';
import { ScrollReveal } from '@shared/ui/ScrollReveal';

export function MainPage() {
  const [role, setRole] = useState<RoleType>('advertiser');

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <MainHeader />

      <main>
        <HeroSection />

        <div className="bg-white py-8">
          <ScrollReveal className="flex justify-center">
            <RoleToggle value={role} onChange={setRole} />
          </ScrollReveal>
        </div>

        {role === 'advertiser' ? (
          <>
            <FeatureSection />
            <HighIntentSection />
            <AuctionLogSection />
          </>
        ) : (
          <MonetizeSection />
        )}
      </main>

      <MainFooter />
    </div>
  );
}
