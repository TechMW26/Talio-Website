const DB_URL = import.meta.env.VITE_FIREBASE_DB_URL as string;

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
  const data = await fbGet<LeadEntry>('leads');
  if (!data) return [];
  return Object.entries(data).map(([key, val]) => ({ ...val, id: key }));
}

export async function getContacts(): Promise<LeadEntry[]> {
  const data = await fbGet<LeadEntry>('contacts');
  if (!data) return [];
  return Object.entries(data).map(([key, val]) => ({ ...val, id: key }));
}

export async function getSignups(): Promise<LeadEntry[]> {
  const data = await fbGet<LeadEntry>('signups');
  if (!data) return [];
  return Object.entries(data).map(([key, val]) => ({ ...val, id: key }));
}

export async function deleteEntry(collection: 'leads' | 'contacts' | 'signups', id: string) {
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

export async function findVisitorByEmail(email: string): Promise<[string, VisitorProfile] | null> {
  const data = await fbGet<VisitorProfile>('visitors');
  if (!data) return null;
  const match = Object.entries(data).find(([, v]) => v.autoEmail === email);
  return match ? [match[0], { ...match[1], id: match[0] }] : null;
}

export async function findVisitorByPhone(phone: string): Promise<[string, VisitorProfile] | null> {
  const data = await fbGet<VisitorProfile>('visitors');
  if (!data) return null;
  const match = Object.entries(data).find(([, v]) => v.autoPhone === phone);
  return match ? [match[0], { ...match[1], id: match[0] }] : null;
}

export async function mergeVisitorProfiles(primaryId: string, duplicateId: string) {
  // Merge duplicate into primary by updating pageVisits session references
  const visits = await fbGet<PageVisit>('pageVisits');
  if (visits) {
    const dup = await fbGet<VisitorProfile>(`visitors`);
    const dupProfile = dup?.[duplicateId];
    if (dupProfile) {
      // update primary with any extra info from duplicate
      await fbPatch(`visitors/${primaryId}`, {
        pageViews: ((dup?.[primaryId]?.pageViews ?? 0) + (dupProfile.pageViews ?? 0)),
        ...(dupProfile.autoName && { autoName: dupProfile.autoName }),
        ...(dupProfile.autoEmail && { autoEmail: dupProfile.autoEmail }),
        ...(dupProfile.autoPhone && { autoPhone: dupProfile.autoPhone }),
      });
    }
  }
}

export async function getVisitors(): Promise<VisitorProfile[]> {
  const data = await fbGet<VisitorProfile>('visitors');
  if (!data) return [];
  return Object.entries(data).map(([key, val]) => ({ ...val, id: key }));
}
