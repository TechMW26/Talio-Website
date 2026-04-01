const DB_URL = import.meta.env.VITE_FIREBASE_DB_URL as string;

export type EntryCollection = 'leads' | 'contacts' | 'signups';

export interface LeadEntry {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName?: string;
  companySize?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  industry?: string;
  subject?: string;
  message?: string;
  source: string;
  submittedAt: string;
  firstSubmittedAt?: string;
  preferredDate?: string;
  preferredTime?: string;
  selectedPlan?: string;
  selectedPlanPrice?: string;
  sourcePagePath?: string;
  sourcePageName?: string;
  _collection?: EntryCollection;
}

export interface PageVisit {
  id?: string;
  sessionId: string;
  page: string;
  referrer: string;
  timestamp: string;
  duration?: number;
}

export interface VisitorProfile {
  id?: string;
  sessionId: string;
  ip: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  lat: number;
  lon: number;
  timezone: string;
  browser: string;
  os: string;
  device: string;
  screenWidth: number;
  screenHeight: number;
  language: string;
  firstSeen: string;
  lastSeen: string;
  pageViews: number;
  // autofill enrichment
  autoName?: string;
  autoEmail?: string;
  autoPhone?: string;
  autoAddress?: string;
}

async function fbPost(path: string, data: unknown) {
  const res = await fetch(`${DB_URL}/${path}.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Firebase POST failed: ${res.statusText}`);
  return res.json();
}

async function fbPut(path: string, data: unknown) {
  const res = await fetch(`${DB_URL}/${path}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Firebase PUT failed: ${res.statusText}`);
  return res.json();
}

async function fbPatch(path: string, data: unknown) {
  const res = await fetch(`${DB_URL}/${path}.json`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Firebase PATCH failed: ${res.statusText}`);
  return res.json();
}

async function fbGet<T = unknown>(path: string): Promise<Record<string, T> | null> {
  const res = await fetch(`${DB_URL}/${path}.json`);
  if (!res.ok) throw new Error(`Firebase GET failed: ${res.statusText}`);
  return res.json();
}

async function fbDelete(path: string) {
  const res = await fetch(`${DB_URL}/${path}.json`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Firebase DELETE failed: ${res.statusText}`);
  return res.json();
}

function mapEntries(data: Record<string, LeadEntry> | null, collection: EntryCollection): LeadEntry[] {
  if (!data) return [];

  return Object.entries(data).map(([key, value]) => ({
    ...value,
    id: key,
    _collection: collection,
  }));
}

function sortEntriesBySubmittedAt<T extends LeadEntry>(entries: T[]): T[] {
  return [...entries].sort(
    (left, right) => new Date(right.submittedAt || 0).getTime() - new Date(left.submittedAt || 0).getTime(),
  );
}

// ── Dedup helpers ──

async function findExistingEntry(path: string, email?: string, phone?: string): Promise<[string, LeadEntry] | null> {
  if (!email && !phone) return null;
  const data = await fbGet<LeadEntry>(path);
  if (!data) return null;
  for (const [key, val] of Object.entries(data)) {
    if (email && val.email?.toLowerCase() === email.toLowerCase()) return [key, val];
    if (phone && phone.length > 5 && val.phone === phone) return [key, val];
  }
  return null;
}

export async function submitLead(lead: LeadEntry) {
  const existing = await findExistingEntry('leads', lead.email, lead.phone);
  if (existing) {
    // Update existing lead with latest data
    return fbPatch(`leads/${existing[0]}`, { ...lead, firstSubmittedAt: existing[1].submittedAt });
  }
  return fbPost('leads', lead);
}

export async function submitContact(contact: LeadEntry) {
  // Contacts allow multiple messages from same person, but we dedupe if identical subject+message
  const existing = await findExistingEntry('contacts', contact.email, contact.phone);
  if (existing && existing[1].subject === contact.subject && existing[1].message === contact.message) {
    return { name: existing[0] }; // already exists, skip
  }
  return fbPost('contacts', contact);
}

export async function submitSignup(signup: LeadEntry) {
  const existing = await findExistingEntry('signups', signup.email, signup.phone);
  if (existing) {
    // Update existing signup
    return fbPatch(`signups/${existing[0]}`, { ...signup, firstSubmittedAt: existing[1].submittedAt });
  }
  return fbPost('signups', signup);
}

export async function getLeads(): Promise<LeadEntry[]> {
  const [leadData, signupData] = await Promise.all([
    fbGet<LeadEntry>('leads'),
    fbGet<LeadEntry>('signups'),
  ]);

  return sortEntriesBySubmittedAt([
    ...mapEntries(leadData, 'leads'),
    ...mapEntries(signupData, 'signups'),
  ]);
}

export async function getContacts(): Promise<LeadEntry[]> {
  const data = await fbGet<LeadEntry>('contacts');
  return sortEntriesBySubmittedAt(mapEntries(data, 'contacts'));
}

