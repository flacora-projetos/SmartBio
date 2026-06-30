import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { 
  mockSmartBio, 
  mockCreationFlowSteps, 
  mockDashboardMetrics,
  mockSubscription,
  dashboardData
} from '@/data/mock';
import { Button } from '@/components/ui/button';
import { SmartBioPhoneMock } from '@/components/landing/SmartBioPhoneMock';
import { 
  ArrowRight, 
  CheckCircle2, 
  Circle, 
  Copy, 
  ExternalLink,
  Eye,
  Lock,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function Overview() {
  const getStatusBadge = () => {
    switch(mockSmartBio.status) {
      case 'onboarding_pending':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-secondary text-secondary-foreground"><Circle className="w-4 h-4" /> {dashboardData.overview.statusCard.badges.onboarding_pending}</span>;
      case 'generating':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-primary/20 text-primary"><Sparkles className="w-4 h-4" /> {dashboardData.overview.statusCard.badges.generating}</span>;
      case 'preview_pending_approval':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-warning/20 text-warning-foreground"><Eye className="w-4 h-4" /> {dashboardData.overview.statusCard.badges.preview_pending_approval}</span>;
      case 'published':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-success/20 text-success"><CheckCircle2 className="w-4 h-4" /> {dashboardData.overview.statusCard.badges.published}</span>;
    }
  };

  const getActionContent = () => {
    switch(mockSmartBio.status) {
      case 'onboarding_pending':
        return (
          <Button className="w-full sm:w-auto bg-primary text-primary-foreground rounded-xl" asChild>
            <Link to="/app/onboarding">{dashboardData.overview.statusCard.actions.continueOnboarding} <ArrowRight className="w-4 h-4 ml-2" /></Link>
          </Button>
        );
      case 'generating':
        return (
          <Button className="w-full sm:w-auto bg-primary text-primary-foreground rounded-xl" disabled>
            <Sparkles className="w-4 h-4 mr-2" /> {dashboardData.overview.statusCard.actions.generating}
          </Button>
        );
      case 'preview_pending_approval':
        return (
          <Button className="w-full sm:w-auto bg-primary text-primary-foreground rounded-xl" asChild>
            <Link to="/app/preview"><Eye className="w-4 h-4 mr-2" /> {dashboardData.overview.statusCard.actions.viewPreview}</Link>
          </Button>
        );
      case 'published':
        return (
          <Button className="w-full sm:w-auto bg-ink text-surface rounded-xl">
            <Copy className="w-4 h-4 mr-2" /> {dashboardData.overview.statusCard.actions.copyLink}
          </Button>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-ink">{dashboardData.overview.title}</h1>
          <p className="text-muted-foreground text-sm mt-1">{dashboardData.overview.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status & Next Action */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-ink mb-2">{dashboardData.overview.statusCard.title}</h2>
                  <p className="text-sm text-muted-foreground">{dashboardData.overview.statusCard.subtitle}</p>
                </div>
                <div>
                  {getStatusBadge()}
                </div>
              </div>
              <div className="pt-6 border-t border-border flex justify-end">
                {getActionContent()}
              </div>
            </div>

            {/* Creation Flow */}
            <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm">
              <h2 className="text-lg font-bold text-ink mb-6">{dashboardData.overview.flowCard.title}</h2>
              <div className="space-y-4">
                {mockCreationFlowSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${
                        step.status === 'complete' ? 'bg-success/20 border-success text-success' :
                        step.status === 'current' ? 'bg-primary border-primary text-primary-foreground' :
                        'bg-background border-border text-muted-foreground'
                      }`}>
                        {step.status === 'complete' ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-bold">{step.step}</span>}
                      </div>
                      {index < mockCreationFlowSteps.length - 1 && (
                        <div className={`w-0.5 h-6 my-1 ${step.status === 'complete' ? 'bg-success/40' : 'bg-border'}`} />
                      )}
                    </div>
                    <div className={`flex-1 mb-${index < mockCreationFlowSteps.length - 1 ? '7' : '0'}`}>
                      <p className={`font-medium ${
                        step.status === 'complete' ? 'text-ink' :
                        step.status === 'current' ? 'text-primary font-bold' :
                        'text-muted-foreground'
                      }`}>{step.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-surface border border-border p-4 rounded-xl">
                <p className="text-xs text-muted-foreground font-medium mb-1">{dashboardData.overview.metricsCard.views}</p>
                <p className="text-2xl font-bold text-ink">{mockDashboardMetrics.views}</p>
              </div>
              <div className="bg-surface border border-border p-4 rounded-xl">
                <p className="text-xs text-muted-foreground font-medium mb-1">{dashboardData.overview.metricsCard.diagnosticsStarted}</p>
                <p className="text-2xl font-bold text-ink">{mockDashboardMetrics.diagnosticsStarted}</p>
              </div>
              <div className="bg-surface border border-border p-4 rounded-xl">
                <p className="text-xs text-muted-foreground font-medium mb-1">{dashboardData.overview.metricsCard.diagnosticsCompleted}</p>
                <p className="text-2xl font-bold text-ink">{mockDashboardMetrics.diagnosticsCompleted}</p>
              </div>
              <div className="bg-surface border border-border p-4 rounded-xl">
                <p className="text-xs text-muted-foreground font-medium mb-1">{dashboardData.overview.metricsCard.ctaClicks}</p>
                <p className="text-2xl font-bold text-ink">{mockDashboardMetrics.ctaClicks}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Preview & Links */}
          <div className="space-y-6">
            {/* Public Link Card */}
            <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm">
              <h2 className="text-sm font-bold text-ink mb-4 uppercase tracking-wider">{dashboardData.overview.publicLinkCard.title}</h2>
              {mockSmartBio.status === 'published' ? (
                <div className="space-y-3">
                  <div className="bg-background border border-border px-3 py-2 rounded-lg text-sm text-ink truncate font-mono">
                    smartbio.app/s/awesome-brand
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-ink text-surface hover:bg-ink/90 rounded-lg text-xs" size="sm">
                      <Copy className="w-3 h-3 mr-2" /> {dashboardData.overview.publicLinkCard.copy}
                    </Button>
                    <Button variant="outline" className="flex-1 rounded-lg text-xs" size="sm">
                      <ExternalLink className="w-3 h-3 mr-2" /> {dashboardData.overview.publicLinkCard.open}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center bg-background border border-border border-dashed rounded-xl">
                  <Lock className="w-8 h-8 text-muted-foreground/50 mb-2" />
                  <p className="text-xs text-muted-foreground px-4">{dashboardData.overview.publicLinkCard.lockedText}</p>
                </div>
              )}
            </div>

            {/* Preview Card */}
            <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-ink uppercase tracking-wider">{dashboardData.overview.previewCard.title}</h2>
              </div>
              <p className="text-xs text-muted-foreground mb-4">{dashboardData.overview.previewCard.subtitle}</p>
              
              <div className="relative mx-auto" style={{ maxWidth: '280px' }}>
                 <div className="transform scale-[0.8] origin-top">
                    <SmartBioPhoneMock />
                 </div>
              </div>
              
              <div className="mt-[-80px] space-y-2 relative z-10">
                <Button className="w-full bg-primary text-primary-foreground rounded-xl" asChild>
                  <Link to="/app/preview"><Eye className="w-4 h-4 mr-2" /> {dashboardData.overview.previewCard.viewFull}</Link>
                </Button>
                <Button variant="outline" className="w-full rounded-xl" asChild>
                  <Link to="/app/onboarding">{dashboardData.overview.previewCard.continueConfig}</Link>
                </Button>
              </div>
            </div>

            {/* Current Plan */}
            <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm">
              <h2 className="text-sm font-bold text-ink mb-4 uppercase tracking-wider">{dashboardData.overview.planCard.title}</h2>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-primary">{mockSubscription.planName}</span>
                <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full uppercase">{dashboardData.overview.planCard.active}</span>
              </div>
              <Button variant="outline" className="w-full rounded-xl text-xs">
                {dashboardData.overview.planCard.manage}
              </Button>
              <p className="text-[10px] text-muted-foreground text-center mt-2">{dashboardData.overview.planCard.stripeNote}</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
