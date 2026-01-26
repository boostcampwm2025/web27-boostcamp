import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { DashboardLayout, OnboardingLayout } from '@app/layouts';
import { AdvertiserDashboardPage } from '@pages/advertiserDashboard';
import { AdvertiserCampaignsPage } from '@pages/advertiserCampaigns';
import { AdvertiserBudgetPage } from '@pages/advertiserBudget';
import { RealtimeBidsHistoryPage } from '@pages/realtimeBidsHistory';
import { NotFoundPage } from '@pages/notFound';
import { RegisterPage } from '@pages/auth/ui/RegisterPage';
import { LoginPage } from '@pages/auth/ui/LoginPage';
// import { PublisherDashboardPage } from '@pages/publisherDashboard';
import { PublisherEarningsPage } from '@pages/publisherEarnings';
import { PublisherSettingsPage } from '@pages/publisherSettings';
import { OnboardingSdkGuidePageSkeleton } from '@pages/onboardingSdkGuide';
import { CampaignCreatePage } from '@pages/campaginCreate';
import { BlogAdmissionPage } from '@pages/onboardingBlogAdmission/ui/BlogAdmissionPage';
import {
  publisherEntryLoader,
  publisherBlogRequiredLoader,
  guestOnlyLoader,
  publisherGateLoader,
  advertiserGateLoader,
} from '../lib';

const OnboardingSdkGuidePage = lazy(() =>
  import('@pages/onboardingSdkGuide').then((m) => ({
    default: m.OnboardingSdkGuidePage,
  }))
);

export const router = createBrowserRouter([
  // 1. 공통 (로그인 등) - 여긴 역할 구분이 없으므로 최상위 유지
  {
    path: '/',
    loader: guestOnlyLoader,
    element: <OnboardingLayout />,
    children: [
      { index: true, element: <LoginPage /> },
      { path: 'auth/login', element: <LoginPage /> },
      { path: 'auth/register', element: <RegisterPage /> },
    ],
  },

  // 2. 퍼블리셔 (Publisher) 그룹
  {
    path: '/publisher', // 👈 URL 접두사 역할만 수행 (Layout 없음)
    loader: publisherGateLoader,
    children: [
      {
        path: 'entry',
        loader: publisherEntryLoader,
      },
      // 2-1. 퍼블리셔 온보딩 (OnboardingLayout 사용)
      {
        path: 'onboarding',
        element: <OnboardingLayout />, // 👈 여기서 레이아웃 지정
        children: [
          {
            path: 'sdk-guide',
            element: (
              <Suspense fallback={<OnboardingSdkGuidePageSkeleton />}>
                <OnboardingSdkGuidePage />
              </Suspense>
            ),
          },
          { path: 'blog-admission', element: <BlogAdmissionPage /> },
        ],
      },

      // 2-2. 퍼블리셔 대시보드 (DashboardLayout 사용)
      {
        path: 'dashboard',
        loader: publisherBlogRequiredLoader,
        element: <DashboardLayout />, // 👈 다른 레이아웃 지정
        children: [
          // { path: 'main', element: <PublisherDashboardPage /> }, // 개발 편의상 메인을 온보딩 대시보드로연결해두었습니다.
          {
            path: 'main',
            element: (
              <Suspense fallback={<OnboardingSdkGuidePageSkeleton />}>
                <OnboardingSdkGuidePage />
              </Suspense>
            ),
          },
          { path: 'earnings', element: <PublisherEarningsPage /> },
          { path: 'settings', element: <PublisherSettingsPage /> },
        ],
      },
    ],
  },

  // 3. 광고주 (Advertiser) 그룹
  {
    path: '/advertiser', // 👈 URL 접두사 역할
    loader: advertiserGateLoader,
    children: [
      // 3-1. 광고주 온보딩 (OnboardingLayout 재사용)
      {
        path: 'onboarding', // URL: /advertiser/onboarding/...
        element: <OnboardingLayout />,
        children: [
          // 필요하다면 광고주용 온보딩 페이지들 추가
        ],
      },
      // 3-2. 광고주 캠페인 생성 (OnboardingLayout 사용한다고 가정)
      {
        path: 'campaign-create',
        element: <OnboardingLayout />,
        children: [{ index: true, element: <CampaignCreatePage /> }],
      },
      // 3-3. 광고주 대시보드 (DashboardLayout 사용)
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
          { path: 'main', element: <AdvertiserDashboardPage /> },
          { path: 'campaigns', element: <AdvertiserCampaignsPage /> },
          { path: 'budget', element: <AdvertiserBudgetPage /> },
          { path: 'history', element: <RealtimeBidsHistoryPage /> },
        ],
      },
    ],
  },

  { path: '*', element: <NotFoundPage /> },
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
