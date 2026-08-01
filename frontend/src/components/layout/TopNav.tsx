import { useLocation } from 'react-router-dom';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
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
  const [dark, setDark] = useState(() =>
    localStorage.getItem('theme') !== 'light'
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur px-6">
      <MobileMenuButton onClick={onMenuClick} />
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      <div className="ml-auto">
        <button
          onClick={() => setDark((d) => !d)}
          className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Toggle dark mode"
        >
          {dark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}
