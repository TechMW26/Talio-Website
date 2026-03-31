import type { LeadEntry } from '@/lib/firebase';

const PAGE_LABELS: Record<string, string> = {
  '/': 'Home Page',
  '/about': 'About Page',
  '/contact': 'Contact Page',
  '/documents': 'Documents Page',
  '/downloads': 'Downloads Page',
  '/features': 'Features Page',
  '/get-started': 'Get Started Page',
  '/help': 'Help Page',
  '/pricing': 'Pricing Page',
  '/solutions': 'Solutions Page',
};

function toStartCase(value: string) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function normalizePathname(pathname?: string) {
  if (!pathname) return '';

  const normalized = pathname === '/' ? pathname : pathname.replace(/\/+$/, '');
  return normalized || '/';
}

export function getPageLabelFromPath(pathname?: string) {
  const normalized = normalizePathname(pathname);

  if (!normalized) return '';
  if (PAGE_LABELS[normalized]) return PAGE_LABELS[normalized];

  return normalized
    .split('/')
    .filter(Boolean)
    .map((segment) => toStartCase(segment))
    .join(' / ');
}

export interface LeadAttribution {
  leadType: string;
  pageLabel: string;
  captureLabel: string;
  planLabel: string;
  priceLabel: string;
  sourceLabel: string;
}

export function getLeadAttribution(
  lead: Pick<LeadEntry, 'source' | 'sourcePagePath' | 'sourcePageName' | 'selectedPlan' | 'selectedPlanPrice'>,
): LeadAttribution {
  const source = lead.source || 'unknown';
  const pageLabel = lead.sourcePageName || getPageLabelFromPath(lead.sourcePagePath);
  const planLabel = lead.selectedPlan || '—';
  const priceLabel = lead.selectedPlanPrice || '—';

  if (source.startsWith('pricing-')) {
    const fallbackPlan = toStartCase(source.replace(/^pricing-/, ''));

    return {
      leadType: 'Demo Booking',
      pageLabel: pageLabel || 'Pricing Page',
      captureLabel: 'Pricing Plan Popup',
      planLabel: lead.selectedPlan || fallbackPlan || '—',
      priceLabel,
      sourceLabel: 'Pricing Popup',
    };
  }

  if (source === 'book-demo-popup') {
    return {
      leadType: 'Demo Booking',
      pageLabel: pageLabel || 'Website',
      captureLabel: 'Book Demo Popup',
      planLabel,
      priceLabel,
      sourceLabel: 'Book Demo Popup',
    };
  }

  if (source === 'get-started') {
    return {
      leadType: 'Demo Booking',
      pageLabel: pageLabel || 'Get Started Page',
      captureLabel: 'Get Started Form',
      planLabel,
      priceLabel,
      sourceLabel: 'Get Started',
    };
  }

  if (source.startsWith('feature-')) {
    const featureName = toStartCase(source.replace(/^feature-/, ''));

    return {
      leadType: 'Feature Inquiry',
      pageLabel: pageLabel || `${featureName} Feature Page`,
      captureLabel: 'Feature Detail Form',
      planLabel: '—',
      priceLabel: '—',
      sourceLabel: featureName,
    };
  }

  if (source.endsWith('-page')) {
    const label = toStartCase(source.replace(/-page$/, ''));

    return {
      leadType: 'Website Lead',
      pageLabel: pageLabel || `${label} Page`,
      captureLabel: 'Page Form',
      planLabel,
      priceLabel,
      sourceLabel: label,
    };
  }

  return {
    leadType: 'Website Lead',
    pageLabel: pageLabel || 'Website',
    captureLabel: toStartCase(source),
    planLabel,
    priceLabel,
    sourceLabel: toStartCase(source),
  };
}