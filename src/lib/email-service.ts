import nodemailer from 'nodemailer';
import type { SendMailOptions } from 'nodemailer';
import { getAdminAuth } from './firebase-admin';

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.in',
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_SMTP_EMAIL,
    pass: process.env.ZOHO_SMTP_PASSWORD,
  },
});

const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const FROM_NAME = 'Knobly Web';
const FROM_EMAIL = process.env.ZOHO_SMTP_EMAIL || 'noreply@example.invalid';

function getFromAddress(): string {
  return '"' + FROM_NAME + '" <' + FROM_EMAIL + '>';
}

// ─── Knobly Web Email Wrapper (matches website theme) ───
function emailWrapper(content: string): string {
  const year = new Date().getFullYear();
  return [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '  <meta charset="UTF-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '  <title>Knobly Web</title>',
    '</head>',
    '<body style="margin:0;padding:0;background-color:#eef2f7;font-family:Arial,\'Helvetica Neue\',Helvetica,sans-serif;">',
    '',
    '  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#eef2f7;padding:40px 16px;">',
    '    <tr>',
    '      <td align="center">',
    '',
    '        <!-- Main Card -->',
    '        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:460px;background-color:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.06);">',
    '',
    '          <!-- Header Bar -->',
    '          <tr>',
    '            <td style="background:linear-gradient(135deg,#4a9fe5 0%,#6db3f2 50%,#8ec5f6 100%);padding:26px 28px;text-align:center;">',
    '              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 auto;">',
    '                <tr>',
    '                  <td style="background:#ffffff;width:32px;height:32px;border-radius:8px;text-align:center;vertical-align:middle;font-size:16px;font-weight:800;color:#4a9fe5;padding:0;">K.</td>',
    '                  <td style="padding-left:10px;">',
    '                    <span style="color:#ffffff;font-size:20px;font-weight:800;letter-spacing:3px;">KNOBLY</span>',
    '                  </td>',
    '                </tr>',
    '              </table>',
    '              <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:11px;letter-spacing:1px;">O-Level &amp; Python Learning Platform</p>',
    '            </td>',
    '          </tr>',
    '',
    '          <!-- Content -->',
    '          <tr>',
    '            <td style="padding:30px 28px 32px;">',
    '              ' + content,
    '            </td>',
    '          </tr>',
    '',
    '          <!-- Footer -->',
    '          <tr>',
    '            <td style="background-color:#f7f9fc;padding:18px 28px;border-top:1px solid #eef2f7;text-align:center;">',
    '              <p style="margin:0 0 3px;color:#9ca3af;font-size:11px;">Sent by Knobly Web &middot; Do not reply</p>',
    '              <p style="margin:0;color:#c0c4cc;font-size:10px;">&copy; ' + year + ' knoblyweb.in &middot; All rights reserved</p>',
    '            </td>',
    '          </tr>',
    '',
    '        </table>',
    '',
    '      </td>',
    '    </tr>',
    '  </table>',
    '',
    '</body>',
    '</html>',
  ].join('\n');
}

// ─── Verification Email ───
function buildVerificationBody(link: string, name: string): string {
  return [
    '<h2 style="margin:0 0 8px;color:#1e293b;font-size:19px;font-weight:700;">Verify Your Email</h2>',
    '<p style="margin:0 0 22px;color:#64748b;font-size:14px;line-height:1.7;">',
    '  Hey <strong style="color:#1e293b;">' + name + '</strong>,<br>',
    '  Welcome to Knobly Web! Verify your email to start learning.',
    '</p>',
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0">',
    '  <tr>',
    '    <td align="center" style="padding:2px 0 22px;">',
    '      <a href="' + link + '" target="_blank" style="display:inline-block;background:linear-gradient(135deg,#4a9fe5,#6db3f2);color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;padding:11px 30px;border-radius:10px;letter-spacing:0.3px;">',
    '        &#9993;&nbsp; Verify Email',
    '      </a>',
    '    </td>',
    '  </tr>',
    '</table>',
    '<div style="border-top:1px solid #eef2f7;padding-top:14px;">',
    '  <p style="margin:0;color:#9ca3af;font-size:11px;line-height:1.5;text-align:center;">',
    '    Link expires in 24 hours. Didn\'t sign up? Ignore this email.',
    '  </p>',
    '</div>',
  ].join('\n');
}

