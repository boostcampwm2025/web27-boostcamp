import { lazy, Suspense } from 'react';
import {
  // BrowserRouter,
  // Routes,
  // Route,
  // Navigate,
  createBrowserRouter,
} from 'react-router-dom';
import { DashboardLayout, OnboardingLayout } from '@app/layouts';
import { AdvertiserDashboardPage } from '@pages/advertiserDashboard';
import { AdvertiserCampaignsPage } from '@pages/advertiserCampaigns';
import { AdvertiserBudgetPage } from '@pages/advertiserBudget';
import { NotFoundPage } from '@pages/notFound';
import { RegisterPage } from '@pages/auth/ui/RegisterPage';
import { LoginPage } from '@pages/auth/ui/LoginPage';
import { PublisherDashboardPage } from '@pages/publisherDashboard';
import { PublisherEarningsPage } from '@pages/publisherEarnings';
import { PublisherSettingsPage } from '@pages/publisherSettings';
import { OnboardingSdkGuidePageSkeleton } from '@pages/onboardingSdkGuide';
import { CampaignCreatePage } from '@pages/campaginCreate';
import { BlogAdmissionPage } from '@pages/onboardingBlogAdmission/ui/BlogAdmissionPage';

const OnboardingSdkGuidePage = lazy(() =>
  import('@pages/onboardingSdkGuide').then((m) => ({
    default: m.OnboardingSdkGuidePage,
  }))
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <OnboardingLayout />,
    children: [
      { index: true, element: <LoginPage /> }, // 추후에 메인페이지 넣으면 될듯합니다.
      {
        path: 'auth/login',
        element: <LoginPage />,
      },
      {
        path: 'auth/register',
        element: <RegisterPage />,
      },
      {
        path: 'publisher/onboarding/sdk-guide',
        element: (
          <Suspense fallback={<OnboardingSdkGuidePageSkeleton />}>
            <OnboardingSdkGuidePage />
          </Suspense>
        ),
      },
      {
        path: 'publisher/onboarding/blog-admission',
        element: <BlogAdmissionPage />,
      },
      {
        path: 'advertiser/campaign-create',
        element: <CampaignCreatePage />,
      },
    ],
  },
  {
    path: '/publisher',
    element: <DashboardLayout />,
    children: [
      {
        path: 'dashboard',
        element: <PublisherDashboardPage />,
      },
      {
        path: 'earnings',
        element: <PublisherEarningsPage />,
      },
      {
        path: 'settings',
        element: <PublisherSettingsPage />,
      },
    ],
  },
  {
    path: '/advertiser',
    element: <DashboardLayout />,
    children: [
      {
        path: 'dashboard',
        element: <AdvertiserDashboardPage />,
      },
      {
        path: 'campaigns',
        element: <AdvertiserCampaignsPage />,
      },
      {
        path: 'budget',
        element: <AdvertiserBudgetPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

// export function RouterProvider() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route
//           path="/"
//           element={<Navigate to="/publisher/dashboard" replace />}
//         />

//         <Route element={<OnboardingLayout />}>
//           <Route
//             path="/publisher/onboarding/sdk-guide"
//             element={
//               <Suspense fallback={<OnboardingSdkGuidePageSkeleton />}>
//                 <OnboardingSdkGuidePage />
//               </Suspense>
//             }
//           />
//           <Route path="/auth/register" element={<RegisterPage />} />
//           <Route path="/auth/login" element={<LoginPage />} />
//           <Route
//             path="/publisher/onboarding/blog-admission"
//             element={<BlogAdmissionPage />}
//           />
//           <Route
//             path="/advertiser/campaign-create"
//             element={<CampaignCreatePage />}
//           />
//         </Route>

//         <Route element={<DashboardLayout />}>
//           <Route
//             path="/advertiser/dashboard"
//             element={<AdvertiserDashboardPage />}
//           />
//           <Route
//             path="/advertiser/campaigns"
//             element={<AdvertiserCampaignsPage />}
//           />
//           <Route path="/advertiser/budget" element={<AdvertiserBudgetPage />} />
//           <Route
//             path="/publisher/dashboard"
//             element={<PublisherDashboardPage />}
//           />
//           <Route
//             path="/publisher/earnings"
//             element={<PublisherEarningsPage />}
//           />
//           <Route
//             path="/publisher/settings"
//             element={<PublisherSettingsPage />}
//           />
//         </Route>
//         <Route path="*" element={<NotFoundPage />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }
