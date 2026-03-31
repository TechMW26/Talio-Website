import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

const REQUIRED_ENV_VARS = [
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_USER',
  'EMAIL_PASSWORD',
  'EMAIL_FROM_EMAIL',
] as const;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getMissingEnvVars() {
  return REQUIRED_ENV_VARS.filter((name) => !process.env[name]);
}

function sleep(delayMs: number) {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

async function sendMailWithRetry(
  transporter: nodemailer.Transporter,
  mailOptions: nodemailer.SendMailOptions,
  attempts: number,
) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await transporter.sendMail(mailOptions);
    } catch (error) {
      lastError = error;

      if (attempt < attempts) {
        await sleep(attempt * 750);
      }
    }
  }

  throw lastError;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const missingEnvVars = getMissingEnvVars();
  if (missingEnvVars.length > 0) {
    console.error('Missing email environment variables:', missingEnvVars.join(', '));
    return res.status(500).json({ error: 'Email service is not configured correctly.' });
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

  const smtpPort = Number(process.env.EMAIL_PORT);
  const smtpHost = process.env.EMAIL_HOST as string;
  const senderEmail = process.env.EMAIL_FROM_EMAIL as string;
  const senderName = process.env.EMAIL_FROM_NAME || 'Talio';
  const adminRecipient = process.env.EMAIL_ADMIN_TO || senderEmail;
  const safeFirstName = escapeHtml(firstName);
  const safeLastName = escapeHtml(lastName);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone || 'N/A');
  const safeCompany = escapeHtml(company);
  const safeJobTitle = escapeHtml(jobTitle || 'N/A');
  const safeIndustry = escapeHtml(industry || 'N/A');
  const safeCompanySize = escapeHtml(companySize || 'N/A');
  const safeSource = escapeHtml(source || 'website');
  const safeSelectedPlan = escapeHtml(selectedPlan || '');
  const safeSelectedPlanPrice = escapeHtml(selectedPlanPrice || '');

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort || 465,
    secure: process.env.EMAIL_SECURE ? process.env.EMAIL_SECURE === 'true' : (smtpPort || 465) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    tls: {
      servername: smtpHost,
    },
  });

  const formattedDate = preferredDate
    ? escapeHtml(new Date(preferredDate).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }))
    : 'Not specified';

  const formattedTime = escapeHtml(preferredTime || 'Not specified');

  // Email to the user (confirmation)
  const userMailOptions = {
    from: `"${senderName}" <${senderEmail}>`,
    to: email,
    replyTo: senderEmail,
    subject: '🎉 Your Talio Demo is Booked!',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7); padding: 40px 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Demo Confirmed! 🚀</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 10px 0 0; font-size: 16px;">We're excited to show you Talio</p>
        </div>
        <div style="padding: 30px;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Hi <strong>${safeFirstName}</strong>,
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Thank you for booking a demo with Talio! Here are your booking details:
          </p>
          <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #6366f1;">
            <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Booking Details</p>
            ${safeSelectedPlan ? `<p style="margin: 4px 0; color: #111827;"><strong>📦 Plan:</strong> ${safeSelectedPlan} (${safeSelectedPlanPrice})</p>` : ''}
            <p style="margin: 4px 0; color: #111827;"><strong>📅 Date:</strong> ${formattedDate}</p>
            <p style="margin: 4px 0; color: #111827;"><strong>🕐 Time:</strong> ${formattedTime}</p>
            <p style="margin: 4px 0; color: #111827;"><strong>🏢 Company:</strong> ${safeCompany}</p>
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
    from: `"${senderName}" <${senderEmail}>`,
    to: adminRecipient,
    replyTo: email,
    subject: `📋 New Demo Booking: ${safeFirstName} ${safeLastName} — ${safeCompany}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #111827;">New Demo Booking Request</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Name</td><td style="padding: 8px; color: #111827; border-bottom: 1px solid #e5e7eb;">${safeFirstName} ${safeLastName}</td></tr>
          <tr><td style="padding: 8px; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Email</td><td style="padding: 8px; color: #111827; border-bottom: 1px solid #e5e7eb;">${safeEmail}</td></tr>
          <tr><td style="padding: 8px; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Phone</td><td style="padding: 8px; color: #111827; border-bottom: 1px solid #e5e7eb;">${safePhone}</td></tr>
          <tr><td style="padding: 8px; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Company</td><td style="padding: 8px; color: #111827; border-bottom: 1px solid #e5e7eb;">${safeCompany}</td></tr>
          <tr><td style="padding: 8px; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Job Title</td><td style="padding: 8px; color: #111827; border-bottom: 1px solid #e5e7eb;">${safeJobTitle}</td></tr>
          <tr><td style="padding: 8px; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Industry</td><td style="padding: 8px; color: #111827; border-bottom: 1px solid #e5e7eb;">${safeIndustry}</td></tr>
          <tr><td style="padding: 8px; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Company Size</td><td style="padding: 8px; color: #111827; border-bottom: 1px solid #e5e7eb;">${safeCompanySize}</td></tr>
          <tr><td style="padding: 8px; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Preferred Date</td><td style="padding: 8px; color: #111827; border-bottom: 1px solid #e5e7eb;">${formattedDate}</td></tr>
          <tr><td style="padding: 8px; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Preferred Time</td><td style="padding: 8px; color: #111827; border-bottom: 1px solid #e5e7eb;">${formattedTime}</td></tr>
          ${safeSelectedPlan ? `<tr><td style="padding: 8px; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Selected Plan</td><td style="padding: 8px; color: #111827; font-weight: bold; border-bottom: 1px solid #e5e7eb;">${safeSelectedPlan} — ${safeSelectedPlanPrice}</td></tr>` : ''}
          <tr><td style="padding: 8px; color: #6b7280;">Source</td><td style="padding: 8px; color: #111827;">${safeSource}</td></tr>
        </table>
      </div>
    `,
  };

  try {
    await transporter.verify();

    const userResult = await sendMailWithRetry(transporter, userMailOptions, 3);

    let adminNotified = false;
    try {
      await sendMailWithRetry(transporter, adminMailOptions, 2);
      adminNotified = true;
    } catch (adminError: any) {
      console.error('Admin email send error:', adminError);
    }

    return res.status(200).json({ success: true, adminNotified, userMessageId: userResult.messageId });
  } catch (error: any) {
    console.error('Email send error:', error);
    return res.status(502).json({ error: 'Failed to send booking confirmation email.', details: error.message });
  }
}
