import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import {
  Globe, Monitor, Smartphone, Tablet, TrendingUp, Users,
  Eye, Timer, ArrowDownRight, Percent, ChevronDown, Calendar,
  MapPin, Activity, MousePointerClick, Clock, ArrowUp, ArrowDown,
  Minus,
} from 'lucide-react';
import { getPageVisits, getVisitors, getLeads, type PageVisit, type VisitorProfile, type LeadEntry } from '@/lib/firebase';
import { DatePicker } from '@/app/components/ui/date-picker';

// ── Shared style ──

const panelClassName =
  'rounded-[28px] border border-white/10 bg-[#0b1323]/80 shadow-[0_24px_80px_rgba(2,8,23,0.55)] backdrop-blur-xl';

const tooltipStyle = {
  background: '#0d1526',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 16,
  color: '#fff',
  fontSize: 12,
  boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
};

const CHART_COLORS = ['#22d3ee', '#818cf8', '#34d399', '#f59e0b', '#f43f5e', '#3b82f6', '#ec4899', '#a78bfa'];

// ── Date helpers ──

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function formatDateShort(d: string) {
  const date = new Date(d + 'T00:00:00');
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function formatDateFull(d: string) {
  const date = new Date(d + 'T00:00:00');
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── Data helpers ──

type TimeBucket = 'hour' | 'day' | 'month';

function detectBucket(range: { from: string; to: string } | null): TimeBucket {
  if (!range) return 'month';
  const from = new Date(range.from + 'T00:00:00');
  const to = new Date(range.to + 'T00:00:00');
  const days = Math.round((to.getTime() - from.getTime()) / 86400000);
  if (days <= 0) return 'hour';   // single day → 24-hour view
  if (days <= 90) return 'day';   // up to ~3 months → daily
  return 'month';                 // longer → monthly
}

function groupByTimeBucket(visits: PageVisit[], bucket: TimeBucket): { label: string; count: number }[] {
  const map: Record<string, number> = {};

  if (bucket === 'hour') {
    // Pre-fill all 24 hours
    for (let i = 0; i < 24; i++) map[String(i).padStart(2, '0')] = 0;
    visits.forEach(v => {
      const h = v.timestamp?.slice(11, 13);
      if (h) map[h] = (map[h] || 0) + 1;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([h, count]) => ({ label: `${h}:00`, count }));
  }

  if (bucket === 'day') {
    visits.forEach(v => {
      const d = v.timestamp?.slice(0, 10) || 'unknown';
      map[d] = (map[d] || 0) + 1;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ label: date, count }));
  }

  // month bucket
  visits.forEach(v => {
    const m = v.timestamp?.slice(0, 7); // YYYY-MM
    if (m) map[m] = (map[m] || 0) + 1;
  });
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([m, count]) => ({ label: m, count }));
}

function formatBucketLabel(label: string, bucket: TimeBucket): string {
  if (bucket === 'hour') return label; // "09:00"
  if (bucket === 'day') return formatDateShort(label);
  // month: "2026-03" → "Mar 2026"
  const d = new Date(label + '-01T00:00:00');
  return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}

function formatBucketTooltip(label: string, bucket: TimeBucket): string {
  if (bucket === 'hour') return label;
  if (bucket === 'day') return formatDateFull(label);
  const d = new Date(label + '-01T00:00:00');
  return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

function groupByPage(visits: PageVisit[]): { page: string; count: number }[] {
  const map: Record<string, number> = {};
  visits.forEach(v => {
    map[v.page] = (map[v.page] || 0) + 1;
  });
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([page, count]) => ({ page, count }));
}

function groupByHour(visits: PageVisit[]): { hour: string; count: number }[] {
  const map: Record<string, number> = {};
  for (let i = 0; i < 24; i++) map[String(i).padStart(2, '0')] = 0;
  visits.forEach(v => {
    const h = v.timestamp?.slice(11, 13);
    if (h) map[h] = (map[h] || 0) + 1;
  });
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([hour, count]) => ({ hour: `${hour}:00`, count }));
}

function avgDuration(visits: PageVisit[]): number {
  const withDur = visits.filter(v => v.duration != null && v.duration > 0);
  if (!withDur.length) return 0;
  return Math.round(withDur.reduce((s, v) => s + (v.duration || 0), 0) / withDur.length);
}

