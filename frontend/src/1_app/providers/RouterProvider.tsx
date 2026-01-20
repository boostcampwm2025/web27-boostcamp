import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout, OnboardingLayout } from '@app/layouts';
import { AdvertiserDashboardPage } from '@pages/advertiserDashboard';
import { AdvertiserCampaignsPage } from '@pages/advertiserCampaigns';
import { AdvertiserBudgetPage } from '@pages/advertiserBudget';
import { NotFoundPage } from '@pages/notFound';
import { RegisterPage } from '@/2_pages/auth/ui/RegisterPage';
import { LoginPage } from '@/2_pages/auth/ui/LoginPage';
import { PublisherDashboardPage } from '@pages/publisherDashboard';
import { PublisherEarningsPage } from '@pages/publisherEarnings';
import { PublisherSettingsPage } from '@pages/publisherSettings';
import { OnboardingSdkGuidePageSkeleton } from '@pages/onboardingSdkGuide';
import { CampaignCreatePage } from '@pages/campaginCreate';
// import { RoleSelectPage } from '@/2_pages/onboardingRoleSelect/ui/_RoleSelectPage';

const OnboardingSdkGuidePage = lazy(() =>
  import('@pages/onboardingSdkGuide').then((m) => ({
    default: m.OnboardingSdkGuidePage,
  }))
);

export function RouterProvider() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/publisher/dashboard" replace />}
        />

        <Route element={<OnboardingLayout />}>
          <Route
            path="/publisher/onboarding/sdk-guide"
            element={
              <Suspense fallback={<OnboardingSdkGuidePageSkeleton />}>
                <OnboardingSdkGuidePage />
              </Suspense>
            }
          />
          <Route
            path="/advertiser/campaign-create"
            element={<CampaignCreatePage />}
          />
        </Route>

        <Route element={<DashboardLayout />}>
          <Route
            path="/advertiser/dashboard"
            element={<AdvertiserDashboardPage />}
          />
          <Route
            path="/advertiser/campaigns"
            element={<AdvertiserCampaignsPage />}
          />
          <Route path="/advertiser/budget" element={<AdvertiserBudgetPage />} />
          <Route
            path="/publisher/dashboard"
            element={<PublisherDashboardPage />}
          />
          <Route
            path="/publisher/earnings"
            element={<PublisherEarningsPage />}
          />
          <Route
            path="/publisher/settings"
            element={<PublisherSettingsPage />}
          />
        </Route>
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
