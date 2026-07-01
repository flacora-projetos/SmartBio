import { useState, useEffect } from 'react';
import {
  X, Trash2, Loader2, Globe, Phone, Youtube,
  Music, Calendar, ShoppingBag, BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DbAsset, AssetPayload } from '@/lib/assets';

const ASSET_TYPES: {
  value: DbAsset['type'];
  label: string;
  icon: React.ElementType;
  usePhone: boolean;
  placeholder: string;
}[] = [
  { value: 'link',     label: 'Link',             icon: Globe,       usePhone: false, placeholder: 'https://seusite.com.br' },
  { value: 'whatsapp', label: 'WhatsApp',          icon: Phone,       usePhone: true,  placeholder: '' },
  { value: 'product',  label: 'Produto',           icon: ShoppingBag, usePhone: false, placeholder: 'https://loja.com/produto' },
  { value: 'video',    label: 'Vídeo / YouTube',   icon: Youtube,     usePhone: false, placeholder: 'https://youtube.com/...' },
  { value: 'podcast',  label: 'Podcast / Spotify', icon: Music,       usePhone: false, placeholder: 'https://open.spotify.com/...' },
  { value: 'post',     label: 'Post / Publicação', icon: BookOpen,    usePhone: false, placeholder: 'https://instagram.com/p/...' },
  { value: 'calendar', label: 'Calendário',        icon: Calendar,    usePhone: false, placeholder: 'https://calendly.com/...' },
];

type Props = {
  asset: DbAsset | null;
  smartbioId: string;
  tenantId: string;
  onSave: (payload: Omit<AssetPayload, 'smartbio_id'>) => Promise<void>;
  onDelete: () => Promise<void>;
  onClose: () => void;
};

export function AssetFormPanel({ asset, onSave, onDelete, onClose }: Props) {
  const isEditing = asset !== null;

  const [type, setType]       = useState<DbAsset['type']>(asset?.type ?? 'link');
  const [title, setTitle]     = useState(asset?.title ?? '');
  const [subtitle, setSubtitle] = useState(asset?.subtitle ?? '');
  const [url, setUrl]         = useState(asset?.url ?? '');
  const [phone, setPhone]     = useState(asset?.phone ?? '');
  const [message, setMessage] = useState(asset?.message_template ?? '');
  const [status, setStatus]   = useState<'active' | 'draft'>(asset?.status ?? 'active');
  const [isSaving, setIsSaving]   = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const meta = ASSET_TYPES.find(t => t.value === type)!;
  const usePhone = meta.usePhone;

  useEffect(() => {
    if (!isEditing && !title) setTitle(meta.label);
  }, [type]); // eslint-disable-line react-hooks/exhaustive-deps

  const canSave = title.trim() && (usePhone ? phone.trim() : url.trim());

  const handleSave = async () => {
    if (!canSave) return;
    setIsSaving(true);
    try {
      await onSave({
        type,
        title: title.trim(),
        subtitle: subtitle.trim() || null,
        url: !usePhone && url.trim() ? url.trim() : null,
        phone: usePhone && phone.trim() ? phone.trim() : null,
        message_template: usePhone && message.trim() ? message.trim() : null,
        status,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try { await onDelete(); } finally { setIsDeleting(false); }
  };

  const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/50';

  return (
    <div className="ml-auto w-full max-w-sm bg-surface border-l border-border flex flex-col h-full shadow-xl relative z-10">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
        <h2 className="text-lg font-heading font-bold text-ink">
          {isEditing ? 'Editar ativo' : 'Novo ativo'}
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

        {/* Type selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tipo</label>
          <div className="grid grid-cols-2 gap-2">
            {ASSET_TYPES.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setType(value)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors text-left ${
                  type === value
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/40 hover:text-ink'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Título *</label>
          <input
            className={inputCls}
            placeholder="Ex: Assista no YouTube"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        {/* Subtitle */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Subtítulo (opcional)</label>
          <input
            className={inputCls}
            placeholder="Ex: Episódio mais recente"
            value={subtitle}
            onChange={e => setSubtitle(e.target.value)}
          />
        </div>

        {/* URL or Phone */}
        {usePhone ? (
          <>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Número WhatsApp *</label>
              <input
                className={inputCls}
                placeholder="55 11 99999-0000"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                type="tel"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Mensagem pré-preenchida (opcional)</label>
              <textarea
                className={`${inputCls} resize-none h-20`}
                placeholder="Olá! Vim pelo link da bio…"
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </div>
          </>
        ) : (
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">URL *</label>
            <input
              className={inputCls}
              placeholder={meta.placeholder}
              value={url}
              onChange={e => setUrl(e.target.value)}
              type="url"
            />
          </div>
        )}

        {/* Status toggle */}
        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-sm font-medium text-ink">Visível na SmartBio</p>
            <p className="text-xs text-muted-foreground mt-0.5">Aparece na seção "Mais recursos"</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={status === 'active'}
            onClick={() => setStatus(s => s === 'active' ? 'draft' : 'active')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
              status === 'active' ? 'bg-success' : 'bg-border'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              status === 'active' ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border flex gap-3 shrink-0">
        {isEditing && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-destructive border-destructive/30 hover:bg-destructive/10 shrink-0"
          >
            {isDeleting
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Trash2 className="w-4 h-4" />}
          </Button>
        )}
        <Button
          onClick={handleSave}
          disabled={isSaving || !canSave}
          className="flex-1 bg-primary text-primary-foreground rounded-xl"
        >
          {isSaving
            ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Salvando...</>
            : 'Salvar ativo'}
        </Button>
      </div>
    </div>
  );
}