function bounceRate(visits: PageVisit[]): number {
  const sessPages: Record<string, Set<string>> = {};
  visits.forEach(v => {
    if (!sessPages[v.sessionId]) sessPages[v.sessionId] = new Set();
    sessPages[v.sessionId].add(v.page);
  });
  const sessions = Object.values(sessPages);
  if (!sessions.length) return 0;
  const bounces = sessions.filter(s => s.size === 1).length;
  return Math.round((bounces / sessions.length) * 100);
}

function conversionRate(visitors: VisitorProfile[], leads: LeadEntry[]): number {
  if (!visitors.length) return 0;
  return Math.round((leads.length / visitors.length) * 100 * 10) / 10;
}

function pctChange(current: number, previous: number): { value: number; direction: 'up' | 'down' | 'neutral' } {
  if (previous === 0 && current === 0) return { value: 0, direction: 'neutral' };
  if (previous === 0) return { value: 100, direction: 'up' };
  const pct = Math.round(((current - previous) / previous) * 100);
  return { value: Math.abs(pct), direction: pct > 0 ? 'up' : pct < 0 ? 'down' : 'neutral' };
}

// Date range presets
type DatePreset = 'today' | '7d' | '30d' | '90d' | 'all';
const DATE_PRESETS: { key: DatePreset; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: '7d', label: '7 Days' },
  { key: '30d', label: '30 Days' },
  { key: '90d', label: '90 Days' },
  { key: 'all', label: 'All Time' },
];

function getDateRangeForPreset(preset: DatePreset): { from: string; to: string } | null {
  const to = todayStr();
  switch (preset) {
    case 'today': return { from: to, to };
    case '7d': return { from: daysAgo(6), to };
    case '30d': return { from: daysAgo(29), to };
    case '90d': return { from: daysAgo(89), to };
    case 'all': return null;
  }
}

function getPreviousDateRange(from: string, to: string): { from: string; to: string } {
  const fromDate = new Date(from + 'T00:00:00');
  const toDate = new Date(to + 'T00:00:00');
  const days = Math.round((toDate.getTime() - fromDate.getTime()) / 86400000) + 1;
  const prevTo = new Date(fromDate);
  prevTo.setDate(prevTo.getDate() - 1);
  const prevFrom = new Date(prevTo);
  prevFrom.setDate(prevFrom.getDate() - days + 1);
  return { from: prevFrom.toISOString().slice(0, 10), to: prevTo.toISOString().slice(0, 10) };
}

function filterByDateRange(visits: PageVisit[], range: { from: string; to: string } | null): PageVisit[] {
  if (!range) return visits;
  return visits.filter(v => {
    const d = v.timestamp?.slice(0, 10);
    return d && d >= range.from && d <= range.to;
  });
}

function filterVisitorsByDateRange(visitors: VisitorProfile[], range: { from: string; to: string } | null): VisitorProfile[] {
  if (!range) return visitors;
  return visitors.filter(v => {
    const d = v.firstSeen?.slice(0, 10) || v.lastSeen?.slice(0, 10);
    return d && d >= range.from && d <= range.to;
  });
}

function filterLeadsByDateRange(leads: LeadEntry[], range: { from: string; to: string } | null): LeadEntry[] {
  if (!range) return leads;
  return leads.filter(l => {
    const d = l.submittedAt?.slice(0, 10);
    return d && d >= range.from && d <= range.to;
  });
}

