import { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Loader2, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { AgendaConfig } from '@/lib/public-smartbio';

type Step = 'service' | 'date' | 'time' | 'form' | 'success';

const PT_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const PT_MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function generateSlots(start: string, end: string, minutes: number): string[] {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let cur = sh * 60 + sm;
  const endMin = eh * 60 + em;
  const slots: string[] = [];
  while (cur + minutes <= endMin) {
    const h = Math.floor(cur / 60);
    const m = cur % 60;
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    cur += minutes;
  }
  return slots;
}

function getMonthGrid(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const grid: (Date | null)[] = Array(first.getDay()).fill(null);
  for (let d = 1; d <= last.getDate(); d++) grid.push(new Date(year, month, d));
  return grid;
}

function formatDate(d: Date): string {
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function SchedulingWidget({
  smartbioId,
  tenantId,
  config,
  accentColor,
}: {
  smartbioId: string;
  tenantId: string;
  config: AgendaConfig;
  accentColor?: string;
}) {
  const accent = accentColor || '#000000';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + (config.advance_days || 30));

  const hasMultipleServices = config.services.length > 1;
  const firstStep: Step = hasMultipleServices ? 'service' : 'date';

  const [step, setStep] = useState<Step>(firstStep);
  const [selectedService, setSelectedService] = useState<string>(
    config.services.length === 1 ? config.services[0].name : ''
  );
  const [calMonth, setCalMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slots = generateSlots(config.start_time, config.end_time, config.slot_duration_minutes || 60);
  const grid = getMonthGrid(calMonth.getFullYear(), calMonth.getMonth());

  const isAvailableDay = (d: Date) => {
    if (d < today || d > maxDate) return false;
    const dow = d.getDay();
    return config.available_days.includes(dow);
  };

  const prevMonth = () => {
    const prev = new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1);
    if (prev >= new Date(today.getFullYear(), today.getMonth(), 1)) setCalMonth(prev);
  };

  const nextMonth = () => {
    const next = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1);
    const maxMonth = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
    if (next <= maxMonth) setCalMonth(next);
  };

  const handleSelectDate = (d: Date) => {
    if (!isAvailableDay(d)) return;
    setSelectedDate(d);
    setSelectedTime(null);
    setStep('time');
  };

  const handleSelectTime = (t: string) => {
    setSelectedTime(t);
    setStep('form');
  };

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim() || !selectedDate || !selectedTime) return;
    setLoading(true);
    setError(null);
    const { error: err } = await supabase.from('scheduling_requests').insert({
      tenant_id: tenantId,
      smartbio_id: smartbioId,
      visitor_name: name.trim(),
      visitor_phone: phone.trim(),
      service_name: selectedService || null,
      preferred_date: isoDate(selectedDate),
      preferred_time: selectedTime,
      notes: notes.trim() || null,
    });
    setLoading(false);
    if (err) { setError('Erro ao enviar. Tente novamente.'); return; }
    setStep('success');
  };

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm';

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: accent }}>
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center gap-3">
        <Calendar className="w-5 h-5 text-white/80 shrink-0" />
        <div>
          <p className="text-sm font-bold text-white">Agendar atendimento</p>
          <p className="text-xs text-white/60">Escolha o melhor dia e horário</p>
        </div>
      </div>

      <div className="px-5 pb-5 space-y-4">

        {/* STEP: service */}
        {step === 'service' && (
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white/60">Qual serviço?</p>
            <div className="space-y-2">
              {config.services.map(s => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => { setSelectedService(s.name); setStep('date'); }}
                  className="w-full text-left px-4 py-3 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <p className="text-sm font-semibold text-white">{s.name}</p>
                  <p className="text-xs text-white/60 mt-0.5">{s.duration_minutes} min</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP: date */}
        {step === 'date' && (
          <div className="space-y-3">
            {selectedService && hasMultipleServices && (
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setStep('service')} className="text-white/60 hover:text-white">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-white/60">{selectedService}</span>
              </div>
            )}
            {/* Month nav */}
            <div className="flex items-center justify-between">
              <button type="button" onClick={prevMonth} className="p-1 text-white/60 hover:text-white">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <p className="text-sm font-bold text-white">
                {PT_MONTHS[calMonth.getMonth()]} {calMonth.getFullYear()}
              </p>
              <button type="button" onClick={nextMonth} className="p-1 text-white/60 hover:text-white">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            {/* Days header */}
            <div className="grid grid-cols-7 gap-1">
              {PT_DAYS.map(d => (
                <div key={d} className="text-center text-[10px] font-bold text-white/40 py-1">{d}</div>
              ))}
              {grid.map((d, i) => {
                if (!d) return <div key={i} />;
                const available = isAvailableDay(d);
                const isSelected = selectedDate && isoDate(d) === isoDate(selectedDate);
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={!available}
                    onClick={() => handleSelectDate(d)}
                    className={`aspect-square rounded-lg text-xs font-medium transition-colors ${
                      isSelected
                        ? 'bg-white text-black font-bold'
                        : available
                        ? 'bg-white/15 text-white hover:bg-white/25'
                        : 'text-white/20 cursor-not-allowed'
                    }`}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP: time */}
        {step === 'time' && selectedDate && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setStep('date')} className="text-white/60 hover:text-white">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <p className="text-xs text-white/60">{formatDate(selectedDate)}</p>
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-white/60">Qual horário?</p>
            <div className="grid grid-cols-3 gap-2">
              {slots.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleSelectTime(t)}
                  className="py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-sm font-semibold text-white transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP: form */}
        {step === 'form' && selectedDate && selectedTime && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setStep('time')} className="text-white/60 hover:text-white">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <p className="text-xs text-white/60">{formatDate(selectedDate)} às {selectedTime}</p>
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-white/60">Seus dados</p>
            <input
              className={inputCls}
              placeholder="Seu nome"
              value={name}
              onChange={e => setName(e.target.value)}
              autoComplete="name"
            />
            <input
              className={inputCls}
              placeholder="WhatsApp (com DDD)"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              type="tel"
              autoComplete="tel"
            />
            <textarea
              className={`${inputCls} resize-none h-16`}
              placeholder="Observação (opcional)"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
            {error && <p className="text-xs text-red-300">{error}</p>}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !name.trim() || !phone.trim()}
              className="w-full py-3 rounded-xl bg-white font-bold text-sm transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ color: accent }}
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" />Enviando...</>
                : 'Confirmar interesse'}
            </button>
          </div>
        )}

        {/* STEP: success */}
        {step === 'success' && (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <CheckCircle2 className="w-10 h-10 text-white" />
            <div>
              <p className="text-sm font-bold text-white">Solicitação enviada!</p>
              <p className="text-xs text-white/70 mt-1 leading-relaxed">
                Recebemos sua preferência de horário.<br />
                Em breve entraremos em contato para confirmar.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
