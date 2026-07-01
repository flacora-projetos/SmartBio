import { ReactNode, useEffect, useState } from 'react';
import { mockSubscription } from '@/data/mock';
import { TrialBanner } from '@/components/dashboard/TrialBanner';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Sparkles,
  Package,
  HelpCircle,
  Eye,
  Users,
  BarChart2,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  Lock,
  Pencil,
  X,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

type SmartBioPublishStatus =
  | 'draft'
  | 'generating'
  | 'preview_pending_approval'
  | 'published'
  | 'archived'
  | null;

const smartbioItems = [
  { label: 'Identidade', path: '/app/onboarding', icon: Sparkles },
  { label: 'Ofertas', path: '/app/offers', icon: Package },
  { label: 'Quiz e recomendação', path: '/app/quiz', icon: HelpCircle },
  { label: 'Preview e publicação', path: '/app/preview', icon: Eye },
];

const bottomNavItems = [
  { label: 'Assinatura', path: '/app/subscription', icon: CreditCard },
  { label: 'Configurações', path: '/app/settings', icon: Settings },
];

function NavLink({
  to,
  icon: Icon,
  label,
  active,
}: {
  to: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
        active
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-muted hover:text-ink'
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {label}
    </Link>
  );
}

function LockedNavItem({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div
      title="Disponível após a publicação da sua SmartBio"
      className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground/50 cursor-not-allowed select-none"
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span>{label}</span>
      <Lock className="w-3 h-3 ml-auto shrink-0" />
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
      {children}
    </p>
  );
}

export function DashboardLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { user, tenant, signOut } = useAuth();
  const [publishStatus, setPublishStatus] = useState<SmartBioPublishStatus>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const userName =
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email?.split('@')[0] ||
    'Usuário';
  const userEmail = user?.email || '';
  const avatarUrl = (user?.user_metadata?.avatar_url as string | undefined) || '';
  const tenantName = tenant?.name || 'Minha SmartBio';
  const planName =
    tenant?.plan_key === 'essential' ? 'Essencial' : mockSubscription.planName;

  const isPublished = publishStatus === 'published';

  useEffect(() => {
    if (!tenant?.id) return;
    supabase
      .from('smartbios')
      .select('status')
      .eq('tenant_id', tenant.id)
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.status) setPublishStatus(data.status as SmartBioPublishStatus);
      });
  }, [tenant?.id]);

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-border flex items-center justify-between">
        <Link
          to="/app"
          className="inline-flex items-center gap-2 font-heading font-bold text-xl tracking-tight text-ink"
          onClick={() => setMobileOpen(false)}
        >
          <div className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
            SB
          </div>
          SmartBio
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Nav principal */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {/* Visão geral */}
        <NavLink
          to="/app"
          icon={LayoutDashboard}
          label="Visão geral"
          active={location.pathname === '/app'}
        />

        {/* Seção SmartBio */}
        <SectionLabel>
          {isPublished ? (
            <span className="flex items-center gap-1">
              <Pencil className="w-2.5 h-2.5 inline" />
              Editar SmartBio
            </span>
          ) : (
            'Criar minha SmartBio'
          )}
        </SectionLabel>

        {smartbioItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            icon={item.icon}
            label={item.label}
            active={location.pathname === item.path}
          />
        ))}

        {/* Seção Resultados */}
        <SectionLabel>Resultados</SectionLabel>

        {isPublished ? (
          <>
            <NavLink
              to="/app/leads"
              icon={Users}
              label="Leads"
              active={location.pathname === '/app/leads'}
            />
            <NavLink
              to="/app/analytics"
              icon={BarChart2}
              label="Analytics"
              active={location.pathname === '/app/analytics'}
            />
          </>
        ) : (
          <>
            <LockedNavItem icon={Users} label="Leads" />
            <LockedNavItem icon={BarChart2} label="Analytics" />
          </>
        )}
      </div>

      {/* Rodapé */}
      <div className="p-3 border-t border-border space-y-0.5">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            icon={item.icon}
            label={item.label}
            active={location.pathname === item.path}
          />
        ))}
        <button
          type="button"
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sair
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex w-64 bg-surface border-r border-border flex-col sticky top-0 h-screen shrink-0">
        <SidebarContent />
      </aside>

      {/* Sidebar — mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-50 w-72 bg-surface flex flex-col h-full shadow-xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Conteúdo principal */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 border-b border-border bg-surface px-4 md:px-6 flex items-center justify-between sticky top-0 z-10">
          {/* Mobile: botão de menu */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm font-medium text-ink bg-background border border-border px-3 py-1 rounded-full">
              {tenantName}
            </span>
            <span className="text-xs text-muted-foreground bg-primary/10 text-primary px-2 py-1 rounded-full uppercase tracking-wider font-bold">
              {planName}
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-ink leading-none">{userName}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{userEmail}</p>
            </div>
            {avatarUrl && !avatarError ? (
              <img
                src={avatarUrl}
                alt={userName}
                className="w-9 h-9 rounded-full bg-border object-cover shrink-0"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                {userName.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
        </header>

        <TrialBanner />

        {/* Conteúdo da página */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
