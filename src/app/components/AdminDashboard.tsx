import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ChevronRight,
  BarChart3,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  Download,
  Factory,
  Filter,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from 'lucide-react';
import { deleteEntry, getContacts, getLeads, type EntryCollection, type LeadEntry } from '@/lib/firebase';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import { PerformanceTab } from '@/app/components/PerformanceTab';
import { BlogAdmin } from '@/app/components/BlogAdmin';
import { getLeadAttribution, type LeadAttribution } from '@/lib/leadAttribution';

const ADMIN_EMAIL = 'avi2001raj@gmail.com';
const ADMIN_PASS_HASH = 'ba0353bdb0d7ff4735f7d1284e2d8f614ef193c8a12180e30a5a7f7735bd98c2';

const ALL_LEAD_TYPES = 'All lead types';
const ALL_PAGES = 'All pages';
const ALL_CAPTURE_POINTS = 'All capture points';
const ALL_PLANS = 'All plans';
const EMPTY_VALUE = '—';

type Tab = 'leads' | 'contacts' | 'performance' | 'blog';

type EnrichedLeadEntry = LeadEntry & {
  attribution: LeadAttribution;
};

type SelectedDashboardItem =
  | { tab: 'leads'; item: EnrichedLeadEntry }
  | { tab: 'contacts'; item: LeadEntry };

const panelClassName =
  'rounded-[28px] border border-white/10 bg-[#0b1323]/80 shadow-[0_24px_80px_rgba(2,8,23,0.55)] backdrop-blur-xl';

type SummaryCardTone = 'blue' | 'purple' | 'cyan' | 'emerald' | 'amber';

type CountSummary = {
  label: string;
  count: number;
};

const summaryCardStyles: Record<SummaryCardTone, { badge: string; icon: string; glow: string }> = {
  blue: { badge: 'bg-blue-500/12', icon: 'text-blue-300', glow: 'from-blue-500/18' },
  purple: { badge: 'bg-violet-500/12', icon: 'text-violet-300', glow: 'from-violet-500/18' },
  cyan: { badge: 'bg-cyan-500/12', icon: 'text-cyan-300', glow: 'from-cyan-500/18' },
  emerald: { badge: 'bg-emerald-500/12', icon: 'text-emerald-300', glow: 'from-emerald-500/18' },
  amber: { badge: 'bg-amber-500/12', icon: 'text-amber-300', glow: 'from-amber-500/18' },
};

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function uniqueOptions(values: string[], allLabel: string) {
  return [
    allLabel,
    ...Array.from(new Set(values.filter((value) => value && value !== EMPTY_VALUE))).sort((left, right) =>
      left.localeCompare(right),
    ),
  ];
}