function compactN(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

// ── Stat card ──

function StatCard({ label, value, icon: Icon, color, change }: {
  label: string;
  value: string | number;
  icon: typeof Eye;
  color: string;
  change?: { value: number; direction: 'up' | 'down' | 'neutral' };
}) {
  const ChangeIcon = change?.direction === 'up' ? ArrowUp : change?.direction === 'down' ? ArrowDown : Minus;
  const changeColor = change?.direction === 'up' ? 'text-emerald-400' : change?.direction === 'down' ? 'text-red-400' : 'text-slate-500';

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`${panelClassName} relative overflow-hidden p-5`}
    >
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-${color}-500/10`}>
          <Icon className={`h-5 w-5 text-${color}-400`} />
        </div>
        {change && change.value > 0 && (
          <div className={`flex items-center gap-0.5 text-xs font-medium ${changeColor}`}>
            <ChangeIcon className="h-3 w-3" />
            {change.value}%
          </div>
        )}
      </div>
      <p className="mt-3 text-2xl font-bold text-white tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </motion.div>
  );
}

// ── Top Countries ──

function TopCountries({ visitors }: { visitors: VisitorProfile[] }) {
  const data = useMemo(() => {
    const map: Record<string, { count: number; country: string }> = {};
    visitors.forEach(v => {
      if (!v.country) return;
      if (!map[v.country]) map[v.country] = { count: 0, country: v.country };
      map[v.country].count++;
    });
    return Object.values(map).sort((a, b) => b.count - a.count).slice(0, 10);
  }, [visitors]);

  const total = visitors.length || 1;
  if (data.length === 0) return <p className="text-sm text-slate-500 py-6 text-center">No visitor location data</p>;

  return (
    <div className="space-y-3">
      {data.map((d, i) => {
        const pct = Math.round((d.count / total) * 100);
        return (
          <div key={d.country} className="flex items-center gap-3">
            <span className="w-5 text-xs text-slate-500 font-mono text-right">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-white truncate">{d.country}</span>
                <span className="text-xs text-slate-400 ml-2 shrink-0">{d.count} ({pct}%)</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Top Cities ──

function TopCities({ visitors }: { visitors: VisitorProfile[] }) {
  const data = useMemo(() => {
    const map: Record<string, number> = {};
    visitors.forEach(v => {
      const key = v.city ? `${v.city}, ${v.country}` : v.country || 'Unknown';
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [visitors]);

  if (data.length === 0) return <p className="text-sm text-slate-500 py-6 text-center">No city data</p>;

  return (
    <div className="space-y-2.5">
      {data.map(([city, count]) => (
        <div key={city} className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
            <span className="text-sm text-slate-300 truncate">{city}</span>
          </div>
          <span className="text-sm font-medium text-white ml-2 shrink-0">{count}</span>
        </div>
      ))}
    </div>
  );
}

// ── Referrers ──

function TopReferrers({ visits }: { visits: PageVisit[] }) {
  const data = useMemo(() => {
    const map: Record<string, number> = {};
    visits.forEach(v => {
      let ref = v.referrer || 'Direct';
      if (ref === '' || ref === 'none') ref = 'Direct';
      try {
        if (ref.startsWith('http')) ref = new URL(ref).hostname;
      } catch { /* keep as-is */ }
      map[ref] = (map[ref] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [visits]);

  const total = visits.length || 1;
  if (data.length === 0) return <p className="text-sm text-slate-500 py-6 text-center">No referrer data</p>;

  return (
    <div className="space-y-2.5">
      {data.map(([ref, count]) => (
        <div key={ref} className="flex items-center justify-between py-1">
          <span className="text-sm text-slate-300 truncate min-w-0">{ref}</span>
          <div className="flex items-center gap-2 ml-2 shrink-0">
            <span className="text-xs text-slate-500">{Math.round(count / total * 100)}%</span>
            <span className="text-sm font-medium text-white">{count}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Session Depth ──

function SessionDepth({ visits }: { visits: PageVisit[] }) {
  const data = useMemo(() => {
    const sessPages: Record<string, number> = {};
    visits.forEach(v => { sessPages[v.sessionId] = (sessPages[v.sessionId] || 0) + 1; });
    const buckets: Record<string, number> = { '1 page': 0, '2 pages': 0, '3 pages': 0, '4 pages': 0, '5+ pages': 0 };
    Object.values(sessPages).forEach(n => {
      if (n >= 5) buckets['5+ pages']++;
      else buckets[`${n} page${n > 1 ? 's' : ''}`]++;
    });
    return Object.entries(buckets).map(([name, value]) => ({ name, value }));
  }, [visits]);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="name" stroke="#475569" tick={{ fontSize: 11 }} />
        <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="value" fill="#818cf8" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Donut pie ──

function DemoPie({ data }: { data: { name: string; value: number }[] }) {
  if (data.length === 0) return <p className="text-sm text-slate-500 py-12 text-center">No data</p>;
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div>
      <ResponsiveContainer width="100%" height={190}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={48} outerRadius={75} paddingAngle={2} strokeWidth={0}>
            {data.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-3 space-y-1.5">
        {data.slice(0, 5).map((d, i) => (
          <div key={d.name} className="flex items-center gap-2 text-xs">
            <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
            <span className="text-slate-400 truncate flex-1">{d.name}</span>
            <span className="text-white font-medium">{Math.round((d.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Visitor Details Table ──

function VisitorDetailsTable({ visitors }: { visitors: VisitorProfile[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className={`${panelClassName} overflow-hidden`}>
      <div className="px-6 py-5 border-b border-white/10 flex items-center gap-2">
        <Users className="w-5 h-5 text-violet-400" />
        <h3 className="text-base font-semibold text-white">Recent Visitors</h3>
        <span className="text-xs text-slate-500 ml-auto">{visitors.length} total</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">IP / Location</th>
              <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Device</th>
              <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Browser / OS</th>
              <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Pages</th>
              <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">First Seen</th>
              <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Autofill</th>
            </tr>
          </thead>
          <tbody>
            {visitors.slice(0, 50).map((v, i) => {
              const isExpanded = expanded === (v.id || String(i));
              const DeviceIcon = v.device === 'Mobile' ? Smartphone : v.device === 'Tablet' ? Tablet : Monitor;
              return (
                <tr
                  key={v.id || i}
                  onClick={() => setExpanded(isExpanded ? null : (v.id || String(i)))}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3">
                    <div className="text-white font-mono text-xs">{v.ip || '—'}</div>
                    <div className="text-slate-500 text-xs">{v.city}{v.city && v.country ? ', ' : ''}{v.country}</div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 text-slate-300">
                      <DeviceIcon className="h-3.5 w-3.5 text-slate-500" />
                      {v.device}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-slate-300">{v.browser}</span>
                    <span className="text-slate-600 mx-1">/</span>
                    <span className="text-slate-400">{v.os}</span>
                  </td>
                  <td className="px-5 py-3 text-slate-300">{v.pageViews || 0}</td>
                  <td className="px-5 py-3 text-slate-500 text-xs">
                    {v.firstSeen ? new Date(v.firstSeen).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                  <td className="px-5 py-3">
                    {v.autoEmail || v.autoName || v.autoPhone ? (
                      <div className="text-xs">
                        {v.autoName && <div className="text-emerald-400">{v.autoName}</div>}
                        {v.autoEmail && <div className="text-cyan-400">{v.autoEmail}</div>}
                        {v.autoPhone && <div className="text-violet-400">{v.autoPhone}</div>}
                        {isExpanded && v.autoAddress && <div className="text-slate-400 mt-1">{v.autoAddress}</div>}
                      </div>
                    ) : (
                      <span className="text-slate-600 text-xs">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main Performance Tab ──

export function PerformanceTab() {
  const [allVisits, setAllVisits] = useState<PageVisit[]>([]);
  const [allVisitors, setAllVisitors] = useState<VisitorProfile[]>([]);
  const [allLeads, setAllLeads] = useState<LeadEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [datePreset, setDatePreset] = useState<DatePreset>('today');
  const [customFrom, setCustomFrom] = useState(todayStr());
  const [customTo, setCustomTo] = useState(todayStr());
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [pageFilter, setPageFilter] = useState('All Pages');
  const [showPageDropdown, setShowPageDropdown] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [v, vis, l] = await Promise.all([getPageVisits(), getVisitors(), getLeads()]);
        setAllVisits(v);
        setAllVisitors(vis);
        setAllLeads(l);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      }
      setLoading(false);
    })();
  }, []);

  const dateRange = useMemo(() => {
    if (showCustomDate) return { from: customFrom, to: customTo };
    return getDateRangeForPreset(datePreset);
  }, [datePreset, showCustomDate, customFrom, customTo]);

  const prevRange = useMemo(() => {
    if (!dateRange) return null;
    return getPreviousDateRange(dateRange.from, dateRange.to);
  }, [dateRange]);

  const visits = useMemo(() => {
    let v = filterByDateRange(allVisits, dateRange);
    if (pageFilter !== 'All Pages') v = v.filter(x => x.page === pageFilter);
    return v;
  }, [allVisits, dateRange, pageFilter]);

  const prevVisits = useMemo(() => {
    if (!prevRange) return [];
    let v = filterByDateRange(allVisits, prevRange);
    if (pageFilter !== 'All Pages') v = v.filter(x => x.page === pageFilter);
    return v;
  }, [allVisits, prevRange, pageFilter]);

  const visitors = useMemo(() => filterVisitorsByDateRange(allVisitors, dateRange), [allVisitors, dateRange]);
  const prevVisitors = useMemo(() => !prevRange ? [] : filterVisitorsByDateRange(allVisitors, prevRange), [allVisitors, prevRange]);
  const leads = useMemo(() => filterLeadsByDateRange(allLeads, dateRange), [allLeads, dateRange]);
  const prevLeads = useMemo(() => !prevRange ? [] : filterLeadsByDateRange(allLeads, prevRange), [allLeads, prevRange]);

  const pages = useMemo(() => {
    const set = new Set(allVisits.map(v => v.page));
    return ['All Pages', ...Array.from(set).sort()];
  }, [allVisits]);

  const totalVisits = visits.length;
  const uniqueSessions = new Set(visits.map(v => v.sessionId)).size;
  const avgTime = avgDuration(visits);
  const bounce = bounceRate(visits);
  const conversion = conversionRate(visitors, leads);
  const avgPagesPerSession = uniqueSessions === 0 ? 0 : Math.round((totalVisits / uniqueSessions) * 10) / 10;

  const prevTotalVisits = prevVisits.length;
  const prevUniqueSessions = new Set(prevVisits.map(v => v.sessionId)).size;
  const prevAvgTime = avgDuration(prevVisits);
  const prevBounce = bounceRate(prevVisits);
  const prevConversion = conversionRate(prevVisitors, prevLeads);

  const timeBucket = useMemo(() => detectBucket(dateRange), [dateRange]);
  const trafficData = useMemo(() => groupByTimeBucket(visits, timeBucket), [visits, timeBucket]);
  const hourlyData = useMemo(() => groupByHour(visits), [visits]);
  const pageData = useMemo(() => groupByPage(visits).slice(0, 10), [visits]);

  const browserData = useMemo(() => {
    const map: Record<string, number> = {};
    visitors.forEach(v => { map[v.browser] = (map[v.browser] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [visitors]);

  const osData = useMemo(() => {
    const map: Record<string, number> = {};
    visitors.forEach(v => { map[v.os] = (map[v.os] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [visitors]);

  const deviceData = useMemo(() => {
    const map: Record<string, number> = {};
    visitors.forEach(v => { map[v.device] = (map[v.device] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [visitors]);

  const dateLabel = useMemo(() => {
    if (showCustomDate) return `${formatDateFull(customFrom)} — ${formatDateFull(customTo)}`;
    if (!dateRange) return 'All Time';
    if (dateRange.from === dateRange.to) return formatDateFull(dateRange.from);
    return `${formatDateShort(dateRange.from)} — ${formatDateShort(dateRange.to)}`;
  }, [dateRange, showCustomDate, customFrom, customTo]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 w-full">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full" />
          <p className="text-sm text-slate-500">Loading analytics…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* ── Filters Bar ── */}
      <div className={`${panelClassName} relative z-50 px-5 py-4`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <Calendar className="h-4 w-4 text-slate-500 shrink-0" />
            {DATE_PRESETS.map(p => (
              <button
                key={p.key}
                onClick={() => { setDatePreset(p.key); setShowCustomDate(false); }}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all ${
                  !showCustomDate && datePreset === p.key
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                {p.label}
              </button>
            ))}
            <div className="h-4 w-px bg-white/10 mx-1" />
            <button
              onClick={() => setShowCustomDate(!showCustomDate)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all ${
                showCustomDate
                  ? 'bg-violet-500/15 text-violet-300 border border-violet-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              Custom Range
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowPageDropdown(!showPageDropdown)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-2xl border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06] transition"
            >
              <Eye className="h-3.5 w-3.5 text-slate-500" />
              {pageFilter}
              <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
            </button>
            {showPageDropdown && (
              <div className="absolute z-[100] top-full mt-2 right-0 bg-[#0b1323] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto min-w-[220px]">
                {pages.map(p => (
                  <button
                    key={p}
                    onClick={() => { setPageFilter(p); setShowPageDropdown(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs hover:bg-white/[0.04] transition ${
                      p === pageFilter ? 'text-cyan-400 bg-white/[0.04]' : 'text-slate-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showCustomDate && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-3 pt-4 mt-4 border-t border-white/5">
                <label className="text-xs text-slate-500">From</label>
                <DatePicker
                  value={customFrom}
                  onChange={setCustomFrom}
                  placeholder="Start date"
                />
                <label className="text-xs text-slate-500">To</label>
                <DatePicker
                  value={customTo}
                  onChange={setCustomTo}
                  placeholder="End date"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Total Visits" value={compactN(totalVisits)} icon={Eye} color="cyan" change={pctChange(totalVisits, prevTotalVisits)} />
        <StatCard label="Unique Sessions" value={compactN(uniqueSessions)} icon={Activity} color="blue" change={pctChange(uniqueSessions, prevUniqueSessions)} />
        <StatCard label="Avg. Duration" value={`${avgTime}s`} icon={Timer} color="emerald" change={pctChange(avgTime, prevAvgTime)} />
        <StatCard label="Bounce Rate" value={`${bounce}%`} icon={ArrowDownRight} color="amber" change={pctChange(bounce, prevBounce)} />
        <StatCard label="Conversion Rate" value={`${conversion}%`} icon={Percent} color="rose" change={pctChange(conversion, prevConversion)} />
        <StatCard label="Pages / Session" value={avgPagesPerSession} icon={MousePointerClick} color="violet" />
      </div>

      {/* ── Traffic Over Time ── */}
      <div className={`${panelClassName} p-6`}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-cyan-400" />
            <h3 className="text-base font-semibold text-white">Traffic Over Time</h3>
          </div>
          <span className="text-xs text-slate-500">{dateLabel}</span>
        </div>
        {trafficData.length === 0 ? (
          <p className="text-slate-500 text-center py-16 text-sm">No traffic data for this period</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trafficData}>
              <defs>
                <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="label" stroke="#475569" tick={{ fontSize: 11 }} tickFormatter={d => formatBucketLabel(d, timeBucket)} interval={timeBucket === 'hour' ? 2 : undefined} />
              <YAxis stroke="#475569" tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} labelFormatter={d => formatBucketTooltip(d, timeBucket)} />
              <Area type="monotone" dataKey="count" name="Visits" stroke="#22d3ee" fill="url(#trafficGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── Hourly Activity + Top Pages ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className={`${panelClassName} p-6`}>
          <div className="flex items-center gap-2 mb-5">
            <Clock className="h-5 w-5 text-violet-400" />
            <h3 className="text-base font-semibold text-white">Hourly Activity</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" stroke="#475569" tick={{ fontSize: 10 }} interval={2} />
              <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" name="Visits" fill="#818cf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={`${panelClassName} p-6`}>
          <div className="flex items-center gap-2 mb-5">
            <Eye className="h-5 w-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-white">Top Pages</h3>
          </div>
          {pageData.length === 0 ? (
            <p className="text-slate-500 text-center py-16 text-sm">No page data</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={pageData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" stroke="#475569" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="page" stroke="#475569" tick={{ fontSize: 11 }} width={130} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" name="Visits" fill="#34d399" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Session Depth + Referrers ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className={`${panelClassName} p-6`}>
          <div className="flex items-center gap-2 mb-5">
            <Activity className="h-5 w-5 text-amber-400" />
            <h3 className="text-base font-semibold text-white">Session Depth</h3>
          </div>
          <SessionDepth visits={visits} />
        </div>

        <div className={`${panelClassName} p-6`}>
          <div className="flex items-center gap-2 mb-5">
            <Globe className="h-5 w-5 text-blue-400" />
            <h3 className="text-base font-semibold text-white">Traffic Sources</h3>
          </div>
          <TopReferrers visits={visits} />
        </div>
      </div>

      {/* ── Geography: Countries + Cities ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className={`${panelClassName} p-6`}>
          <div className="flex items-center gap-2 mb-5">
            <Globe className="h-5 w-5 text-cyan-400" />
            <h3 className="text-base font-semibold text-white">Top Countries</h3>
          </div>
          <TopCountries visitors={visitors} />
        </div>

        <div className={`${panelClassName} p-6`}>
          <div className="flex items-center gap-2 mb-5">
            <MapPin className="h-5 w-5 text-rose-400" />
            <h3 className="text-base font-semibold text-white">Top Cities</h3>
          </div>
          <TopCities visitors={visitors} />
        </div>
      </div>

      {/* ── Demographics: Device / Browser / OS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`${panelClassName} p-6`}>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 mb-4">Device Type</h3>
          <DemoPie data={deviceData} />
        </div>
        <div className={`${panelClassName} p-6`}>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 mb-4">Browser</h3>
          <DemoPie data={browserData} />
        </div>
        <div className={`${panelClassName} p-6`}>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 mb-4">Operating System</h3>
          <DemoPie data={osData} />
        </div>
      </div>

      {/* ── Visitor Details ── */}
      <VisitorDetailsTable visitors={visitors} />
    </div>
  );
}
