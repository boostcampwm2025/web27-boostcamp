import { MainHeader } from './sections/MainHeader';
import { HeroSection } from './sections/HeroSection';
import { FeatureSection } from './sections/FeatureSection';
import { HighIntentSection } from './sections/HighIntentSection';
import { AuctionLogSection } from './sections/AuctionLogSection';
import { MonetizeSection } from './sections/MonetizeSection';
import { MainFooter } from './sections/MainFooter';

export function MainPage() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <MainHeader />

      <main>
        <HeroSection />
        <FeatureSection />
        <HighIntentSection />
        <AuctionLogSection />
        <MonetizeSection />
      </main>

      <MainFooter />
    </div>
  );
}
