import { Outlet } from 'react-router-dom';
import { OnboardingHeader } from '@shared/ui/Header';

export function OnboardingLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <OnboardingHeader />

      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
