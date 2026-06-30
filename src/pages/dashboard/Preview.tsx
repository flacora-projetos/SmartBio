import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { SmartBioPreviewMock } from '@/components/dashboard/SmartBioPreviewMock';
import { PublishChecklist } from '@/components/dashboard/PublishChecklist';
import { PublishApprovalPanel } from '@/components/dashboard/PublishApprovalPanel';
import { PreviewSummary } from '@/components/dashboard/PreviewSummary';
import { mockPreviewChecklist, mockQuizQuestions, mockRecommendationRules, mockRecommendationPreview, mockTenant } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Preview() {
  const navigate = useNavigate();
  const [publishStatus, setPublishStatus] = useState<'pending' | 'publishing' | 'published'>('pending');
  const publicUrl = `https://smartbio.app/s/${mockTenant.slug}`;

  const handleApprove = () => {
    setPublishStatus('publishing');
    setTimeout(() => {
      setPublishStatus('published');
    }, 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    // You could show a toast here in a real app
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col min-h-[calc(100vh-8rem)]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-heading font-bold text-ink">Preview e aprovação</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                publishStatus === 'published' ? 'bg-success/20 text-success' : 
                publishStatus === 'publishing' ? 'bg-primary/20 text-primary' : 
                'bg-surface border border-border text-muted-foreground'
              }`}>
                {publishStatus === 'published' ? 'Publicada' : publishStatus === 'publishing' ? 'Publicando...' : 'Aguardando Aprovação'}
              </span>
            </div>
            <p className="text-muted-foreground">Revise a SmartBio gerada. Após sua aprovação, o SaaS publica automaticamente em um link público.</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/app/onboarding')} className="rounded-xl hidden sm:flex">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para editar
          </Button>
        </div>

        <div className="flex-1 flex flex-col xl:flex-row gap-6 mb-6">
          
          {/* Left Column: Preview */}
          <div className="xl:flex-1 bg-surface border border-border rounded-2xl shadow-sm flex flex-col items-center justify-center py-10 px-4 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-b from-surface to-background/50 pointer-events-none" />
            <div className="relative z-10">
              <div className="transform scale-[0.9] sm:scale-100 origin-top">
                <SmartBioPreviewMock />
              </div>
            </div>
          </div>

          {/* Right Column: Approval & Checklist */}
          <div className="xl:w-[400px] flex flex-col gap-6 shrink-0">
            <PublishApprovalPanel 
              status={publishStatus} 
              publicUrl={publicUrl} 
              onApprove={handleApprove} 
              onCopyLink={handleCopyLink} 
            />
            
            <PublishChecklist items={mockPreviewChecklist} />
          </div>
        </div>

        {/* Bottom Section: Summary */}
        <PreviewSummary 
          questionsCount={mockQuizQuestions.length}
          rulesCount={mockRecommendationRules.length}
          mainOffer={mockRecommendationPreview.offerName}
          finalCta={mockRecommendationPreview.buttonText}
        />
        
        <div className="mt-6 sm:hidden">
           <Button variant="outline" onClick={() => navigate('/app/onboarding')} className="w-full rounded-xl">
             <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para editar
           </Button>
        </div>

      </div>
    </DashboardLayout>
  );
}
