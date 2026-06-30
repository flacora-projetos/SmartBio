import { ReactNode } from 'react';
import { mockUser, mockTenant, mockSubscription } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Sparkles, 
  List, 
  HelpCircle, 
  Eye, 
  Users, 
  BarChart, 
  CreditCard, 
  Settings,
  LogOut,
  Menu
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Visão geral', path: '/app', icon: LayoutDashboard },
  { label: 'Onboarding IA', path: '/app/onboarding', icon: Sparkles },
  { label: 'Ofertas', path: '/app/offers', icon: List },
  { label: 'Quiz e recomendação', path: '/app/quiz', icon: HelpCircle },
  { label: 'Preview e aprovação', path: '/app/preview', icon: Eye },
  { label: 'Leads', path: '/app/leads', icon: Users },
  { label: 'Analytics', path: '/app/analytics', icon: BarChart },
];

const bottomNavItems = [
  { label: 'Assinatura', path: '/app/subscription', icon: CreditCard },
  { label: 'Configurações', path: '/app/settings', icon: Settings },
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface border-r border-border flex flex-col sticky top-0 md:h-screen">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <Link to="/app" className="inline-flex items-center gap-2 font-heading font-bold text-xl tracking-tight text-ink">
            <div className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs">
              SB
            </div>
            SmartBio
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:bg-surface hover:text-ink'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-border space-y-1">
          {bottomNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:bg-surface hover:text-ink'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 border-b border-border bg-surface px-6 flex items-center justify-between sticky top-0 z-10 hidden md:flex">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-ink bg-background border border-border px-3 py-1 rounded-full">
              {mockTenant.name}
            </span>
            <span className="text-xs text-muted-foreground bg-primary/10 text-primary px-2 py-1 rounded-full uppercase tracking-wider font-bold">
              {mockSubscription.planName}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-ink leading-none">{mockUser.fullName}</p>
              <p className="text-xs text-muted-foreground mt-1">{mockUser.email}</p>
            </div>
            <img 
              src={mockUser.avatarUrl || ''} 
              alt={mockUser.fullName || 'User'} 
              className="w-9 h-9 rounded-full bg-border"
            />
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
