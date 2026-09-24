import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleDemoBookingEmailRequest } from '../server/demoBookingEmailService.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const result = await handleDemoBookingEmailRequest(req.body || {});
  return res.status(result.status).json(result.body);
}
