import nodemailer from 'nodemailer';
import { escapeHtml as e, isHttpUrl } from './security.js';

const BRAND = 'Tattva Tech';
const SEND_TIMEOUT_MS = 8000;

let cachedTransporter;
const getTransporter = () => {
  if (cachedTransporter !== undefined) return cachedTransporter;
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
    const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465;
    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port,
      secure,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      connectionTimeout: SEND_TIMEOUT_MS,
      greetingTimeout: SEND_TIMEOUT_MS,
      socketTimeout: SEND_TIMEOUT_MS,
    });
  } else {
    cachedTransporter = null;
  }
  return cachedTransporter;
};

const fromAddress = (label) => {
  const address = process.env.SMTP_FROM || process.env.SMTP_USER;
  // SMTP_FROM may already be a full "Name <addr>" string.
  if (address && address.includes('<')) return address;
  return `"${label}" <${address}>`;
};

const withTimeout = (promise, ms) =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`Email send timed out after ${ms}ms`)), ms)),
  ]);

/**
 * Sends an email; never throws. Returns true if sent, false otherwise.
 * Without SMTP configured it logs a short notice (no message bodies) and returns false.
 */
const deliver = async ({ to, subject, html, label, replyTo }) => {
  const transporter = getTransporter();
  if (!transporter) {
    console.log(`[Email Notice]: SMTP not configured — skipped "${subject}" to ${to}`);
    return false;
  }
  if (!to) {
    console.warn(`[Email Warning]: No recipient configured for "${subject}"`);
    return false;
  }
  try {
    await withTimeout(
      transporter.sendMail({ from: fromAddress(label), to, subject, html, ...(replyTo ? { replyTo } : {}) }),
      SEND_TIMEOUT_MS
    );
    console.log(`[Email Sent]: "${subject}" to ${to}`);
    return true;
  } catch (error) {
    console.warn(`[Email Warning]: Failed to send "${subject}" to ${to}: ${error.message}`);
    return false;
  }
};

const layout = (inner) => `
  <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; color: #0f172a;">
    ${inner}
    <p style="color: #94a3b8; font-size: 12px; margin-top: 28px;">${BRAND} • Ideas into Impact • tattvatechsolutions.in</p>
  </div>`;

const row = (label, value) =>
  `<tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold; width: 140px; vertical-align: top;">${label}</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${value}</td></tr>`;

const multiline = (text) => e(text).replace(/\r?\n/g, '<br/>');

/** Notify the company about a new enquiry. */
export const sendEnquiryNotificationToCompanyHead = async ({
  name, email, company, phone, service, budget, source, message, submissionDate,
}) => {
  const subject = `[New Enquiry] ${BRAND} website — ${String(name).slice(0, 80)}`;
  const html = layout(`
    <h2 style="color: #2563eb; margin: 0 0 10px;">New client enquiry</h2>
    <p style="color: #475569; font-size: 14px;">A new enquiry was submitted on the ${BRAND} website.</p>
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
      ${row('Name', e(name))}
      ${row('Email', `<a href="mailto:${e(email)}">${e(email)}</a>`)}
      ${row('Phone', e(phone || 'N/A'))}
      ${row('Company', e(company || 'N/A'))}
      ${row('Service', e(service || 'N/A'))}
      ${row('Budget', e(budget || 'N/A'))}
      ${row('Page', e(source || 'N/A'))}
      ${row('Date', e(new Date(submissionDate || Date.now()).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })))}
    </table>
    <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 12px 16px;">
      <h4 style="margin: 0 0 6px; color: #1e293b;">Message</h4>
      <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.5;">${multiline(message)}</p>
    </div>
    <p style="color: #64748b; font-size: 12px; margin-top: 20px;">Manage this enquiry in the admin dashboard.</p>`);

  return deliver({
    to: process.env.COMPANY_HEAD_EMAIL,
    subject,
    html,
    label: `${BRAND} Website`,
    replyTo: email,
  });
};

