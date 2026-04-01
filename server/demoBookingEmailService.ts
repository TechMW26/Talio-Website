import nodemailer from 'nodemailer';

const REQUIRED_ENV_VARS = [
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_USER',
  'EMAIL_PASSWORD',
  'EMAIL_FROM_EMAIL',
] as const;

export interface DemoBookingEmailRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  industry?: string;
  companySize?: string;
  preferredDate?: string;
  preferredTime?: string;
  source?: string;
  selectedPlan?: string;
  selectedPlanPrice?: string;
}

export interface DemoBookingEmailSuccessResponse {
  success: true;
  adminNotified: boolean;
  confirmationSent: boolean;
  verificationBypassed: boolean;
  adminMessageId?: string;
  userMessageId?: string;
}

export interface DemoBookingEmailErrorResponse {
  error: string;
  details?: string;
}

export interface DemoBookingEmailServiceResponse {
  status: number;
  body: DemoBookingEmailSuccessResponse | DemoBookingEmailErrorResponse;
}

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

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Unknown error';
}

function formatPreferredDate(preferredDate?: string) {
  if (!preferredDate) {
    return 'Not specified';
  }

  const parsedDate = new Date(preferredDate);
  if (Number.isNaN(parsedDate.getTime())) {
    return escapeHtml(preferredDate);
  }

  return escapeHtml(
    parsedDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  );
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

export async function handleDemoBookingEmailRequest(
  payload: DemoBookingEmailRequest,
): Promise<DemoBookingEmailServiceResponse> {
  const missingEnvVars = getMissingEnvVars();
  if (missingEnvVars.length > 0) {
    console.error('Missing email environment variables:', missingEnvVars.join(', '));
    return {
      status: 500,
      body: { error: 'Email service is not configured correctly.' },
    };
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
  } = payload;

  if (!firstName || !lastName || !email || !company) {
    return {
      status: 400,
      body: { error: 'Missing required fields' },
    };
  }

  const smtpPort = Number(process.env.EMAIL_PORT);
  const smtpHost = process.env.EMAIL_HOST as string;
  const senderEmail = process.env.EMAIL_FROM_EMAIL as string;
  const senderName = process.env.EMAIL_FROM_NAME || 'Talio';
  const adminRecipient = process.env.EMAIL_ADMIN_TO || senderEmail;
  const recipientEmail = String(email).trim();
  const safeFirstName = escapeHtml(String(firstName));
  const safeLastName = escapeHtml(String(lastName));
  const safeEmail = escapeHtml(recipientEmail);
  const safePhone = escapeHtml(phone || 'N/A');
  const safeCompany = escapeHtml(String(company));
  const safeJobTitle = escapeHtml(jobTitle || 'N/A');
  const safeIndustry = escapeHtml(industry || 'N/A');
  const safeCompanySize = escapeHtml(companySize || 'N/A');
  const safeSource = escapeHtml(source || 'website');
  const safeSelectedPlan = escapeHtml(selectedPlan || '');
  const safeSelectedPlanPrice = escapeHtml(selectedPlanPrice || '');
  const formattedDate = formatPreferredDate(preferredDate);
  const formattedTime = escapeHtml(preferredTime || 'Not specified');

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

  const userMailOptions = {
    from: `"${senderName}" <${senderEmail}>`,
    to: recipientEmail,
    replyTo: senderEmail,
    subject: 'Your Talio demo request is in',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #2563eb, #4f46e5, #7c3aed); padding: 40px 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Demo Request Confirmed</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 10px 0 0; font-size: 16px;">We are preparing your Talio walkthrough.</p>
        </div>
        <div style="padding: 30px;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Hi <strong>${safeFirstName}</strong>,
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Thank you for booking a demo with Talio. Here are the details we received:
          </p>
          <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #2563eb;">
            <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Booking Details</p>
            ${safeSelectedPlan ? `<p style="margin: 4px 0; color: #111827;"><strong>Plan:</strong> ${safeSelectedPlan} (${safeSelectedPlanPrice})</p>` : ''}
            <p style="margin: 4px 0; color: #111827;"><strong>Date:</strong> ${formattedDate}</p>
            <p style="margin: 4px 0; color: #111827;"><strong>Time:</strong> ${formattedTime}</p>
            <p style="margin: 4px 0; color: #111827;"><strong>Company:</strong> ${safeCompany}</p>
          </div>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Our team will reach out shortly with the meeting link and next steps. If you need anything before then, just reply to this email.
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

  const adminMailOptions = {
    from: `"${senderName}" <${senderEmail}>`,
    to: adminRecipient,
    replyTo: recipientEmail,
    subject: `New Demo Booking: ${safeFirstName} ${safeLastName} - ${safeCompany}`,
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
          ${safeSelectedPlan ? `<tr><td style="padding: 8px; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Selected Plan</td><td style="padding: 8px; color: #111827; font-weight: bold; border-bottom: 1px solid #e5e7eb;">${safeSelectedPlan} - ${safeSelectedPlanPrice}</td></tr>` : ''}
          <tr><td style="padding: 8px; color: #6b7280;">Source</td><td style="padding: 8px; color: #111827;">${safeSource}</td></tr>
        </table>
      </div>
    `,
  };

  let verificationBypassed = false;
  try {
    await transporter.verify();
  } catch (error) {
    verificationBypassed = true;
    console.warn('SMTP verification failed, continuing with send attempt:', getErrorMessage(error));
  }

  let adminNotified = false;
  let confirmationSent = false;
  let adminMessageId: string | undefined;
  let userMessageId: string | undefined;
  let adminErrorMessage = '';
  let userErrorMessage = '';

  try {
    const adminResult = await sendMailWithRetry(transporter, adminMailOptions, 3);
    adminNotified = true;
    adminMessageId = adminResult.messageId;
  } catch (error) {
    adminErrorMessage = getErrorMessage(error);
    console.error('Admin email send error:', error);
  }

  try {
    const userResult = await sendMailWithRetry(transporter, userMailOptions, 3);
    confirmationSent = true;
    userMessageId = userResult.messageId;
  } catch (error) {
    userErrorMessage = getErrorMessage(error);
    console.error('User confirmation email send error:', error);
  }

  if (!adminNotified && !confirmationSent) {
    return {
      status: 502,
      body: {
        error: 'Failed to send booking emails.',
        details: userErrorMessage || adminErrorMessage || 'Unknown email delivery error.',
      },
    };
  }

  return {
    status: 200,
    body: {
      success: true,
      adminNotified,
      confirmationSent,
      verificationBypassed,
      adminMessageId,
      userMessageId,
    },
  };
}