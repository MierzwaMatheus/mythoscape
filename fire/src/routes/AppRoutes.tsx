import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import HomePage from '../pages/HomePage';
import DashboardPage from '../pages/DashboardPage';
import CreateCampaignPage from '../pages/CreateCampaignPage';
import GamePage from '../pages/GamePage';
import NotFound from '../pages/NotFound';
import { LoginPage } from '../pages/auth/LoginPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="create-campaign" element={<CreateCampaignPage />} />
        <Route path="campaign/:campaignId" element={<GamePage />} />
        {/* Future routes will be added here */}
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
