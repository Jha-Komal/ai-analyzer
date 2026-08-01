import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { InsightsPage } from './pages/InsightsPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { WorkflowPage } from './pages/WorkflowPage';
import { ROUTES } from './constants/routes';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path={ROUTES.REVIEWS} element={<ReviewsPage />} />
        <Route path={ROUTES.INSIGHTS} element={<InsightsPage />} />
        <Route path={ROUTES.RECOMMENDATIONS} element={<RecommendationsPage />} />
        <Route path={ROUTES.WORKFLOW} element={<WorkflowPage />} />
        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Route>
    </Routes>
  );
}

export default App;
