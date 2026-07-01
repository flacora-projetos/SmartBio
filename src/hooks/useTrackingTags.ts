import { useEffect, useCallback } from 'react';

type TrackingConfig = {
  pixel_id?: string;
  ga4_id?: string;
  gtm_id?: string;
};

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[];
      push?: (...args: unknown[]) => void;
      loaded?: boolean;
      version?: string;
    };
    _fbq?: typeof window.fbq;
    gtag?: (...args: unknown[]) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer?: any[];
  }
}

function safeId(value: string | undefined): string {
  return (value ?? '').replace(/[^a-zA-Z0-9_-]/g, '');
}

export function useTrackingTags(config: Record<string, unknown>) {
  const { pixel_id, ga4_id, gtm_id } = config as TrackingConfig;

  const safePixel = safeId(pixel_id);
  const safeGa4 = safeId(ga4_id);
  const safeGtm = safeId(gtm_id);

  useEffect(() => {
    const injected: HTMLScriptElement[] = [];

    // ── Meta Pixel ──────────────────────────────────────────────────────────
    if (safePixel && !window.fbq) {
      const fbq: typeof window.fbq = function (...args: unknown[]) {
        if (fbq!.callMethod) {
          fbq!.callMethod!(...args);
        } else {
          fbq!.queue!.push(args);
        }
      };
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = '2.0';
      fbq.queue = [];
      window.fbq = fbq;
      window._fbq = fbq;

      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(script);
      injected.push(script);

      window.fbq('init', safePixel);
    }

    // ── Google Tag Manager ──────────────────────────────────────────────────
    if (safeGtm && !document.getElementById('gtm-script')) {
      window.dataLayer = window.dataLayer ?? [];
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });

      const script = document.createElement('script');
      script.id = 'gtm-script';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${safeGtm}`;
      document.head.appendChild(script);
      injected.push(script);
    }

    // ── GA4 ─────────────────────────────────────────────────────────────────
    if (safeGa4 && !window.gtag) {
      window.dataLayer = window.dataLayer ?? [];
      const gtag: typeof window.gtag = (...args: unknown[]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.dataLayer!.push(args as any);
      };
      window.gtag = gtag;
      window.gtag('js', new Date());
      window.gtag('config', safeGa4);

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${safeGa4}`;
      document.head.appendChild(script);
      injected.push(script);
    }

    return () => {
      injected.forEach(s => s.remove());
    };
  }, [safePixel, safeGa4, safeGtm]);

  const fireEvent = useCallback(
    (eventName: 'page_view' | 'quiz_start' | 'quiz_complete' | 'cta_click', params: Record<string, unknown> = {}) => {
      // Meta Pixel
      if (safePixel && window.fbq) {
        const pixelMap: Record<string, string> = {
          page_view: 'ViewContent',
          quiz_start: 'InitiateCheckout',
          quiz_complete: 'Lead',
          cta_click: 'Contact',
        };
        window.fbq('track', pixelMap[eventName], params);
      }

      // GA4 / GTM dataLayer
      if ((safeGa4 || safeGtm) && window.gtag) {
        const ga4Map: Record<string, string> = {
          page_view: 'page_view',
          quiz_start: 'begin_checkout',
          quiz_complete: 'generate_lead',
          cta_click: 'conversion',
        };
        window.gtag('event', ga4Map[eventName] ?? eventName, params);
      }

      // GTM dataLayer direto (para quem usa GTM sem GA4)
      if (safeGtm && window.dataLayer) {
        window.dataLayer.push({ event: `smartbio_${eventName}`, ...params });
      }
    },
    [safePixel, safeGa4, safeGtm],
  );

  return { fireEvent };
}
