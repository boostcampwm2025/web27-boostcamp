import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@app/layouts';
import { AdvertiserDashboardPage } from '@pages/advertiserDashboard';
import { CampaignsPage } from '@pages/campaigns';
import { BudgetPage } from '@pages/budget';
import { NotFoundPage } from '@pages/notFound';
import { RegisterPage } from '@/2_pages/auth/ui/RegisterPage';

export function RouterProvider() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<AdvertiserDashboardPage />} />
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/budget" element={<BudgetPage />} />
        </Route>
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
