import nodemailer from 'nodemailer';

/**
 * Configure Nodemailer transport
 * Uses Ethereal test account by default or custom SMTP from .env
 */
export const createTransporter = async () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Fallback to simulated nodemailer transporter for development
  return {
    sendMail: async (mailOptions) => {
      console.log(`[Email Notification Simulated]`);
      console.log(`To: ${mailOptions.to}`);
      console.log(`Subject: ${mailOptions.subject}`);
      console.log(`Content Preview: ${mailOptions.text?.slice(0, 120)}...`);
      return { messageId: `mock-msg-${Date.now()}` };
    }
  };
};

/**
 * Send inspection appointment notification to merchant
 */
export const sendVerificationScheduledEmail = async (toEmail, details) => {
  try {
    const transporter = await createTransporter();
    const info = await transporter.sendMail({
      from: '"Directorate of Legal Metrology (MetrX)" <noreply@metrx.gov.in>',
      to: toEmail,
      subject: `Verification Scheduled — ${details.shopName} (${details.slotDate})`,
      text: `Dear Merchant, your on-site scale verification has been scheduled for ${details.slotDate} (${details.slotTime}) by Inspector ${details.inspectorName}. Reference: ${details.bookingRef}.`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #023625;">Legal Metrology Verification Scheduled</h2>
          <p>Dear Merchant,</p>
          <p>Your on-site scale inspection appointment has been successfully confirmed:</p>
          <ul>
            <li><strong>Establishment:</strong> ${details.shopName}</li>
            <li><strong>Appointment Slot:</strong> ${details.slotDate} (${details.slotTime})</li>
            <li><strong>Assigned Inspector:</strong> ${details.inspectorName}</li>
            <li><strong>Booking Reference:</strong> ${details.bookingRef}</li>
          </ul>
          <p style="color: #6b7280; font-size: 12px;">This is an automated notification from the MetrX Digital Metrology Platform.</p>
        </div>
      `
    });
    return info;
  } catch (error) {
    console.error('[Nodemailer Error]', error.message);
  }
};