export async function deleteEntry(collection: EntryCollection, id: string) {
  return fbDelete(`${collection}/${id}`);
}

// ── Analytics ──

export async function submitPageVisit(visit: Omit<PageVisit, 'id'>) {
  return fbPost('pageVisits', visit);
}

export async function getPageVisits(): Promise<PageVisit[]> {
  const data = await fbGet<PageVisit>('pageVisits');
  if (!data) return [];
  return Object.entries(data).map(([key, val]) => ({ ...val, id: key }));
}

export async function upsertVisitor(sessionId: string, profile: Omit<VisitorProfile, 'id'>) {
  // Check if visitor already exists by sessionId
  const existing = await fbGet<VisitorProfile>('visitors');
  if (existing) {
    const match = Object.entries(existing).find(([, v]) => v.sessionId === sessionId);
    if (match) {
      return fbPatch(`visitors/${match[0]}`, {
        lastSeen: profile.lastSeen,
        pageViews: profile.pageViews,
        ...(profile.autoName && { autoName: profile.autoName }),
        ...(profile.autoEmail && { autoEmail: profile.autoEmail }),
        ...(profile.autoPhone && { autoPhone: profile.autoPhone }),
        ...(profile.autoAddress && { autoAddress: profile.autoAddress }),
      });
    }
  }
  return fbPost('visitors', profile);
}

export async function getVisitors(): Promise<VisitorProfile[]> {
  const data = await fbGet<VisitorProfile>('visitors');
  if (!data) return [];
  return Object.entries(data).map(([key, val]) => ({ ...val, id: key }));
}

/**
 * Enrich the current session's visitor profile with form-submitted data.
 * Called after a user submits any lead/contact form on the site.
 */
export async function enrichVisitorFromForm(data: { name?: string; email?: string; phone?: string }) {
  const sid = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('talio_sid') : null;
  if (!sid) return;
  const existing = await fbGet<VisitorProfile>('visitors');
  if (!existing) return;
  const match = Object.entries(existing).find(([, v]) => v.sessionId === sid);
  if (!match) return;
  const patch: Record<string, string> = {};
  if (data.name) patch.autoName = data.name;
  if (data.email) patch.autoEmail = data.email;
  if (data.phone) patch.autoPhone = data.phone;
  if (Object.keys(patch).length > 0) {
    await fbPatch(`visitors/${match[0]}`, patch);
  }
}

// ── Blog System ──

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  metaDescription: string;
  content: string;
  featuredImage: string;
  tags: string[];
  status: 'draft' | 'published';
  authorEmail: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  readTimeMinutes?: number;
}

export interface BlogEditor {
  id?: string;
  email: string;
  name: string;
  createdAt: string;
}

function estimateReadTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, '').trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export async function createBlogPost(post: Omit<BlogPost, 'id'>): Promise<string> {
  const toSave = { ...post, readTimeMinutes: estimateReadTime(post.content) };
  const res = await fbPost('blogPosts', toSave);
  return res.name;
}

export async function updateBlogPost(id: string, post: Partial<BlogPost>): Promise<void> {
  const update = { ...post, updatedAt: new Date().toISOString() };
  if (post.content) update.readTimeMinutes = estimateReadTime(post.content);
  await fbPatch(`blogPosts/${id}`, update);
}

export async function deleteBlogPost(id: string): Promise<void> {
  await fbDelete(`blogPosts/${id}`);
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const data = await fbGet<BlogPost>('blogPosts');
  if (!data) return [];
  return Object.entries(data)
    .map(([key, val]) => ({ ...val, id: key }))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const posts = await getBlogPosts();
  return posts
    .filter(p => p.status === 'published')
    .sort((a, b) => new Date(b.publishedAt || b.updatedAt).getTime() - new Date(a.publishedAt || a.updatedAt).getTime());
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const data = await fbGet<BlogPost>('blogPosts');
  if (!data) return null;
  const match = Object.entries(data).find(([, v]) => v.slug === slug && v.status === 'published');
  return match ? { ...match[1], id: match[0] } : null;
}

export async function addBlogEditor(editor: Omit<BlogEditor, 'id'>): Promise<string> {
  const existing = await fbGet<BlogEditor>('blogEditors');
  if (existing) {
    const dup = Object.entries(existing).find(([, v]) => v.email.toLowerCase() === editor.email.toLowerCase());
    if (dup) throw new Error('Editor with this email already exists');
  }
  const res = await fbPost('blogEditors', editor);
  return res.name;
}

export async function removeBlogEditor(id: string): Promise<void> {
  await fbDelete(`blogEditors/${id}`);
}

export async function getBlogEditors(): Promise<BlogEditor[]> {
  const data = await fbGet<BlogEditor>('blogEditors');
  if (!data) return [];
  return Object.entries(data)
    .map(([key, val]) => ({ ...val, id: key }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
