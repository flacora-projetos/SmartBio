import { Clock, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export function TrialBanner() {
  const { trialDaysLeft, isTrialExpired } = useAuth();

  if (trialDaysLeft === null) return null;

  if (isTrialExpired) {
    return (
      <div className="w-full bg-destructive/10 border-b border-destructive/20 px-4 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-destructive">
          <Clock className="w-4 h-4 shrink-0" />
          <p className="text-sm font-semibold">
            Seu trial encerrou — sua SmartBio está pausada para visitantes.
          </p>
        </div>
        <Button size="sm" className="rounded-xl bg-destructive text-white hover:bg-destructive/90 shrink-0 h-8 px-4 text-xs font-bold">
          <Zap className="w-3.5 h-3.5 mr-1.5" />
          Assinar agora
        </Button>
      </div>
    );
  }

  const isUrgent = trialDaysLeft <= 2;

  return (
    <div className={`w-full border-b px-4 py-2.5 flex items-center justify-between gap-4 ${
      isUrgent
        ? 'bg-amber-50 border-amber-200'
        : 'bg-primary/5 border-primary/10'
    }`}>
      <div className={`flex items-center gap-2 ${isUrgent ? 'text-amber-700' : 'text-primary'}`}>
        <Clock className="w-4 h-4 shrink-0" />
        <p className="text-sm font-medium">
          {trialDaysLeft === 1
            ? 'Último dia de trial — sua SmartBio fica online até hoje.'
            : `Seu trial encerra em ${trialDaysLeft} dias.`}
          {' '}
          <span className="font-semibold">Assine para manter tudo no ar.</span>
        </p>
      </div>
      <Button
        size="sm"
        className={`rounded-xl shrink-0 h-8 px-4 text-xs font-bold ${
          isUrgent
            ? 'bg-amber-600 text-white hover:bg-amber-700'
            : 'bg-primary text-primary-foreground'
        }`}
      >
        <Zap className="w-3.5 h-3.5 mr-1.5" />
        Assinar agora
      </Button>
    </div>
  );
}
