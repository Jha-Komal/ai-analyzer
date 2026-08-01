import { NavLink } from 'react-router-dom';
import {
  LayoutDashboardIcon,
  MessageSquareTextIcon,
  LightbulbIcon,
  SparklesIcon,
  BrainCircuitIcon,
  MenuIcon,
  XIcon,
  NetworkIcon,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { ROUTES } from '../../constants/routes';

const NAV_ITEMS = [
  { to: ROUTES.DASHBOARD, icon: LayoutDashboardIcon, label: 'Dashboard' },
  { to: ROUTES.REVIEWS, icon: MessageSquareTextIcon, label: 'Reviews' },
  { to: ROUTES.INSIGHTS, icon: LightbulbIcon, label: 'Insights' },
  { to: ROUTES.RECOMMENDATIONS, icon: SparklesIcon, label: 'Recommendations' },
  { to: ROUTES.WORKFLOW, icon: NetworkIcon, label: 'How It Works' },
];

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-card border-r border-border transition-transform duration-200 lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-6 border-b border-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <BrainCircuitIcon className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground leading-none">AI Review</p>
            <p className="text-xs text-muted-foreground">Intelligence Platform</p>
          </div>
          <button
            className="ml-auto lg:hidden text-muted-foreground hover:text-foreground"
            onClick={onMobileClose}
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 p-4">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === ROUTES.DASHBOARD}
              onClick={onMobileClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">v0.1.0</p>
        </div>
      </aside>
    </>
  );
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted"
    >
      <MenuIcon className="h-5 w-5" />
    </button>
  );
}