// ─── Password Reset Email ───
function buildResetBody(link: string): string {
  return [
    '<h2 style="margin:0 0 8px;color:#1e293b;font-size:19px;font-weight:700;">Reset Your Password</h2>',
    '<p style="margin:0 0 22px;color:#64748b;font-size:14px;line-height:1.7;">',
    '  We received a request to reset your Knobly Web account password. Tap the button below to set a new one.',
    '</p>',
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0">',
    '  <tr>',
    '    <td align="center" style="padding:2px 0 22px;">',
    '      <a href="' + link + '" target="_blank" style="display:inline-block;background:linear-gradient(135deg,#4a9fe5,#6db3f2);color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;padding:11px 30px;border-radius:10px;letter-spacing:0.3px;">',
    '        &#128273;&nbsp; Reset Password',
    '      </a>',
    '    </td>',
    '  </tr>',
    '</table>',
    '<div style="border-top:1px solid #eef2f7;padding-top:14px;">',
    '  <p style="margin:0 0 3px;color:#9ca3af;font-size:11px;line-height:1.5;text-align:center;">',
    '    This link expires in <strong style="color:#64748b;">1 hour</strong>.',
    '  </p>',
    '  <p style="margin:0;color:#c0c4cc;font-size:11px;text-align:center;">',
    '    Didn\'t request this? Safely ignore this email.',
    '  </p>',
    '</div>',
  ].join('\n');
}

export async function sendVerificationEmail(email: string, displayName?: string): Promise<void> {
  const firebaseLink = await getAdminAuth().generateEmailVerificationLink(email, { url: APP_URL });
  const url = new URL(firebaseLink);
  const oobCode = url.searchParams.get('oobCode') || '';
  const customLink = APP_URL + '/verify-email?oobCode=' + encodeURIComponent(oobCode);
  
  const name = displayName || email.split('@')[0];
  await sendConfiguredMail({
    from: getFromAddress(),
    to: email,
    subject: 'Verify your email - Knobly Web',
    html: emailWrapper(buildVerificationBody(customLink, name)),
  });
}

export async function sendPasswordResetMail(email: string): Promise<void> {
  const firebaseLink = await getAdminAuth().generatePasswordResetLink(email, { url: APP_URL });
  const url = new URL(firebaseLink);
  const oobCode = url.searchParams.get('oobCode') || '';
  const customLink = APP_URL + '/reset-password?oobCode=' + encodeURIComponent(oobCode);
  await sendConfiguredMail({
    from: getFromAddress(),
    to: email,
    subject: 'Reset your password - Knobly Web',
    html: emailWrapper(buildResetBody(customLink)),
  });
}

/**
 * For Knobly ID users (Google sign-in + created User ID):
 * Generate reset link for @knobly.id virtual email (password provider)
 * but send the email to user's actual Gmail address.
 */
export async function sendPasswordResetMailForKnoblyId(knoblyEmail: string, actualEmail: string): Promise<void> {
  const firebaseLink = await getAdminAuth().generatePasswordResetLink(knoblyEmail, { url: APP_URL });
  const url = new URL(firebaseLink);
  const oobCode = url.searchParams.get('oobCode') || '';
  const customLink = APP_URL + '/reset-password?oobCode=' + encodeURIComponent(oobCode);
  await sendConfiguredMail({
    from: getFromAddress(),
    to: actualEmail,
    subject: 'Reset your Knobly User ID password - Knobly Web',
    html: emailWrapper(buildResetBody(customLink)),
  });
}

async function sendConfiguredMail(options:SendMailOptions){if(process.env.KNOBLY_ENABLE_EMAIL!=='true')throw new Error('SMTP email is disabled.');return transporter.sendMail(options);}
