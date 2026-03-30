import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Users, Mail, UserPlus, RefreshCw, Search, Download, BarChart3, X, Trash2, Phone, Building2, Briefcase, Factory, MessageSquare } from 'lucide-react';
import { getLeads, getContacts, getSignups, deleteEntry, type LeadEntry } from '@/lib/firebase';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import { PerformanceTab } from '@/app/components/PerformanceTab';

const ADMIN_EMAIL = 'avi2001raj@gmail.com';
const ADMIN_PASS_HASH = 'ba0353bdb0d7ff4735f7d1284e2d8f614ef193c8a12180e30a5a7f7735bd98c2';

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

type Tab = 'leads' | 'contacts' | 'signups' | 'performance';

export function AdminDashboard() {
  usePageMeta('Admin Dashboard', 'Talio admin dashboard — view and manage leads, contacts, and signups.');

  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [logging, setLogging] = useState(false);

  const [tab, setTab] = useState<Tab>('leads');
  const [leads, setLeads] = useState<LeadEntry[]>([]);
  const [contacts, setContacts] = useState<LeadEntry[]>([]);
  const [signups, setSignups] = useState<LeadEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<LeadEntry | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem('talio_admin') === 'true') setAuthed(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
      const [l, c, s] = await Promise.all([getLeads(), getContacts(), getSignups()]);
      setLeads(l.reverse());
      setContacts(c.reverse());
      setSignups(s.reverse());
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authed) fetchData();
  }, [authed]);

  const dataTabData: Record<Exclude<Tab, 'performance'>, { label: string; icon: typeof Users; data: LeadEntry[]; color: string }> = {
    leads: { label: 'Leads', icon: Users, data: leads, color: 'blue' },
    contacts: { label: 'Contacts', icon: Mail, data: contacts, color: 'purple' },
    signups: { label: 'Sign-ups', icon: UserPlus, data: signups, color: 'emerald' },
  };

  const isDataTab = tab !== 'performance';
  const currentTabData = isDataTab ? dataTabData[tab as Exclude<Tab, 'performance'>] : null;

  const filtered = (currentTabData?.data ?? []).filter(item => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      item.firstName?.toLowerCase().includes(q) ||
      item.lastName?.toLowerCase().includes(q) ||
      item.email?.toLowerCase().includes(q) ||
      item.companyName?.toLowerCase().includes(q) ||
      item.company?.toLowerCase().includes(q) ||
      item.source?.toLowerCase().includes(q)
    );
  });

  const exportCSV = () => {
    if (!currentTabData) return;
    const data = currentTabData.data;
    if (!data.length) return;
    const keys = Array.from(new Set(data.flatMap(Object.keys))).filter(k => k !== 'id');
    const header = keys.join(',');
    const rows = data.map(row => keys.map(k => `"${String((row as Record<string, unknown>)[k] ?? '').replace(/"/g, '""')}"`).join(','));
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `talio-${tab}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (item: LeadEntry) => {
    if (!item.id) return;
    const collection = tab as 'leads' | 'contacts' | 'signups';
    setDeleting(item.id);
    try {
      await deleteEntry(collection, item.id);
      if (collection === 'leads') setLeads(prev => prev.filter(l => l.id !== item.id));
      if (collection === 'contacts') setContacts(prev => prev.filter(c => c.id !== item.id));
      if (collection === 'signups') setSignups(prev => prev.filter(s => s.id !== item.id));
      if (selectedItem?.id === item.id) setSelectedItem(null);
    } catch (err) {
      console.error('Delete failed:', err);
    }
    setDeleting(null);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  // ── Login Screen ──
  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-gray-900/80 border border-gray-800/60 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400 text-sm mt-1">Sign in to view leads and contacts</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
              {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
              <button
                type="submit"
                disabled={logging}
                className="w-full rounded-full bg-white px-8 py-4 text-base font-semibold text-black transition hover:bg-gray-100 hover:shadow-lg hover:shadow-white/10 disabled:opacity-60"
              >
                {logging ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Dashboard ──
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top bar */}
      <div className="border-b border-gray-800/60 bg-gray-900/40 backdrop-blur-sm sticky top-0 z-30">
        <div className="w-full px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-800 hover:bg-red-900/50 border border-gray-700 hover:border-red-800 rounded-lg transition text-gray-300 hover:text-red-300"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="w-full px-8 py-8">
        {/* Tab Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          {([
            ...Object.entries(dataTabData).map(([key, val]) => ({ key: key as Tab, label: val.label, icon: val.icon, color: val.color, count: val.data.length })),
            { key: 'performance' as Tab, label: 'Performance', icon: BarChart3, color: 'cyan', count: null },
          ]).map(({ key, label, icon: Icon, color, count }) => (
              <motion.div
                key={key}
                whileHover={{ y: -2 }}
                onClick={() => setTab(key)}
                className={`cursor-pointer p-6 rounded-2xl border transition-all ${
                  tab === key
                    ? 'bg-gray-800/80 border-gray-600'
                    : 'bg-gray-900/60 border-gray-800/60 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 text-${color}-400`} />
                  </div>
                  {count !== null && <span className="text-3xl font-bold text-white">{count}</span>}
                </div>
                <p className="text-sm text-gray-400">{label}</p>
              </motion.div>
          ))}
        </div>

        {/* Performance Tab */}
        {tab === 'performance' && <PerformanceTab />}

        {/* Data Tabs (Leads / Contacts / Signups) */}
        {isDataTab && (
        <>
        {/* Toolbar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name, email, company..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition"
            />
          </div>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 text-sm bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl transition"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="w-6 h-6 animate-spin text-gray-500" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No {currentTabData?.label.toLowerCase() ?? 'entries'} found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800/60">
                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone</th>
                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {tab === 'contacts' ? 'Subject' : 'Company'}
                    </th>
                    {tab === 'leads' && (
                      <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Job Title</th>
                    )}
                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Source</th>
                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="text-right px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map((item, i) => (
                      <motion.tr
                        key={item.id || i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedItem(item)}
                        className="border-b border-gray-800/40 hover:bg-gray-800/30 transition-colors cursor-pointer"
                      >
                        <td className="px-5 py-4 font-medium text-white whitespace-nowrap">
                          {item.firstName} {item.lastName}
                        </td>
                        <td className="px-5 py-4 text-gray-300">{item.email}</td>
                        <td className="px-5 py-4 text-gray-400">{item.phone || '—'}</td>
                        <td className="px-5 py-4 text-gray-400">
                          {tab === 'contacts' ? (item.subject || '—') : (item.companyName || item.company || '—')}
                        </td>
                        {tab === 'leads' && (
                          <td className="px-5 py-4 text-gray-400">{item.jobTitle || '—'}</td>
                        )}
                        <td className="px-5 py-4">
                          <span className="px-2.5 py-1 text-xs rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                            {item.source}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{formatDate(item.submittedAt)}</td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(item); }}
                            disabled={deleting === item.id}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-900/20 transition-colors disabled:opacity-40"
                            title="Delete"
                          >
                            {deleting === item.id ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Popup Modal */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl"
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-gray-900 border-b border-gray-800/60 px-6 py-4 flex items-center justify-between z-10">
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedItem.firstName} {selectedItem.lastName}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{formatDate(selectedItem.submittedAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { handleDelete(selectedItem); }}
                      disabled={deleting === selectedItem.id}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="px-6 py-5 space-y-4">
                  {/* Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <DetailField icon={Mail} label="Email" value={selectedItem.email} />
                    <DetailField icon={Phone} label="Phone" value={selectedItem.phone} />
                  </div>

                  {/* Company Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <DetailField icon={Building2} label="Company" value={selectedItem.companyName || selectedItem.company} />
                    <DetailField icon={Users} label="Company Size" value={selectedItem.companySize} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <DetailField icon={Briefcase} label="Job Title" value={selectedItem.jobTitle} />
                    <DetailField icon={Factory} label="Industry" value={selectedItem.industry} />
                  </div>

                  {/* Source */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Source</span>
                    <span className="px-2.5 py-1 text-xs rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                      {selectedItem.source}
                    </span>
                  </div>

                  {/* Subject + Message (contacts) */}
                  {selectedItem.subject && (
                    <div className="pt-2 border-t border-gray-800/60">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Subject</p>
                      <p className="text-sm text-white font-medium">{selectedItem.subject}</p>
                    </div>
                  )}
                  {selectedItem.message && (
                    <div className="pt-2 border-t border-gray-800/60">
                      <div className="flex items-center gap-1.5 mb-2">
                        <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Message</p>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed bg-gray-800/40 rounded-xl p-4 border border-gray-800/40">
                        {selectedItem.message}
                      </p>
                    </div>
                  )}
                </div>
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

function DetailField({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value?: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-800/30 border border-gray-800/40">
      <Icon className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="text-sm text-white truncate">{value || '—'}</p>
      </div>
    </div>
  );
}
