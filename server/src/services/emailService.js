import nodemailer from 'nodemailer';
import { ENV } from '../config/env.js';

let transporter = null;

if (ENV.SMTP_HOST && ENV.SMTP_USER) {
  transporter = nodemailer.createTransport({
    host: ENV.SMTP_HOST,
    port: ENV.SMTP_PORT,
    auth: {
      user: ENV.SMTP_USER,
      pass: ENV.SMTP_PASS,
    },
  });
}

export class EmailService {
  static async sendEmail({ to, subject, text, html }) {
    if (!transporter) {
      // Safe development fallback: log email contents cleanly to console
      console.log('----------------------------------------------------');
      console.log(`[Email Service (Dev Fallback)] To: ${to}`);
      console.log(`[Subject]: ${subject}`);
      console.log(`[Text]: ${text}`);
      console.log('----------------------------------------------------');
      return { messageId: `dev-mock-${Date.now()}` };
    }

    return transporter.sendMail({
      from: ENV.EMAIL_FROM,
      to,
      subject,
      text,
      html: html || `<p>${text}</p>`,
    });
  }

  static async sendVerificationEmail(to, token) {
    const verifyUrl = `${ENV.WEB_ORIGIN}/verify-email?token=${token}`;
    return this.sendEmail({
      to,
      subject: 'Verify your LIFEVERSE account',
      text: `Welcome to LIFEVERSE! Verify your account by visiting: ${verifyUrl}`,
      html: `
        <div style="font-family: sans-serif; background: #080B14; color: #F8FAFC; padding: 24px; border-radius: 8px;">
          <h1 style="color: #8B5CF6;">Welcome to LIFEVERSE!</h1>
          <p>Turn your real life into an adventure. Please verify your email to get started.</p>
          <a href="${verifyUrl}" style="background: #8B5CF6; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">Verify Account</a>
          <p style="color: #94A3B8; margin-top: 20px;">Or paste this link: ${verifyUrl}</p>
        </div>
      `,
    });
  }

  static async sendPasswordResetEmail(to, token) {
    const resetUrl = `${ENV.WEB_ORIGIN}/reset-password?token=${token}`;
    return this.sendEmail({
      to,
      subject: 'Reset your LIFEVERSE password',
      text: `Reset your password by visiting: ${resetUrl}`,
      html: `
        <div style="font-family: sans-serif; background: #080B14; color: #F8FAFC; padding: 24px; border-radius: 8px;">
          <h1 style="color: #38BDF8;">Password Reset Request</h1>
          <p>We received a request to reset your LIFEVERSE password.</p>
          <a href="${resetUrl}" style="background: #38BDF8; color: #080B14; font-weight: bold; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">Reset Password</a>
          <p style="color: #94A3B8; margin-top: 20px;">Link expires in 1 hour.</p>
        </div>
      `,
    });
  }
}

export default EmailService;