/** Short auto-acknowledgement to the person who submitted the contact form. */
// Auto-replies go to an address typed into a public form, so they are OFF unless
// SEND_AUTO_REPLY=true, and they never echo user-supplied text (prevents the form
// being used to send spam through the company mailbox).
const autoReplyEnabled = () => String(process.env.SEND_AUTO_REPLY || '').toLowerCase() === 'true';

export const sendEnquiryAcknowledgement = async ({ email }) => {
  if (!autoReplyEnabled()) return null;
  const html = layout(`
    <h2 style="color: #2563eb; margin: 0 0 12px;">Thanks for reaching out</h2>
    <p style="color: #334155; font-size: 14px; line-height: 1.6;">
      We have received your message and a member of the ${BRAND} team will get back to you as soon as possible.
    </p>
    <p style="color: #334155; font-size: 14px; line-height: 1.6;">
      If your request is urgent, simply reply to this email.
    </p>`);

  return deliver({
    to: email,
    subject: `We received your message — ${BRAND}`,
    html,
    label: BRAND,
    replyTo: process.env.COMPANY_HEAD_EMAIL || undefined,
  });
};

/** Notify HR about a new job application. */
export const sendApplicationNotificationToHR = async ({
  applicantName, email, phone, jobTitle, resumeUrl, portfolioUrl, coverLetter,
}) => {
  const portfolioCell = isHttpUrl(portfolioUrl)
    ? `<a href="${e(portfolioUrl)}" target="_blank" rel="noopener noreferrer">${e(portfolioUrl)}</a>`
    : e(portfolioUrl || 'N/A');
  const resumeCell = isHttpUrl(resumeUrl)
    ? `<a href="${e(resumeUrl)}" target="_blank" rel="noopener noreferrer">Download resume</a>`
    : 'Available in admin dashboard';

  const html = layout(`
    <h2 style="color: #2563eb; margin: 0 0 10px;">New job application</h2>
    <p style="color: #475569; font-size: 14px;">Position: <strong>${e(jobTitle)}</strong></p>
    <table style="width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 14px;">
      ${row('Applicant', e(applicantName))}
      ${row('Email', `<a href="mailto:${e(email)}">${e(email)}</a>`)}
      ${row('Phone', e(phone || 'N/A'))}
      ${row('Portfolio', portfolioCell)}
      ${row('Resume', resumeCell)}
    </table>
    ${coverLetter ? `
    <div style="background-color: #f8fafc; border-left: 4px solid #0284c7; padding: 12px;">
      <h4 style="margin: 0 0 6px;">Cover note</h4>
      <p style="margin: 0; color: #334155; font-size: 13px;">${multiline(coverLetter)}</p>
    </div>` : ''}`);

  return deliver({
    to: process.env.HR_EMAIL || process.env.COMPANY_HEAD_EMAIL,
    subject: `[New Application] ${String(jobTitle).slice(0, 80)} — ${String(applicantName).slice(0, 80)}`,
    html,
    label: `${BRAND} Careers`,
    replyTo: email,
  });
};

/** Confirmation email to the candidate. */
export const sendApplicationConfirmationToCandidate = async ({ email, jobTitle }) => {
  if (!autoReplyEnabled()) return null;
  const html = layout(`
    <h2 style="color: #2563eb; margin: 0 0 12px;">Thank you for applying</h2>
    <p style="color: #334155; font-size: 14px; line-height: 1.6;">
      We have received your application for the <strong>${e(jobTitle)}</strong> role at ${BRAND}.
    </p>
    <p style="color: #334155; font-size: 14px; line-height: 1.6;">
      Our team reviews every application. If your profile matches the role, we will contact you about next steps.
    </p>`);

  return deliver({
    to: email,
    subject: `Application received: ${String(jobTitle).slice(0, 80)} at ${BRAND}`,
    html,
    label: `${BRAND} Careers`,
  });
};
