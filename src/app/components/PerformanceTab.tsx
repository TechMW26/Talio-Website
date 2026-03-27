import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import {
  Globe, Monitor, Smartphone, Tablet, Filter, TrendingUp, Users,
  Eye, Timer, ArrowDownRight, Percent, ChevronDown,
} from 'lucide-react';
import { getPageVisits, getVisitors, getLeads, getContacts, getSignups, type PageVisit, type VisitorProfile, type LeadEntry } from '@/lib/firebase';

// ── Helpers ──

function groupByDate(visits: PageVisit[]): { date: string; count: number }[] {
  const map: Record<string, number> = {};
  visits.forEach(v => {
    const d = v.timestamp?.slice(0, 10) || 'unknown';
    map[d] = (map[d] || 0) + 1;
  });
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));
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

function avgDuration(visits: PageVisit[]): number {
  const withDur = visits.filter(v => v.duration != null && v.duration > 0);
  if (!withDur.length) return 0;
  return Math.round(withDur.reduce((s, v) => s + (v.duration || 0), 0) / withDur.length);
}

function bounceRate(visits: PageVisit[]): number {
  // A "bounce" = session with only 1 page view
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

const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#6366f1'];

const ALL_PAGES = 'All Pages';

// ── World SVG Map ──

function WorldHeatMap({ visitors }: { visitors: VisitorProfile[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 800, h: 450 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, vx: 0, vy: 0 });

  // Group visitors by approximate lat/lon grid
  const heatPoints = useMemo(() => {
    const grid: Record<string, { lat: number; lon: number; count: number; visitors: VisitorProfile[] }> = {};
    visitors.forEach(v => {
      if (!v.lat && !v.lon) return;
      // Grid resolution depends on zoom level
      const res = Math.max(2, viewBox.w / 80);
      const gx = Math.round(v.lon / res) * res;
      const gy = Math.round(v.lat / res) * res;
      const key = `${gx},${gy}`;
      if (!grid[key]) grid[key] = { lat: gy, lon: gx, count: 0, visitors: [] };
      grid[key].count++;
      grid[key].visitors.push(v);
    });
    return Object.values(grid);
  }, [visitors, viewBox.w]);

  // Convert lat/lon to SVG coordinates (Mercator-like projection)
  const project = (lat: number, lon: number) => ({
    x: ((lon + 180) / 360) * 800,
    y: ((90 - lat) / 180) * 450,
  });

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 1.15 : 0.87;
    const svg = svgRef.current!;
    const rect = svg.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * viewBox.w + viewBox.x;
    const my = ((e.clientY - rect.top) / rect.height) * viewBox.h + viewBox.y;

    const nw = Math.min(800, Math.max(50, viewBox.w * factor));
    const nh = Math.min(450, Math.max(28, viewBox.h * factor));
    const nx = mx - (mx - viewBox.x) * (nw / viewBox.w);
    const ny = my - (my - viewBox.y) * (nh / viewBox.h);

    setViewBox({ x: nx, y: ny, w: nw, h: nh });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, vx: viewBox.x, vy: viewBox.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const svg = svgRef.current!;
    const rect = svg.getBoundingClientRect();
    const dx = (e.clientX - dragStart.current.x) / rect.width * viewBox.w;
    const dy = (e.clientY - dragStart.current.y) / rect.height * viewBox.h;
    setViewBox(prev => ({ ...prev, x: dragStart.current.vx - dx, y: dragStart.current.vy - dy }));
  };

  const handleMouseUp = () => setIsDragging(false);

  const maxCount = Math.max(1, ...heatPoints.map(p => p.count));

  return (
    <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Visitor World Map</h3>
        </div>
        <span className="text-xs text-gray-500">Scroll to zoom · Drag to pan</span>
      </div>

      <svg
        ref={svgRef}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        className="w-full rounded-xl bg-gray-950 border border-gray-800/40"
        style={{ height: 400, cursor: isDragging ? 'grabbing' : 'grab' }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Grid lines */}
        {Array.from({ length: 19 }).map((_, i) => {
          const lon = -180 + i * 20;
          const { x } = project(0, lon);
          return <line key={`vl${i}`} x1={x} y1={0} x2={x} y2={450} stroke="#1f2937" strokeWidth={0.5} />;
        })}
        {Array.from({ length: 9 }).map((_, i) => {
          const lat = -80 + i * 20;
          const { y } = project(lat, 0);
          return <line key={`hl${i}`} x1={0} y1={y} x2={800} y2={y} stroke="#1f2937" strokeWidth={0.5} />;
        })}

        {/* Continent outlines (simplified) */}
        <ellipse cx={400} cy={225} rx={380} ry={205} fill="none" stroke="#374151" strokeWidth={0.5} />

        {/* Heat points */}
        {heatPoints.map((p, i) => {
          const { x, y } = project(p.lat, p.lon);
          const intensity = p.count / maxCount;
          const r = Math.max(4, Math.min(30, intensity * 25 + 4));
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={r * 2} fill={`rgba(239, 68, 68, ${intensity * 0.15})`} />
              <circle cx={x} cy={y} r={r} fill={`rgba(239, 68, 68, ${0.3 + intensity * 0.5})`} />
              <circle cx={x} cy={y} r={r * 0.4} fill={`rgba(255, 100, 100, ${0.8 + intensity * 0.2})`} />
              <title>{`${p.visitors[0]?.city || 'Unknown'}, ${p.visitors[0]?.country || ''} — ${p.count} visitor${p.count > 1 ? 's' : ''}`}</title>
            </g>
          );
        })}
      </svg>

      {/* Country breakdown below map */}
      {heatPoints.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          {(() => {
            const countryMap: Record<string, number> = {};
            visitors.forEach(v => {
              if (!v.country) return;
              countryMap[v.country] = (countryMap[v.country] || 0) + 1;
            });
            return Object.entries(countryMap)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 8)
              .map(([country, count]) => (
                <div key={country} className="bg-gray-800/50 rounded-lg px-3 py-2 text-sm">
                  <span className="text-white font-medium">{country}</span>
                  <span className="text-gray-500 ml-2">{count}</span>
                </div>
              ));
          })()}
        </div>
      )}
    </div>
  );
}

