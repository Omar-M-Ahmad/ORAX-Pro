/**
 * @file src/lib/email/index.ts
 * @description Email helpers for ORAX.
 */

import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const emailFrom = process.env.EMAIL_FROM || "ORAX <onboarding@resend.dev>";

export async function sendPasswordResetEmail(params: {
  to: string;
  resetUrl: string;
}): Promise<void> {
  const { to, resetUrl } = params;

  if (!resend) {
    console.log("[email] Password reset URL:", resetUrl);
    return;
  }

  await resend.emails.send({
    from: emailFrom,
    to,
    subject: "Reset your ORAX password",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.7;">
        <h2>Reset your password</h2>
        <p>We received a request to reset your ORAX password.</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block;padding:10px 16px;background:#6366f1;color:#fff;text-decoration:none;border-radius:8px;">
            Reset password
          </a>
        </p>
        <p>If you did not request this, you can safely ignore this email.</p>
      </div>
    `,
  });
}
