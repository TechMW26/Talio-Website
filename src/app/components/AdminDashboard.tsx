import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  BarChart3,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  Download,
  Factory,
  LogOut,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  Trash2,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from 'lucide-react';
import { deleteEntry, getContacts, getLeads, type EntryCollection, type LeadEntry } from '@/lib/firebase';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import { PerformanceTab } from '@/app/components/PerformanceTab';
import { getLeadAttribution, type LeadAttribution } from '@/lib/leadAttribution';

const ADMIN_EMAIL = 'avi2001raj@gmail.com';
const ADMIN_PASS_HASH = 'ba0353bdb0d7ff4735f7d1284e2d8f614ef193c8a12180e30a5a7f7735bd98c2';

const ALL_LEAD_TYPES = 'All lead types';
const ALL_PAGES = 'All pages';
const ALL_CAPTURE_POINTS = 'All capture points';
const ALL_PLANS = 'All plans';
const EMPTY_VALUE = '—';

type Tab = 'leads' | 'contacts' | 'performance';
type DashboardTone = 'blue' | 'purple' | 'cyan';

type EnrichedLeadEntry = LeadEntry & {
  attribution: LeadAttribution;
};

type SelectedDashboardItem =
  | { tab: 'leads'; item: EnrichedLeadEntry }
  | { tab: 'contacts'; item: LeadEntry };

const toneClasses: Record<DashboardTone, { badge: string; icon: string }> = {
  blue: { badge: 'bg-blue-500/10', icon: 'text-blue-400' },
  purple: { badge: 'bg-purple-500/10', icon: 'text-purple-400' },
  cyan: { badge: 'bg-cyan-500/10', icon: 'text-cyan-400' },
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
      <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="rounded-2xl border border-gray-800/60 bg-gray-900/80 p-8">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600">
                <Users className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-400">Sign in to view leads, contacts, and performance</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none"
              />
              {loginError && <p className="text-sm text-red-400">{loginError}</p>}
              <button
                type="submit"
                disabled={logging}
                className="w-full rounded-full bg-white px-8 py-4 text-base font-semibold text-black transition hover:bg-gray-100 disabled:opacity-60"
              >
                {logging ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="sticky top-0 z-30 border-b border-gray-800/60 bg-gray-900/40 backdrop-blur-sm">
        <div className="flex w-full items-center justify-between px-8 py-4">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => void fetchData()}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm transition hover:bg-gray-700"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-300 transition hover:border-red-800 hover:bg-red-900/50 hover:text-red-300"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="w-full px-8 py-8">
        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            { key: 'leads' as Tab, label: 'Leads', icon: Users, tone: 'blue' as DashboardTone, count: leads.length },
            { key: 'contacts' as Tab, label: 'Contacts', icon: Mail, tone: 'purple' as DashboardTone, count: contacts.length },
            { key: 'performance' as Tab, label: 'Performance', icon: BarChart3, tone: 'cyan' as DashboardTone, count: null },
          ].map(({ key, label, icon, tone, count }) => (
            <DashboardCard
              key={key}
              active={tab === key}
              label={label}
              count={count}
              icon={icon}
              tone={tone}
              onClick={() => setTab(key)}
            />
          ))}
        </div>

        {tab === 'performance' && <PerformanceTab />}

        {tab !== 'performance' && (
          <>
            <div className="mb-6 space-y-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder={tab === 'leads' ? 'Search by name, company, page, source, or plan...' : 'Search by name, email, subject...'}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="w-full rounded-xl border border-gray-800 bg-gray-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 transition focus:border-gray-600 focus:outline-none"
                  />
                </div>
                <button
                  onClick={exportCSV}
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm transition hover:bg-gray-800"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>
              </div>

              {tab === 'leads' && (
                <>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
                    <FilterSelect label="Lead Type" value={leadTypeFilter} options={leadTypeOptions} onChange={setLeadTypeFilter} />
                    <FilterSelect label="Page" value={pageFilter} options={pageOptions} onChange={setPageFilter} />
                    <FilterSelect label="Capture Point" value={captureFilter} options={captureOptions} onChange={setCaptureFilter} />
                    <FilterSelect label="Plan" value={planFilter} options={planOptions} onChange={setPlanFilter} />
                    <button
                      type="button"
                      onClick={clearLeadFilters}
                      disabled={!leadFiltersActive}
                      className="rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-gray-300 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Clear Filters
                    </button>
                  </div>

                  <p className="text-xs text-gray-500">
                    Showing {filteredLeads.length} of {enrichedLeads.length} leads
                  </p>
                </>
              )}
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-800/60 bg-gray-900/60">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <RefreshCw className="h-6 w-6 animate-spin text-gray-500" />
                </div>
              ) : tab === 'leads' ? (
                filteredLeads.length === 0 ? (
                  <EmptyState title="No leads found" description="Try changing the search term or lead filters." />
                ) : (
                  <LeadTable
                    leads={filteredLeads}
                    deleting={deleting}
                    onOpen={(item) => setSelectedItem({ tab: 'leads', item })}
                    onDelete={handleDelete}
                  />
                )
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

            <AnimatePresence>
              {selectedItem && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedItem(null)}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.2 }}
                    onClick={(event) => event.stopPropagation()}
                    className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl"
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
          </>
        )}
      </div>
    </div>
  );
}