function formatDate(dateStr?: string) {
  if (!dateStr) return EMPTY_VALUE;

  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatShortDate(dateStr?: string) {
  if (!dateStr) return EMPTY_VALUE;

  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function matchesSearch(entry: LeadEntry, query: string, extraFields: string[] = []) {
  if (!query) return true;

  const lowered = query.toLowerCase();
  const searchableFields = [
    entry.firstName,
    entry.lastName,
    entry.email,
    entry.phone,
    entry.companyName,
    entry.company,
    entry.jobTitle,
    entry.industry,
    entry.companySize,
    entry.source,
    entry.selectedPlan,
    entry.selectedPlanPrice,
    entry.sourcePageName,
    entry.sourcePagePath,
    ...extraFields,
  ];

  return searchableFields.some((field) => field?.toLowerCase().includes(lowered));
}

function downloadCSV(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;

  const keys = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
  const header = keys.join(',');
  const body = rows.map((row) =>
    keys
      .map((key) => `"${String(row[key] ?? '').replace(/"/g, '""')}"`)
      .join(','),
  );

  const csv = [header, ...body].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function countSince(entries: LeadEntry[], days: number) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return entries.filter((entry) => new Date(entry.submittedAt || 0).getTime() >= cutoff).length;
}

function summarizeCounts(values: string[], emptyLabel = EMPTY_VALUE): CountSummary[] {
  const counts = new Map<string, number>();

  values.forEach((value) => {
    const label = value && value !== EMPTY_VALUE ? value : emptyLabel;
    counts.set(label, (counts.get(label) || 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((left, right) => right.count - left.count);
}

function compactNumber(value: number) {
  return new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

export function AdminDashboard() {
  usePageMeta('Admin Dashboard', 'Talio admin dashboard — view unified leads, contacts, and performance insights.');

  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [logging, setLogging] = useState(false);

  const [tab, setTab] = useState<Tab>('leads');
  const [leads, setLeads] = useState<LeadEntry[]>([]);
  const [contacts, setContacts] = useState<LeadEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<SelectedDashboardItem | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [leadTypeFilter, setLeadTypeFilter] = useState(ALL_LEAD_TYPES);
  const [pageFilter, setPageFilter] = useState(ALL_PAGES);
  const [captureFilter, setCaptureFilter] = useState(ALL_CAPTURE_POINTS);
  const [planFilter, setPlanFilter] = useState(ALL_PLANS);

  useEffect(() => {
    if (sessionStorage.getItem('talio_admin') === 'true') {
      setAuthed(true);
    }
  }, []);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLogging(true);
    setLoginError('');

    const hash = await sha256(password);

    if (email === ADMIN_EMAIL && hash === ADMIN_PASS_HASH) {
      sessionStorage.setItem('talio_admin', 'true');
      setAuthed(true);
    } else {
      setLoginError('Invalid email or password.');
    }

    setLogging(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('talio_admin');
    setAuthed(false);
  };

  const fetchData = async () => {
    setLoading(true);

    try {
      const [leadEntries, contactEntries] = await Promise.all([getLeads(), getContacts()]);
      setLeads(leadEntries);
      setContacts(contactEntries);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (authed) {
      void fetchData();
    }
  }, [authed]);

  const enrichedLeads = useMemo<EnrichedLeadEntry[]>(
    () => leads.map((lead) => ({ ...lead, attribution: getLeadAttribution(lead) })),
    [leads],
  );

  const leadTypeOptions = useMemo(
    () => uniqueOptions(enrichedLeads.map((lead) => lead.attribution.leadType), ALL_LEAD_TYPES),
    [enrichedLeads],
  );
  const pageOptions = useMemo(
    () => uniqueOptions(enrichedLeads.map((lead) => lead.attribution.pageLabel), ALL_PAGES),
    [enrichedLeads],
  );
  const captureOptions = useMemo(
    () => uniqueOptions(enrichedLeads.map((lead) => lead.attribution.captureLabel), ALL_CAPTURE_POINTS),
    [enrichedLeads],
  );
  const planOptions = useMemo(
    () => uniqueOptions(enrichedLeads.map((lead) => lead.attribution.planLabel), ALL_PLANS),
    [enrichedLeads],
  );

  const filteredLeads = useMemo(
    () =>
      enrichedLeads.filter((lead) => {
        const matchesText = matchesSearch(lead, search, [
          lead.attribution.leadType,
          lead.attribution.pageLabel,
          lead.attribution.captureLabel,
          lead.attribution.planLabel,
          lead.attribution.sourceLabel,
        ]);

        const matchesLeadType = leadTypeFilter === ALL_LEAD_TYPES || lead.attribution.leadType === leadTypeFilter;
        const matchesPage = pageFilter === ALL_PAGES || lead.attribution.pageLabel === pageFilter;
        const matchesCapture = captureFilter === ALL_CAPTURE_POINTS || lead.attribution.captureLabel === captureFilter;
        const matchesPlan = planFilter === ALL_PLANS || lead.attribution.planLabel === planFilter;

        return matchesText && matchesLeadType && matchesPage && matchesCapture && matchesPlan;
      }),
    [captureFilter, enrichedLeads, leadTypeFilter, pageFilter, planFilter, search],
  );

  const filteredContacts = useMemo(
    () => contacts.filter((contact) => matchesSearch(contact, search, [contact.subject || '', contact.message || ''])),
    [contacts, search],
  );

  const demoBookingCount = useMemo(
    () => enrichedLeads.filter((lead) => lead.attribution.leadType === 'Demo Booking').length,
    [enrichedLeads],
  );
  const pricingPopupCount = useMemo(
    () => enrichedLeads.filter((lead) => lead.attribution.captureLabel === 'Pricing Plan Popup').length,
    [enrichedLeads],
  );
  const featureLeadCount = useMemo(
    () => enrichedLeads.filter((lead) => lead.attribution.captureLabel === 'Feature Detail Form').length,
    [enrichedLeads],
  );
  const recentLeadCount = useMemo(() => countSince(leads, 7), [leads]);
  const recentContactCount = useMemo(() => countSince(contacts, 7), [contacts]);
  const contactSubjectSummary = useMemo(
    () => summarizeCounts(filteredContacts.map((contact) => contact.subject || 'Unspecified')).slice(0, 5),
    [filteredContacts],
  );
  const leadCaptureSummary = useMemo(
    () => summarizeCounts(filteredLeads.map((lead) => lead.attribution.captureLabel)).slice(0, 5),
    [filteredLeads],
  );
  const leadPageSummary = useMemo(
    () => summarizeCounts(filteredLeads.map((lead) => lead.attribution.pageLabel)).slice(0, 5),
    [filteredLeads],
  );
  const leadPlanSummary = useMemo(
    () =>
      summarizeCounts(
        filteredLeads
          .map((lead) => lead.attribution.planLabel)
          .filter((plan) => plan && plan !== EMPTY_VALUE),
      ).slice(0, 5),
    [filteredLeads],
  );
  const recentFilteredLeads = useMemo(() => filteredLeads.slice(0, 5), [filteredLeads]);
  const recentFilteredContacts = useMemo(() => filteredContacts.slice(0, 5), [filteredContacts]);

  const leadFiltersActive =
    leadTypeFilter !== ALL_LEAD_TYPES ||
    pageFilter !== ALL_PAGES ||
    captureFilter !== ALL_CAPTURE_POINTS ||
    planFilter !== ALL_PLANS;

  const clearLeadFilters = () => {
    setLeadTypeFilter(ALL_LEAD_TYPES);
    setPageFilter(ALL_PAGES);
    setCaptureFilter(ALL_CAPTURE_POINTS);
    setPlanFilter(ALL_PLANS);
  };

  const tabMeta: Record<Tab, { eyebrow: string; title: string; description: string }> = {
    leads: {
      eyebrow: 'Sales Ops',
      title: 'Lead command center',
      description: 'A unified workspace for every lead captured from pricing popups, get-started flows, feature pages, and demo booking entry points.',
    },
    contacts: {
      eyebrow: 'Inbox',
      title: 'Contact request queue',
      description: 'Review direct outreach, support questions, and partnership enquiries in a cleaner, faster workflow.',
    },
    performance: {
      eyebrow: 'Intelligence',
      title: 'Performance radar',
      description: 'Traffic, visitor behavior, and conversion signals organized inside the same admin shell.',
    },
    blog: {
      eyebrow: 'Content',
      title: 'Blog studio',
      description: 'Create, edit, and publish blog posts. Manage editors and content strategy.',
    },
  };

  const sidebarItems: Array<{
    key: Tab;
    label: string;
    caption: string;
    icon: LucideIcon;
    count?: number;
  }> = [
    {
      key: 'leads',
      label: 'Lead Command',
      caption: 'Bookings, demos, feature forms',
      icon: LayoutDashboard,
      count: leads.length,
    },
    {
      key: 'contacts',
      label: 'Contact Inbox',
      caption: 'Direct requests and follow-ups',
      icon: Mail,
      count: contacts.length,
    },
    {
      key: 'performance',
      label: 'Performance',
      caption: 'Sessions, traffic, visitors',
      icon: BarChart3,
    },
    {
      key: 'blog',
      label: 'Blog Studio',
      caption: 'Posts, editors, publishing',
      icon: Briefcase,
    },
  ];

  const leadSummaryCards = [
    {
      label: 'Unified Leads',
      value: compactNumber(leads.length),
      helper: 'Leads + demo bookings',
      icon: Users,
      tone: 'blue' as SummaryCardTone,
    },
    {
      label: 'Demo Bookings',
      value: compactNumber(demoBookingCount),
      helper: 'Across popups and get started',
      icon: Calendar,
      tone: 'cyan' as SummaryCardTone,
    },
    {
      label: 'Pricing Popup Intent',
      value: compactNumber(pricingPopupCount),
      helper: 'Plan-qualified captures',
      icon: Wallet,
      tone: 'emerald' as SummaryCardTone,
    },
    {
      label: 'Last 7 Days',
      value: compactNumber(recentLeadCount),
      helper: 'Fresh inbound lead volume',
      icon: Sparkles,
      tone: 'purple' as SummaryCardTone,
    },
  ];

  const contactSummaryCards = [
    {
      label: 'Total Contacts',
      value: compactNumber(contacts.length),
      helper: 'All direct enquiries',
      icon: Mail,
      tone: 'purple' as SummaryCardTone,
    },
    {
      label: 'Last 7 Days',
      value: compactNumber(recentContactCount),
      helper: 'Recent inbox activity',
      icon: Sparkles,
      tone: 'cyan' as SummaryCardTone,
    },
    {
      label: 'Lead-Driven Forms',
      value: compactNumber(featureLeadCount),
      helper: 'Feature-page submissions',
      icon: Briefcase,
      tone: 'blue' as SummaryCardTone,
    },
    {
      label: 'Open Subjects',
      value: compactNumber(contactSubjectSummary.length),
      helper: 'Current subject clusters',
      icon: MessageSquare,
      tone: 'amber' as SummaryCardTone,
    },
  ];

  const exportCSV = () => {
    if (tab === 'leads') {
      downloadCSV(
        `talio-leads-${new Date().toISOString().slice(0, 10)}.csv`,
        filteredLeads.map((lead) => ({
          name: `${lead.firstName} ${lead.lastName}`.trim(),
          email: lead.email,
          phone: lead.phone || '',
          company: lead.companyName || lead.company || '',
          jobTitle: lead.jobTitle || '',
          companySize: lead.companySize || '',
          industry: lead.industry || '',
          leadType: lead.attribution.leadType,
          page: lead.attribution.pageLabel,
          pagePath: lead.sourcePagePath || '',
          capturePoint: lead.attribution.captureLabel,
          plan: lead.attribution.planLabel === EMPTY_VALUE ? '' : lead.attribution.planLabel,
          planPrice: lead.selectedPlanPrice || '',
          preferredDate: lead.preferredDate || '',
          preferredTime: lead.preferredTime || '',
          source: lead.source,
          collection: lead._collection || 'leads',
          submittedAt: lead.submittedAt,
        })),
      );
      return;
    }

    if (tab === 'contacts') {
      downloadCSV(
        `talio-contacts-${new Date().toISOString().slice(0, 10)}.csv`,
        filteredContacts.map((contact) => ({
          name: `${contact.firstName} ${contact.lastName}`.trim(),
          email: contact.email,
          phone: contact.phone || '',
          subject: contact.subject || '',
          message: contact.message || '',
          source: contact.source,
          submittedAt: contact.submittedAt,
        })),
      );
    }
  };

  const handleDelete = async (item: LeadEntry) => {
    if (!item.id) return;

    const collection: EntryCollection = item._collection || (tab === 'contacts' ? 'contacts' : 'leads');
    const deletionKey = `${collection}:${item.id}`;
    setDeleting(deletionKey);

    try {
      await deleteEntry(collection, item.id);

      if (collection === 'contacts') {
        setContacts((previous) => previous.filter((entry) => !(entry.id === item.id && entry._collection === 'contacts')));
      } else {
        setLeads((previous) => previous.filter((entry) => !(entry.id === item.id && entry._collection === collection)));
      }

      if (
        selectedItem &&
        selectedItem.item.id === item.id &&
        (selectedItem.item._collection || (selectedItem.tab === 'contacts' ? 'contacts' : 'leads')) === collection
      ) {
        setSelectedItem(null);
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }

    setDeleting(null);
  };

  if (!authed) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#050816] px-4 py-10 text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[12%] top-[8%] h-72 w-72 rounded-full bg-cyan-500/12 blur-3xl" />
          <div className="absolute right-[8%] top-[18%] h-80 w-80 rounded-full bg-blue-600/12 blur-3xl" />
          <div className="absolute bottom-[10%] left-1/3 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center">
          <div className="grid w-full gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`${panelClassName} relative overflow-hidden p-8 md:p-10`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_42%)]" />
              <div className="relative space-y-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
                  Talio Admin System
                </div>

                <div>
                  <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
                    Dark ops dashboard with a sharper command workflow.
                  </h1>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400 md:text-base">
                    Leads, contact requests, and performance intelligence now live inside one clearer control room. Sign in to manage the full capture pipeline.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { label: 'Unified lead ledger', value: 'Leads + demo bookings + page attribution' },
                    { label: 'Sidebar-first layout', value: 'Fast switching across sales, inbox, and analytics' },
                    { label: 'Filter-rich lead ops', value: 'Plan, page, capture point, and source context' },
                    { label: 'Live motion surfaces', value: 'Animated dark shell tuned for admin workflows' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{item.label}</div>
                      <div className="mt-2 text-sm text-slate-300">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={`${panelClassName} p-8 md:p-10`}
            >
              <div className="mb-8">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 shadow-[0_18px_40px_rgba(14,165,233,0.28)]">
                  <LayoutDashboard className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-white">Access the control room</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Sign in to review lead attribution, campaign intent, contact requests, and traffic intelligence.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="email"
                  placeholder="Admin email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#0f172a]/80 px-4 py-3 text-sm text-white placeholder-slate-500 transition focus:border-cyan-400/60 focus:outline-none"
                />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#0f172a]/80 px-4 py-3 text-sm text-white placeholder-slate-500 transition focus:border-cyan-400/60 focus:outline-none"
                />
                {loginError && <p className="text-sm text-red-400">{loginError}</p>}
                <button
                  type="submit"
                  disabled={logging}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-slate-950 transition hover:bg-slate-100 disabled:opacity-60"
                >
                  {logging ? 'Signing in...' : 'Open Dashboard'}
                  {!logging && <ChevronRight className="h-4 w-4" />}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel relative min-h-screen bg-[#050816] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[6%] top-[8%] h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-[8%] top-[12%] h-80 w-80 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute bottom-[6%] right-[18%] h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen">
        <aside className="hidden w-[300px] shrink-0 border-r border-white/10 bg-[#08111f]/85 backdrop-blur-xl xl:sticky xl:top-0 xl:h-screen xl:overflow-y-auto xl:flex xl:flex-col">
          <div className="flex h-full flex-col px-5 py-6">
            <div className="space-y-2">
              {sidebarItems.map((item) => (
                <SidebarNavItem
                  key={item.key}
                  active={tab === item.key}
                  icon={item.icon}
                  label={item.label}
                  caption={item.caption}
                  count={item.count}
                  onClick={() => setTab(item.key)}
                />
              ))}
            </div>

            <div className="mt-6 space-y-4">
              <div className={`${panelClassName} p-4`}>
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Quick Snapshot</div>
                <div className="mt-4 grid gap-3">
                  <SidebarStat label="Unified leads" value={compactNumber(leads.length)} helper="Including demo bookings" />
                  <SidebarStat label="Contacts" value={compactNumber(contacts.length)} helper="Direct inbound requests" />
                  <SidebarStat label="Pricing intent" value={compactNumber(pricingPopupCount)} helper="Captured from plan popups" />
                </div>
              </div>
            </div>

            <div className="mt-auto grid gap-3 pt-6">
              <button
                onClick={() => void fetchData()}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white transition hover:bg-white/[0.08] disabled:opacity-60"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh Data
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm font-medium text-red-200 transition hover:bg-red-500/12"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-[#07101c]/72 backdrop-blur-xl">
            <div className="flex flex-col gap-4 px-4 py-4 md:px-6 xl:px-8 xl:py-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">{tabMeta[tab].eyebrow}</div>
                  <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">{tabMeta[tab].title}</h1>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">{tabMeta[tab].description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {tab !== 'performance' && (
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300">
                      <Search className="h-3.5 w-3.5 text-slate-500" />
                      {tab === 'leads' ? `${filteredLeads.length} visible leads` : `${filteredContacts.length} visible contacts`}
                    </div>
                  )}
                  {tab !== 'performance' && (
                    <button
                      onClick={exportCSV}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/[0.08]"
                    >
                      <Download className="h-4 w-4" />
                      Export CSV
                    </button>
                  )}
                  <button
                    onClick={() => void fetchData()}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/[0.08] disabled:opacity-60"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto xl:hidden">
                {sidebarItems.map((item) => (
                  <SidebarNavItem
                    key={item.key}
                    active={tab === item.key}
                    icon={item.icon}
                    label={item.label}
                    caption={item.caption}
                    count={item.count}
                    compact
                    onClick={() => setTab(item.key)}
                  />
                ))}
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-5 md:px-6 xl:px-8 xl:py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                {tab === 'leads' && (
                  <>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      {leadSummaryCards.map((card) => (
                        <SummaryMetricCard key={card.label} {...card} />
                      ))}
                    </div>

                    <div className="space-y-6">
                        <div className={`${panelClassName} p-5 md:p-6`}>
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
                                <Filter className="h-3.5 w-3.5" />
                                Lead Filters
                              </div>
                              <h3 className="mt-4 text-xl font-semibold text-white">Explore the lead pipeline</h3>
                              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                                Narrow the ledger by source context, sales intent, or page origin before drilling into the details.
                              </p>
                            </div>

                            <div className="relative w-full max-w-md lg:w-[320px]">
                              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                              <input
                                type="text"
                                placeholder="Search by name, company, page, source, or plan..."
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 transition focus:border-cyan-400/50 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                            <FilterSelect label="Lead Type" value={leadTypeFilter} options={leadTypeOptions} onChange={setLeadTypeFilter} />
                            <FilterSelect label="Page" value={pageFilter} options={pageOptions} onChange={setPageFilter} />
                            <FilterSelect label="Capture Point" value={captureFilter} options={captureOptions} onChange={setCaptureFilter} />
                            <FilterSelect label="Plan" value={planFilter} options={planOptions} onChange={setPlanFilter} />
                          </div>

                          <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex flex-wrap gap-2">
                              <ActiveFilterChip active={leadTypeFilter !== ALL_LEAD_TYPES} label={`Type: ${leadTypeFilter}`} />
                              <ActiveFilterChip active={pageFilter !== ALL_PAGES} label={`Page: ${pageFilter}`} />
                              <ActiveFilterChip active={captureFilter !== ALL_CAPTURE_POINTS} label={`Capture: ${captureFilter}`} />
                              <ActiveFilterChip active={planFilter !== ALL_PLANS} label={`Plan: ${planFilter}`} />
                            </div>

                            <button
                              type="button"
                              onClick={clearLeadFilters}
                              disabled={!leadFiltersActive}
                              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Clear Filters
                            </button>
                          </div>
                        </div>

                        <div className={`${panelClassName} overflow-hidden`}>
                          <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-6">
                            <div>
                              <h3 className="text-xl font-semibold text-white">Lead ledger</h3>
                              <p className="mt-1 text-sm text-slate-400">
                                Showing {filteredLeads.length} of {enrichedLeads.length} leads with attribution-ready metadata.
                              </p>
                            </div>
                          </div>

                          {loading ? (
                            <div className="flex items-center justify-center py-24">
                              <RefreshCw className="h-6 w-6 animate-spin text-slate-500" />
                            </div>
                          ) : filteredLeads.length === 0 ? (
                            <EmptyState title="No leads found" description="Try changing the search term or lead filters." />
                          ) : (
                            <LeadTable
                              leads={filteredLeads}
                              deleting={deleting}
                              onOpen={(item) => setSelectedItem({ tab: 'leads', item })}
                              onDelete={handleDelete}
                            />
                          )}
                        </div>
                      </div>
                  </>
                )}

                {tab === 'contacts' && (
                  <>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      {contactSummaryCards.map((card) => (
                        <SummaryMetricCard key={card.label} {...card} />
                      ))}
                    </div>

                    <div className={`${panelClassName} overflow-hidden`}>
                        <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-6">
                          <div>
                            <h3 className="text-xl font-semibold text-white">Contact inbox</h3>
                            <p className="mt-1 text-sm text-slate-400">Search and review direct contact enquiries with the same modal drill-down workflow.</p>
                          </div>

                          <div className="relative w-full max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                            <input
                              type="text"
                              placeholder="Search by name, email, subject..."
                              value={search}
                              onChange={(event) => setSearch(event.target.value)}
                              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 transition focus:border-cyan-400/50 focus:outline-none"
                            />
                          </div>
                        </div>

                        {loading ? (
                          <div className="flex items-center justify-center py-24">
                            <RefreshCw className="h-6 w-6 animate-spin text-slate-500" />
                          </div>
                        ) : filteredContacts.length === 0 ? (
                          <EmptyState title="No contacts found" description="No contact requests match the current search." />
                        ) : (
                          <ContactTable
                            contacts={filteredContacts}
                            deleting={deleting}
                            onOpen={(item) => setSelectedItem({ tab: 'contacts', item })}
                            onDelete={handleDelete}
                          />
                        )}
                      </div>
                  </>
                )}

                {tab === 'performance' && (
                  <>
                    <div className="grid gap-4 md:grid-cols-3">
                      <SummaryMetricCard label="Unified lead base" value={compactNumber(leads.length)} helper="Available to analytics and sales ops" icon={Users} tone="blue" />
                      <SummaryMetricCard label="Direct contact volume" value={compactNumber(contacts.length)} helper="Support and sales inbox activity" icon={Mail} tone="purple" />
                      <SummaryMetricCard label="Sidebar workflow" value="1 shell" helper="Performance stays within the admin app frame" icon={BarChart3} tone="cyan" />
                    </div>

                    <div className={`${panelClassName} p-4 md:p-5`}>
                      <PerformanceTab />
                    </div>
                  </>
                )}

                {tab === 'blog' && (
                  <BlogAdmin authorEmail={email} authorName="Admin" />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(event) => event.stopPropagation()}
              className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-white/10 bg-[#091120]/95 shadow-[0_32px_90px_rgba(0,0,0,0.55)] backdrop-blur-xl"
            >
              <DashboardDetailModal
                selectedItem={selectedItem}
                deleting={deleting}
                onClose={() => setSelectedItem(null)}
                onDelete={handleDelete}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarNavItem({
  active,
  caption,
  compact = false,
  count,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  caption: string;
  compact?: boolean;
  count?: number;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border text-left transition-all ${
        compact ? 'min-w-[220px] px-4 py-3' : 'w-full px-4 py-4'
      } ${active ? 'border-cyan-400/25 bg-cyan-400/8' : 'border-white/8 bg-white/[0.03] hover:bg-white/[0.05]'}`}
    >
      {active && (
        <motion.div
          layoutId={compact ? 'admin-mobile-tab' : 'admin-sidebar-tab'}
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/12 via-blue-500/10 to-transparent"
        />
      )}

      <div className="relative flex items-start gap-3">
        <div className={`flex ${compact ? 'h-10 w-10' : 'h-11 w-11'} shrink-0 items-center justify-center rounded-2xl ${active ? 'bg-cyan-400/14 text-cyan-200' : 'bg-white/[0.06] text-slate-300'}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-white">{label}</span>
            {typeof count === 'number' && (
              <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] text-slate-300">
                {compactNumber(count)}
              </span>
            )}
          </div>
          {!compact && <p className="mt-1 text-xs leading-relaxed text-slate-500">{caption}</p>}
        </div>
        {!compact && <ChevronRight className={`mt-0.5 h-4 w-4 shrink-0 ${active ? 'text-cyan-200' : 'text-slate-600'}`} />}
      </div>
    </motion.button>
  );
}

function SidebarStat({ helper, label, value }: { helper: string; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3.5">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="mt-2 text-lg font-semibold text-white">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{helper}</div>
    </div>
  );
}

function SummaryMetricCard({
  helper,
  icon: Icon,
  label,
  tone,
  value,
}: {
  helper: string;
  icon: LucideIcon;
  label: string;
  tone: SummaryCardTone;
  value: string;
}) {
  const style = summaryCardStyles[tone];

  return (
    <motion.div whileHover={{ y: -3 }} className={`${panelClassName} relative overflow-hidden p-5`}>
      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${style.glow} to-transparent`} />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</div>
          <div className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</div>
          <div className="mt-2 text-xs text-slate-500">{helper}</div>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${style.badge}`}>
          <Icon className={`h-5 w-5 ${style.icon}`} />
        </div>
      </div>
    </motion.div>
  );
}

function ActiveFilterChip({ active, label }: { active: boolean; label: string }) {
  if (!active) return null;

  return (
    <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-100">
      {label}
    </span>
  );
}

function InsightListCard({
  description,
  emptyLabel,
  icon: Icon,
  items,
  title,
}: {
  description: string;
  emptyLabel: string;
  icon: LucideIcon;
  items: CountSummary[];
  title: string;
}) {
  const maxCount = items[0]?.count || 1;

  return (
    <div className={`${panelClassName} p-5`}>
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.05] text-cyan-200">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">{description}</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-5 text-sm text-slate-500">{emptyLabel}</div>
      ) : (
        <div className="mt-5 space-y-3">
          {items.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-3.5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-200">{item.label}</span>
                <span className="text-sm font-semibold text-white">{compactNumber(item.count)}</span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500" style={{ width: `${(item.count / maxCount) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RecentLeadsCard({ leads }: { leads: EnrichedLeadEntry[] }) {
  return (
    <div className={`${panelClassName} p-5`}>
      <h3 className="text-lg font-semibold text-white">Recent filtered leads</h3>
      <p className="mt-1 text-sm text-slate-500">A quick scan of the newest entries in the active lead view.</p>

      {leads.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-5 text-sm text-slate-500">No recent leads in this view.</div>
      ) : (
        <div className="mt-5 space-y-3">
          {leads.map((lead) => (
            <div key={`${lead._collection || 'leads'}:${lead.id}`} className="rounded-2xl border border-white/8 bg-white/[0.03] p-3.5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-white">{lead.firstName} {lead.lastName}</div>
                  <div className="mt-1 text-xs text-slate-500">{lead.email}</div>
                </div>
                <span className="rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-[11px] text-slate-300">
                  {lead.attribution.captureLabel}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-500">
                <span>{lead.attribution.pageLabel}</span>
                <span>{formatDate(lead.submittedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RecentContactsCard({ contacts }: { contacts: LeadEntry[] }) {
  return (
    <div className={`${panelClassName} p-5`}>
      <h3 className="text-lg font-semibold text-white">Recent contact requests</h3>
      <p className="mt-1 text-sm text-slate-500">Newest conversations waiting in the contact inbox.</p>

      {contacts.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-5 text-sm text-slate-500">No recent contact requests in this view.</div>
      ) : (
        <div className="mt-5 space-y-3">
          {contacts.map((contact) => (
            <div key={`${contact._collection || 'contacts'}:${contact.id}`} className="rounded-2xl border border-white/8 bg-white/[0.03] p-3.5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-white">{contact.firstName} {contact.lastName}</div>
                  <div className="mt-1 text-xs text-slate-500">{contact.email}</div>
                </div>
                <span className="rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-[11px] text-slate-300">
                  {contact.subject || 'Unspecified'}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-500">
                <span>{contact.source}</span>
                <span>{formatDate(contact.submittedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: string[];
  value: string;
}) {
  return (
    <label className="space-y-1">
      <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-white transition focus:border-gray-600 focus:outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="py-20 text-center text-gray-500">
      <Users className="mx-auto mb-3 h-10 w-10 opacity-40" />
      <p className="text-base text-gray-300">{title}</p>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
}

function LeadTable({
  leads,
  deleting,
  onDelete,
  onOpen,
}: {
  leads: EnrichedLeadEntry[];
  deleting: string | null;
  onDelete: (item: LeadEntry) => void;
  onOpen: (item: EnrichedLeadEntry) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.02]">
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Lead</th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Contact</th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Company</th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Page</th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Captured Via</th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Plan</th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Date</th>
            <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, index) => {
            const deletionKey = `${lead._collection || 'leads'}:${lead.id}`;

            return (
              <motion.tr
                key={`${lead._collection || 'leads'}:${lead.id || index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => onOpen(lead)}
                className="cursor-pointer border-b border-white/6 transition-colors hover:bg-white/[0.04]"
              >
                <td className="px-5 py-4 align-top">
                  <div className="min-w-[170px]">
                    <div className="font-medium text-white">{`${lead.firstName} ${lead.lastName}`.trim() || lead.email}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[11px] font-medium text-blue-200">
                        {lead.attribution.leadType}
                      </span>
                      {lead._collection === 'signups' && (
                        <span className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-200">
                          Demo booking
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 align-top">
                  <div className="min-w-[220px]">
                    <div className="text-slate-300">{lead.email}</div>
                    <div className="mt-1 text-xs text-slate-500">{lead.phone || EMPTY_VALUE}</div>
                  </div>
                </td>
                <td className="px-5 py-4 align-top">
                  <div className="min-w-[180px]">
                    <div className="text-slate-300">{lead.companyName || lead.company || EMPTY_VALUE}</div>
                    <div className="mt-1 text-xs text-slate-500">{lead.jobTitle || lead.companySize || EMPTY_VALUE}</div>
                  </div>
                </td>
                <td className="px-5 py-4 align-top">
                  <div className="min-w-[180px]">
                    <div className="text-slate-300">{lead.attribution.pageLabel}</div>
                    <div className="mt-1 text-xs text-slate-500">{lead.sourcePagePath || EMPTY_VALUE}</div>
                  </div>
                </td>
                <td className="px-5 py-4 align-top">
                  <div className="min-w-[180px]">
                    <span className="inline-flex rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-xs text-slate-300">
                      {lead.attribution.captureLabel}
                    </span>
                    <div className="mt-2 text-xs text-slate-500">{lead.source}</div>
                  </div>
                </td>
                <td className="px-5 py-4 align-top text-slate-300">
                  <div className="min-w-[140px]">
                    <div>{lead.attribution.planLabel}</div>
                    <div className="mt-1 text-xs text-slate-500">{lead.selectedPlanPrice || EMPTY_VALUE}</div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-5 py-4 align-top text-slate-500">{formatDate(lead.submittedAt)}</td>
                <td className="px-5 py-4 text-right align-top">
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onDelete(lead);
                    }}
                    disabled={deleting === deletionKey}
                    className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-red-900/20 hover:text-red-400 disabled:opacity-40"
                    title="Delete"
                  >
                    {deleting === deletionKey ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ContactTable({
  contacts,
  deleting,
  onDelete,
  onOpen,
}: {
  contacts: LeadEntry[];
  deleting: string | null;
  onDelete: (item: LeadEntry) => void;
  onOpen: (item: LeadEntry) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.02]">
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Email</th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Phone</th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Subject</th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Source</th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Date</th>
            <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact, index) => {
            const deletionKey = `${contact._collection || 'contacts'}:${contact.id}`;

            return (
              <motion.tr
                key={`${contact._collection || 'contacts'}:${contact.id || index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => onOpen(contact)}
                className="cursor-pointer border-b border-white/6 transition-colors hover:bg-white/[0.04]"
              >
                <td className="whitespace-nowrap px-5 py-4 font-medium text-white">{contact.firstName} {contact.lastName}</td>
                <td className="px-5 py-4 text-slate-300">{contact.email}</td>
                <td className="px-5 py-4 text-slate-400">{contact.phone || EMPTY_VALUE}</td>
                <td className="px-5 py-4 text-slate-400">{contact.subject || EMPTY_VALUE}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-xs text-slate-300">
                    {contact.source}
                  </span>
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-slate-500">{formatDate(contact.submittedAt)}</td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onDelete(contact);
                    }}
                    disabled={deleting === deletionKey}
                    className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-red-900/20 hover:text-red-400 disabled:opacity-40"
                    title="Delete"
                  >
                    {deleting === deletionKey ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function DashboardDetailModal({
  deleting,
  onClose,
  onDelete,
  selectedItem,
}: {
  deleting: string | null;
  onClose: () => void;
  onDelete: (item: LeadEntry) => void;
  selectedItem: SelectedDashboardItem;
}) {
  const isLead = selectedItem.tab === 'leads';
  const item = selectedItem.item;
  const deletionKey = `${item._collection || (isLead ? 'leads' : 'contacts')}:${item.id}`;

  return (
    <>
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#091120]/95 px-6 py-4 backdrop-blur-xl">
        <div>
          <h3 className="text-lg font-bold text-white">
            {item.firstName} {item.lastName}
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">{formatDate(item.submittedAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDelete(item)}
            disabled={deleting === deletionKey}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-900/20 hover:text-red-400"
            title="Delete"
          >
            {deleting === deletionKey ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </button>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4 px-6 py-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DetailField icon={Mail} label="Email" value={item.email} />
          <DetailField icon={Phone} label="Phone" value={item.phone} />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DetailField icon={Building2} label="Company" value={item.companyName || item.company} />
          <DetailField icon={Users} label="Company Size" value={item.companySize} />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DetailField icon={Briefcase} label="Job Title" value={item.jobTitle} />
          <DetailField icon={Factory} label="Industry" value={item.industry} />
        </div>

        {isLead && <LeadCaptureDetails lead={item as EnrichedLeadEntry} />}

        {selectedItem.tab === 'contacts' && (
          <>
            {item.subject && (
              <div className="border-t border-white/10 pt-2">
                <p className="mb-1 text-xs uppercase tracking-wider text-slate-500">Subject</p>
                <p className="text-sm font-medium text-white">{item.subject}</p>
              </div>
            )}
            {item.message && (
              <div className="border-t border-white/10 pt-2">
                <div className="mb-2 flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-slate-500" />
                  <p className="text-xs uppercase tracking-wider text-slate-500">Message</p>
                </div>
                <p className="rounded-xl border border-white/8 bg-white/[0.04] p-4 text-sm leading-relaxed text-slate-300">
                  {item.message}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

function LeadCaptureDetails({ lead }: { lead: EnrichedLeadEntry }) {
  return (
    <>
      <div className="border-t border-white/10 pt-2">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DetailField icon={Users} label="Lead Type" value={lead.attribution.leadType} />
          <DetailField icon={MapPin} label="Page" value={lead.attribution.pageLabel} meta={lead.sourcePagePath} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <DetailField icon={Briefcase} label="Capture Point" value={lead.attribution.captureLabel} meta={lead.source} />
        <DetailField icon={Wallet} label="Plan" value={lead.attribution.planLabel} meta={lead.selectedPlanPrice} />
      </div>

      {(lead.preferredDate || lead.preferredTime) && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DetailField icon={Calendar} label="Preferred Date" value={formatShortDate(lead.preferredDate)} />
          <DetailField icon={Clock} label="Preferred Time" value={lead.preferredTime} />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-2">
        <span className="text-xs uppercase tracking-wider text-slate-500">Stored In</span>
        <span className="inline-flex rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-xs text-slate-300">
          {lead._collection || 'leads'}
        </span>
        <span className="inline-flex rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-xs text-slate-300">
          {lead.attribution.sourceLabel}
        </span>
      </div>
    </>
  );
}

function DetailField({
  icon: Icon,
  label,
  meta,
  value,
}: {
  icon: LucideIcon;
  label: string;
  meta?: string;
  value?: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-3.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
        <p className="break-words text-sm text-white">{value || EMPTY_VALUE}</p>
        {meta && meta !== EMPTY_VALUE && <p className="mt-1 break-all text-xs text-slate-500">{meta}</p>}
      </div>
    </div>
  );
}