// ── Demographics Section ──

function Demographics({ visitors }: { visitors: VisitorProfile[] }) {
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

  const deviceIcons: Record<string, typeof Monitor> = {
    Desktop: Monitor,
    Mobile: Smartphone,
    Tablet: Tablet,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Browser */}
      <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Browser</h3>
        {browserData.length === 0 ? (
          <p className="text-gray-500 text-sm">No data</p>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={browserData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {browserData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8, color: '#fff', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* OS */}
      <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Operating System</h3>
        {osData.length === 0 ? (
          <p className="text-gray-500 text-sm">No data</p>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={osData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {osData.map((_, i) => <Cell key={i} fill={CHART_COLORS[(i + 2) % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8, color: '#fff', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Device */}
      <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Device Type</h3>
        <div className="space-y-4 mt-2">
          {deviceData.length === 0 ? (
            <p className="text-gray-500 text-sm">No data</p>
          ) : (
            deviceData.map((d, i) => {
              const Icon = deviceIcons[d.name] || Monitor;
              const pct = visitors.length ? Math.round((d.value / visitors.length) * 100) : 0;
              return (
                <div key={d.name} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center`} style={{ background: `${CHART_COLORS[i]}20` }}>
                    <Icon className="w-4 h-4" style={{ color: CHART_COLORS[i] }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white">{d.name}</span>
                      <span className="text-xs text-gray-400">{d.value} ({pct}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: CHART_COLORS[i] }} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// ── Visitor Details Table ──

function VisitorDetailsTable({ visitors }: { visitors: VisitorProfile[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-800/60">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-400" />
          Visitor Details
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800/60">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">IP / Location</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Device</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Browser / OS</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Pages</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">First Seen</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Autofill</th>
            </tr>
          </thead>
          <tbody>
            {visitors.slice(0, 50).map((v, i) => {
              const isExpanded = expanded === (v.id || String(i));
              return (
                <tr
                  key={v.id || i}
                  onClick={() => setExpanded(isExpanded ? null : (v.id || String(i)))}
                  className="border-b border-gray-800/40 hover:bg-gray-800/30 transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3">
                    <div className="text-white font-mono text-xs">{v.ip || '—'}</div>
                    <div className="text-gray-500 text-xs">{v.city}{v.city && v.country ? ', ' : ''}{v.country}</div>
                  </td>
                  <td className="px-5 py-3 text-gray-300">{v.device}</td>
                  <td className="px-5 py-3">
                    <span className="text-gray-300">{v.browser}</span>
                    <span className="text-gray-600 mx-1">/</span>
                    <span className="text-gray-400">{v.os}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-300">{v.pageViews || 0}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs">
                    {v.firstSeen ? new Date(v.firstSeen).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                  <td className="px-5 py-3">
                    {v.autoEmail || v.autoName || v.autoPhone ? (
                      <div className="text-xs">
                        {v.autoName && <div className="text-emerald-400">{v.autoName}</div>}
                        {v.autoEmail && <div className="text-blue-400">{v.autoEmail}</div>}
                        {v.autoPhone && <div className="text-purple-400">{v.autoPhone}</div>}
                        {isExpanded && v.autoAddress && <div className="text-gray-400 mt-1">{v.autoAddress}</div>}
                      </div>
                    ) : (
                      <span className="text-gray-600 text-xs">—</span>
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
  const [visits, setVisits] = useState<PageVisit[]>([]);
  const [visitors, setVisitors] = useState<VisitorProfile[]>([]);
  const [leads, setLeads] = useState<LeadEntry[]>([]);
  const [allLeads, setAllLeads] = useState<LeadEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageFilter, setPageFilter] = useState(ALL_PAGES);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [v, vis, l, c, s] = await Promise.all([
          getPageVisits(), getVisitors(), getLeads(), getContacts(), getSignups(),
        ]);
        setVisits(v);
        setVisitors(vis);
        setLeads(l);
        setAllLeads([...l, ...c, ...s]);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      }
      setLoading(false);
    })();
  }, []);

  const filteredVisits = useMemo(() => {
    if (pageFilter === ALL_PAGES) return visits;
    return visits.filter(v => v.page === pageFilter);
  }, [visits, pageFilter]);

  const pages = useMemo(() => {
    const set = new Set(visits.map(v => v.page));
    return [ALL_PAGES, ...Array.from(set).sort()];
  }, [visits]);

  const trafficData = useMemo(() => groupByDate(filteredVisits), [filteredVisits]);
  const pageData = useMemo(() => groupByPage(filteredVisits).slice(0, 10), [filteredVisits]);
  const avgTime = useMemo(() => avgDuration(filteredVisits), [filteredVisits]);
  const bounce = useMemo(() => bounceRate(filteredVisits), [filteredVisits]);
  const conversion = useMemo(() => conversionRate(visitors, leads), [visitors, leads]);
  const uniqueSessions = useMemo(() => new Set(filteredVisits.map(v => v.sessionId)).size, [filteredVisits]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Filter */}
      <div className="relative inline-block">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl transition text-white"
        >
          <Filter className="w-4 h-4 text-gray-400" />
          {pageFilter}
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>
        {showFilter && (
          <div className="absolute z-40 top-full mt-2 left-0 bg-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden max-h-72 overflow-y-auto min-w-[200px]">
            {pages.map(p => (
              <button
                key={p}
                onClick={() => { setPageFilter(p); setShowFilter(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-800 transition ${
                  p === pageFilter ? 'text-blue-400 bg-gray-800/50' : 'text-gray-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Visits', value: filteredVisits.length, icon: Eye, color: 'blue' },
          { label: 'Unique Sessions', value: uniqueSessions, icon: Users, color: 'purple' },
          { label: 'Avg. Duration', value: `${avgTime}s`, icon: Timer, color: 'emerald' },
          { label: 'Bounce Rate', value: `${bounce}%`, icon: ArrowDownRight, color: 'amber' },
          { label: 'Conversion Rate', value: `${conversion}%`, icon: Percent, color: 'rose' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              whileHover={{ y: -2 }}
              className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-5"
            >
              <div className={`w-9 h-9 rounded-xl bg-${s.color}-500/10 flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 text-${s.color}-400`} />
              </div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Traffic chart */}
      <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Traffic Over Time</h3>
        </div>
        {trafficData.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No traffic data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trafficData}>
              <defs>
                <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 11 }} tickFormatter={d => d.slice(5)} />
              <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8, color: '#fff', fontSize: 12 }} />
              <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="url(#trafficGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Page visits bar chart */}
      <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Top Pages</h3>
        </div>
        {pageData.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No page data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pageData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis type="number" stroke="#6b7280" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="page" stroke="#6b7280" tick={{ fontSize: 11 }} width={150} />
              <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8, color: '#fff', fontSize: 12 }} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* World Heatmap */}
      <WorldHeatMap visitors={visitors} />

      {/* Demographics */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Demographics</h3>
        <Demographics visitors={visitors} />
      </div>

      {/* Visitor Details */}
      <VisitorDetailsTable visitors={visitors} />
    </div>
  );
}
