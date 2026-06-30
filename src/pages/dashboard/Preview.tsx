import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

export function Preview() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-ink">Preview e aprovação</h1>
          <p className="text-muted-foreground mt-2">Revise a SmartBio gerada antes da publicação automática.</p>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-6">
          <p className="text-muted-foreground">Conteúdo em breve...</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
