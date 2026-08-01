import { useLocation } from 'react-router-dom';
import { MobileMenuButton } from './Sidebar';
import { ROUTES } from '../../constants/routes';

const PAGE_TITLES: Record<string, string> = {
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.REVIEWS]: 'Reviews',
  [ROUTES.INSIGHTS]: 'Insights',
  [ROUTES.RECOMMENDATIONS]: 'Recommendations',
};

interface TopNavProps {
  onMenuClick: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] ?? 'Dashboard';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur px-6">
      <MobileMenuButton onClick={onMenuClick} />
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
    </header>
  );
}
