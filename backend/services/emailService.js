import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class EmailService {
  constructor() {
    this.enabled = process.env.EMAIL_ENABLED === 'true';
    this.isConfigured =
      !!process.env.EMAIL_USER &&
      !!process.env.EMAIL_PASSWORD &&
      process.env.EMAIL_USER !== 'your-email@gmail.com' &&
      process.env.EMAIL_PASSWORD !== 'your-app-password';
    
    if (this.enabled && this.isConfigured) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });
    }
  }

  async sendConfirmationEmail({ customerName, email, service, addons = [], date, time }) {
    if (!this.enabled) {
      console.log('📧 Email disabled - Would send confirmation to:', email);
      return;
    }

    if (!this.isConfigured) {
      console.warn('📧 Email is enabled but SMTP credentials are placeholders. Set EMAIL_USER and EMAIL_PASSWORD in backend/.env');
      return;
    }

    const addonsHtml = addons.length
      ? `<div class="detail-row"><span class="detail-label">Add-services:</span> <span class="detail-value">${addons.join(', ')}</span></div>`
      : '';

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '✂️ Appointment Confirmation - Stilly.Barb',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d4af37; }
            .detail-row { margin: 10px 0; }
            .detail-label { font-weight: bold; color: #666; }
            .detail-value { color: #1a1a1a; }
            .footer { text-align: center; color: #666; font-size: 14px; margin-top: 20px; }
            .button { display: inline-block; background: #d4af37; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✂️ Stilly.Barb</h1>
              <p>Premium Barbershop Experience</p>
            </div>
            <div class="content">
              <h2>Hi ${customerName},</h2>
              <p>Your appointment has been confirmed! We're looking forward to seeing you.</p>
              
              <div class="appointment-details">
                <h3 style="margin-top: 0; color: #1a1a1a;">Appointment Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Service:</span>
                  <span class="detail-value">${service}</span>
                </div>
                ${addonsHtml}
                <div class="detail-row">
                  <span class="detail-label">Date:</span>
                  <span class="detail-value">${date}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Time:</span>
                  <span class="detail-value">${time}</span>
                </div>
              </div>

              <p><strong>Important Notes:</strong></p>
              <ul>
                <li>Please arrive 5 minutes early</li>
                <li>If you need to reschedule, please contact us at least 24 hours in advance</li>
                <li>Bring any inspiration photos you'd like to share</li>
              </ul>

              <div style="text-align: center;">
                <a href="#" class="button">View My Appointment</a>
              </div>

              <div class="footer">
                <p>Questions? Reply to this email or call us.</p>
                <p>© 2026 Stilly.Barb - Premium Barbershop</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email sent to ${email}`);
    } catch (error) {
      console.error('Email sending error:', error);
      throw error;
    }
  }
}

export default new EmailService();
