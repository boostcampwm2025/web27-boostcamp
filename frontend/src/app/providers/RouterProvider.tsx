import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout, OnboardingLayout } from '@app/layouts';
import { AdvertiserDashboardPage } from '@pages/advertiserDashboard';
import { AdvertiserCampaignsPage } from '@pages/advertiserCampaigns';
import { AdvertiserBudgetPage } from '@pages/advertiserBudget';
import { NotFoundPage } from '@pages/notFound';
import { PublisherDashboardPage } from '@pages/publisherDashboard';
import { PublisherEarningsPage } from '@pages/publisherEarnings';
import { PublisherSettingsPage } from '@pages/publisherSettings';
import { OnboardingSdkGuidePage } from '@pages/onboardingSdkGuide';

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
            element={<OnboardingSdkGuidePage />}
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

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
