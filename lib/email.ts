import { Resend } from 'resend';
import { logger } from './monitoring';

const emailFrom = process.env.EMAIL_FROM;

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  return apiKey ? new Resend(apiKey) : null;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]!);
}

export async function sendApplicationReceivedEmail(email: string, applicantName: string, jobTitle: string) {
  try {
    const resend = getResendClient();
    if (!resend) {
      logger.warn("RESEND_API_KEY not set. Skipping email.");
      return;
    }
    if (!emailFrom) {
      logger.warn("EMAIL_FROM not set. Skipping email.");
      return;
    }

    const result = await resend.emails.send({
      from: emailFrom,
      to: email,
      subject: `Application Received: ${jobTitle}`,
      html: `
        <h1>Hello ${escapeHtml(applicantName)},</h1>
        <p>Your application for <strong>${escapeHtml(jobTitle)}</strong> has been successfully received.</p>
        <p>Our team will review it and get back to you soon.</p>
        <p>Best regards,<br/>RecruitFlow Team</p>
      `,
    });
    
    if (result.error) {
      logger.error("Failed to send application received email", result.error);
      return;
    }
    logger.info("Application received email sent", { action: "EMAIL_SENT" });
  } catch (error) {
    logger.error("Failed to send application received email", error);
  }
}

export async function sendStatusUpdateEmail(email: string, applicantName: string, jobTitle: string, newStatus: string) {
  try {
    const resend = getResendClient();
    if (!resend) {
      logger.warn("RESEND_API_KEY not set. Skipping email.");
      return;
    }
    if (!emailFrom) {
      logger.warn("EMAIL_FROM not set. Skipping email.");
      return;
    }

    const result = await resend.emails.send({
      from: emailFrom,
      to: email,
      subject: `Status Update: ${jobTitle}`,
      html: `
        <h1>Hello ${escapeHtml(applicantName)},</h1>
        <p>The status of your application for <strong>${escapeHtml(jobTitle)}</strong> has been updated to: <strong>${escapeHtml(newStatus)}</strong>.</p>
        <p>Login to your dashboard to see more details.</p>
        <p>Best regards,<br/>RecruitFlow Team</p>
      `,
    });

    if (result.error) {
      logger.error("Failed to send status update email", result.error);
      return;
    }
    logger.info("Status update email sent", { action: "EMAIL_SENT" });
  } catch (error) {
    logger.error("Failed to send status update email", error);
  }
}
