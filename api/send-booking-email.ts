import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    company,
    jobTitle,
    industry,
    companySize,
    preferredDate,
    preferredTime,
    source,
    selectedPlan,
    selectedPlanPrice,
  } = req.body || {};

  if (!firstName || !lastName || !email || !company) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 465,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const formattedDate = preferredDate
    ? new Date(preferredDate).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Not specified';

  const formattedTime = preferredTime || 'Not specified';

  // Email to the user (confirmation)
  const userMailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_EMAIL}>`,
    to: email,
    subject: '🎉 Your Talio Demo is Booked!',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7); padding: 40px 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Demo Confirmed! 🚀</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 10px 0 0; font-size: 16px;">We're excited to show you Talio</p>
        </div>
        <div style="padding: 30px;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Hi <strong>${firstName}</strong>,
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Thank you for booking a demo with Talio! Here are your booking details:
          </p>
          <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #6366f1;">
            <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Booking Details</p>
            ${selectedPlan ? `<p style="margin: 4px 0; color: #111827;"><strong>📦 Plan:</strong> ${selectedPlan} (${selectedPlanPrice})</p>` : ''}
            <p style="margin: 4px 0; color: #111827;"><strong>📅 Date:</strong> ${formattedDate}</p>
            <p style="margin: 4px 0; color: #111827;"><strong>🕐 Time:</strong> ${formattedTime}</p>
            <p style="margin: 4px 0; color: #111827;"><strong>🏢 Company:</strong> ${company}</p>
          </div>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Our team will reach out to confirm the exact meeting link shortly. If you have any questions, feel free to reply to this email.
          </p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Best regards,<br/>
            <strong>The Talio Team</strong>
          </p>
        </div>
        <div style="background: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Talio by MWFutureTech. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  // Email to admin (notification)
  const adminMailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_EMAIL}>`,
    to: process.env.EMAIL_FROM_EMAIL,
    subject: `📋 New Demo Booking: ${firstName} ${lastName} — ${company}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #111827;">New Demo Booking Request</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Name</td><td style="padding: 8px; color: #111827; border-bottom: 1px solid #e5e7eb;">${firstName} ${lastName}</td></tr>
          <tr><td style="padding: 8px; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Email</td><td style="padding: 8px; color: #111827; border-bottom: 1px solid #e5e7eb;">${email}</td></tr>
          <tr><td style="padding: 8px; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Phone</td><td style="padding: 8px; color: #111827; border-bottom: 1px solid #e5e7eb;">${phone || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Company</td><td style="padding: 8px; color: #111827; border-bottom: 1px solid #e5e7eb;">${company}</td></tr>
          <tr><td style="padding: 8px; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Job Title</td><td style="padding: 8px; color: #111827; border-bottom: 1px solid #e5e7eb;">${jobTitle || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Industry</td><td style="padding: 8px; color: #111827; border-bottom: 1px solid #e5e7eb;">${industry || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Company Size</td><td style="padding: 8px; color: #111827; border-bottom: 1px solid #e5e7eb;">${companySize || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Preferred Date</td><td style="padding: 8px; color: #111827; border-bottom: 1px solid #e5e7eb;">${formattedDate}</td></tr>
          <tr><td style="padding: 8px; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Preferred Time</td><td style="padding: 8px; color: #111827; border-bottom: 1px solid #e5e7eb;">${formattedTime}</td></tr>
          ${selectedPlan ? `<tr><td style="padding: 8px; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Selected Plan</td><td style="padding: 8px; color: #111827; font-weight: bold; border-bottom: 1px solid #e5e7eb;">${selectedPlan} — ${selectedPlanPrice}</td></tr>` : ''}
          <tr><td style="padding: 8px; color: #6b7280;">Source</td><td style="padding: 8px; color: #111827;">${source || 'website'}</td></tr>
        </table>
      </div>
    `,
  };

  try {
    await Promise.all([
      transporter.sendMail(userMailOptions),
      transporter.sendMail(adminMailOptions),
    ]);
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Email send error:', error);
    return res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
}