function DashboardCard({
  active,
  label,
  count,
  icon: Icon,
  onClick,
  tone,
}: {
  active: boolean;
  label: string;
  count: number | null;
  icon: LucideIcon;
  onClick: () => void;
  tone: DashboardTone;
}) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-6 text-left transition-all ${
        active ? 'border-gray-600 bg-gray-800/80' : 'border-gray-800/60 bg-gray-900/60 hover:border-gray-700'
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneClasses[tone].badge}`}>
          <Icon className={`h-5 w-5 ${toneClasses[tone].icon}`} />
        </div>
        {count !== null && <span className="text-3xl font-bold text-white">{count}</span>}
      </div>
      <p className="text-sm text-gray-400">{label}</p>
    </motion.button>
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
          <tr className="border-b border-gray-800/60">
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Lead</th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Contact</th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Company</th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Page</th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Captured Via</th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Plan</th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Date</th>
            <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Actions</th>
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
                className="cursor-pointer border-b border-gray-800/40 transition-colors hover:bg-gray-800/30"
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
                    <div className="text-gray-300">{lead.email}</div>
                    <div className="mt-1 text-xs text-gray-500">{lead.phone || EMPTY_VALUE}</div>
                  </div>
                </td>
                <td className="px-5 py-4 align-top">
                  <div className="min-w-[180px]">
                    <div className="text-gray-300">{lead.companyName || lead.company || EMPTY_VALUE}</div>
                    <div className="mt-1 text-xs text-gray-500">{lead.jobTitle || lead.companySize || EMPTY_VALUE}</div>
                  </div>
                </td>
                <td className="px-5 py-4 align-top">
                  <div className="min-w-[180px]">
                    <div className="text-gray-300">{lead.attribution.pageLabel}</div>
                    <div className="mt-1 text-xs text-gray-500">{lead.sourcePagePath || EMPTY_VALUE}</div>
                  </div>
                </td>
                <td className="px-5 py-4 align-top">
                  <div className="min-w-[180px]">
                    <span className="inline-flex rounded-full border border-gray-700 bg-gray-800 px-2.5 py-1 text-xs text-gray-300">
                      {lead.attribution.captureLabel}
                    </span>
                    <div className="mt-2 text-xs text-gray-500">{lead.source}</div>
                  </div>
                </td>
                <td className="px-5 py-4 align-top text-gray-300">
                  <div className="min-w-[140px]">
                    <div>{lead.attribution.planLabel}</div>
                    <div className="mt-1 text-xs text-gray-500">{lead.selectedPlanPrice || EMPTY_VALUE}</div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-5 py-4 align-top text-gray-500">{formatDate(lead.submittedAt)}</td>
                <td className="px-5 py-4 text-right align-top">
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onDelete(lead);
                    }}
                    disabled={deleting === deletionKey}
                    className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-red-900/20 hover:text-red-400 disabled:opacity-40"
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
          <tr className="border-b border-gray-800/60">
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Name</th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Email</th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Phone</th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Subject</th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Source</th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Date</th>
            <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Actions</th>
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
                className="cursor-pointer border-b border-gray-800/40 transition-colors hover:bg-gray-800/30"
              >
                <td className="whitespace-nowrap px-5 py-4 font-medium text-white">{contact.firstName} {contact.lastName}</td>
                <td className="px-5 py-4 text-gray-300">{contact.email}</td>
                <td className="px-5 py-4 text-gray-400">{contact.phone || EMPTY_VALUE}</td>
                <td className="px-5 py-4 text-gray-400">{contact.subject || EMPTY_VALUE}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full border border-gray-700 bg-gray-800 px-2.5 py-1 text-xs text-gray-300">
                    {contact.source}
                  </span>
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-gray-500">{formatDate(contact.submittedAt)}</td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onDelete(contact);
                    }}
                    disabled={deleting === deletionKey}
                    className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-red-900/20 hover:text-red-400 disabled:opacity-40"
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
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-800/60 bg-gray-900 px-6 py-4">
        <div>
          <h3 className="text-lg font-bold text-white">
            {item.firstName} {item.lastName}
          </h3>
          <p className="mt-0.5 text-xs text-gray-500">{formatDate(item.submittedAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDelete(item)}
            disabled={deleting === deletionKey}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-900/20 hover:text-red-400"
            title="Delete"
          >
            {deleting === deletionKey ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </button>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white">
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
              <div className="border-t border-gray-800/60 pt-2">
                <p className="mb-1 text-xs uppercase tracking-wider text-gray-500">Subject</p>
                <p className="text-sm font-medium text-white">{item.subject}</p>
              </div>
            )}
            {item.message && (
              <div className="border-t border-gray-800/60 pt-2">
                <div className="mb-2 flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-gray-500" />
                  <p className="text-xs uppercase tracking-wider text-gray-500">Message</p>
                </div>
                <p className="rounded-xl border border-gray-800/40 bg-gray-800/40 p-4 text-sm leading-relaxed text-gray-300">
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
      <div className="border-t border-gray-800/60 pt-2">
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

      <div className="flex flex-wrap items-center gap-2 border-t border-gray-800/60 pt-2">
        <span className="text-xs uppercase tracking-wider text-gray-500">Stored In</span>
        <span className="inline-flex rounded-full border border-gray-700 bg-gray-800 px-2.5 py-1 text-xs text-gray-300">
          {lead._collection || 'leads'}
        </span>
        <span className="inline-flex rounded-full border border-gray-700 bg-gray-800 px-2.5 py-1 text-xs text-gray-300">
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
    <div className="flex items-start gap-3 rounded-xl border border-gray-800/40 bg-gray-800/30 p-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-gray-500">{label}</p>
        <p className="break-words text-sm text-white">{value || EMPTY_VALUE}</p>
        {meta && meta !== EMPTY_VALUE && <p className="mt-1 break-all text-xs text-gray-500">{meta}</p>}
      </div>
    </div>
  );
}
