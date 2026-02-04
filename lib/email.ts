import { Resend } from 'resend';
import { logger } from './monitoring';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendApplicationReceivedEmail(email: string, applicantName: string, jobTitle: string) {
  try {
    if (!process.env.RESEND_API_KEY) {
      logger.warn("RESEND_API_KEY not set. Skipping email.");
      return;
    }

    await resend.emails.send({
      from: 'RecruitFlow <notifications@recruitflow.com>',
      to: email,
      subject: `Application Received: ${jobTitle}`,
      html: `
        <h1>Hello ${applicantName},</h1>
        <p>Your application for <strong>${jobTitle}</strong> has been successfully received.</p>
        <p>Our team will review it and get back to you soon.</p>
        <p>Best regards,<br/>RecruitFlow Team</p>
      `,
    });
    
    logger.info("Application received email sent", { userId: email, action: "EMAIL_SENT" });
  } catch (error) {
    logger.error("Failed to send application received email", error as Error, { metadata: { email } });
  }
}

export async function sendStatusUpdateEmail(email: string, applicantName: string, jobTitle: string, newStatus: string) {
  try {
    if (!process.env.RESEND_API_KEY) {
      logger.warn("RESEND_API_KEY not set. Skipping email.");
      return;
    }

    await resend.emails.send({
      from: 'RecruitFlow <notifications@recruitflow.com>',
      to: email,
      subject: `Status Update: ${jobTitle}`,
      html: `
        <h1>Hello ${applicantName},</h1>
        <p>The status of your application for <strong>${jobTitle}</strong> has been updated to: <strong>${newStatus}</strong>.</p>
        <p>Login to your dashboard to see more details.</p>
        <p>Best regards,<br/>RecruitFlow Team</p>
      `,
    });

    logger.info("Status update email sent", { userId: email, action: "EMAIL_SENT" });
  } catch (error) {
    logger.error("Failed to send status update email", error as Error, { metadata: { email } });
  }
}
