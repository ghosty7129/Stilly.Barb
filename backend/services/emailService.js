import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const formatMoney = (value) => {
  const number = Number(value || 0);
  return `€${number.toFixed(2)}`;
};

const formatDateLabel = (date, language = 'bg') => {
  if (!date) return '';

  const locale = language === 'bg' ? 'en-US' : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(date));
};

const getLabels = (language = 'bg') => {
  if (language === 'en') {
    return {
      title: 'Your appointment is confirmed!',
      subtitle: 'Thank you for booking with us. We look forward to seeing you!',
      details: 'Appointment Details',
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone Number',
      service: 'Service',
      addons: 'Add-ons',
      dateTime: 'Date & Time',
      notes: 'Additional Notes',
      totalPrice: 'Total Price',
      confirmationNote: 'Note:',
      confirmationEmailNote: (email) => `A confirmation email has been sent to ${email}. Please arrive 5 minutes early for your appointment.`
    };
  }

  return {
    title: 'Вашата среща е потвърдена!',
    subtitle: 'Благодарим, че резервирахте с нас. Ние се надяваме да се видим!',
    details: 'Детайли на срещата',
    fullName: 'Пълно име',
    email: 'Имейл',
    phone: 'Телефонен номер',
    service: 'Услуги',
    addons: 'Добавки',
    dateTime: 'Дата и час',
    notes: 'Допълнителни бележки',
    totalPrice: 'Обща цена',
    confirmationNote: 'Бележка:',
    confirmationEmailNote: (email) => `Потвърдителен имейл е изпратен до ${email}. Моля, елате 5 минути по-рано за вашия час.`
  };
};

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

  async sendConfirmationEmail({
    customerName,
    email,
    service,
    serviceDuration,
    servicePrice,
    addons = [],
    addonDetails = [],
    totalDuration,
    totalPrice,
    language = 'bg',
    date,
    time,
    notes = ''
  }) {
    if (!this.enabled) {
      console.log('📧 Email disabled - Would send confirmation to:', email);
      return;
    }

    if (!this.isConfigured) {
      console.warn('📧 Email is enabled but SMTP credentials are placeholders. Set EMAIL_USER and EMAIL_PASSWORD in backend/.env');
      return;
    }

    const labels = getLabels(language);
    const resolvedServiceDuration = Number.isFinite(Number(serviceDuration)) ? Number(serviceDuration) : 0;
    const resolvedServicePrice = Number.isFinite(Number(servicePrice)) ? Number(servicePrice) : 0;
    const normalizedAddons = addonDetails.length > 0
      ? addonDetails
      : addons.map((addonName) => ({ name: addonName, duration: 0, price: 0 }));

    const resolvedTotalDuration = Number.isFinite(Number(totalDuration))
      ? Number(totalDuration)
      : resolvedServiceDuration + normalizedAddons.reduce((sum, addon) => sum + Number(addon.duration || 0), 0);
    const resolvedTotalPrice = Number.isFinite(Number(totalPrice))
      ? Number(totalPrice)
      : resolvedServicePrice + normalizedAddons.reduce((sum, addon) => sum + Number(addon.price || 0), 0);

    const addonNames = normalizedAddons.map((addon) => escapeHtml(addon.name)).join(', ');
    const formattedDate = formatDateLabel(date, language);
    const formattedTime = escapeHtml(time);
    const safeName = escapeHtml(customerName);
    const safeEmail = escapeHtml(email);
    const safeService = escapeHtml(service);
    const safeNotes = escapeHtml(notes);
    const totalDurationLabel = resolvedTotalDuration > 0 ? `${resolvedTotalDuration} min` : '';

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: language === 'en'
        ? '✂️ Appointment Confirmation - Stilly.Barb'
        : '✂️ Потвърждение на резервация - Stilly.Barb',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body { margin: 0; padding: 0; background: #f4f4f5; font-family: Arial, Helvetica, sans-serif; color: #111827; }
            .wrapper { width: 100%; padding: 32px 16px; box-sizing: border-box; }
            .card { max-width: 640px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; box-shadow: 0 20px 45px rgba(0,0,0,0.12); }
            .header { background: #8a8f99; color: #ffffff; text-align: center; padding: 40px 24px 28px; }
            .check { width: 56px; height: 56px; border-radius: 999px; background: #ffffff; color: #6b7280; display: inline-block; line-height: 56px; font-size: 30px; font-weight: bold; margin-bottom: 16px; }
            .title { margin: 0; font-size: 24px; line-height: 1.2; font-weight: 700; }
            .subtitle { margin: 8px 0 0; font-size: 14px; line-height: 1.5; color: rgba(255,255,255,0.92); }
            .content { padding: 24px 20px 28px; }
            .section-title { margin: 0 0 16px; font-size: 20px; line-height: 1.25; font-weight: 700; color: #111827; }
            .detail { display: flex; align-items: flex-start; gap: 12px; background: #f9fafb; border: 1px solid #eef0f3; padding: 12px; margin-bottom: 10px; }
            .icon { width: 36px; height: 36px; flex: 0 0 36px; background: #eef2ff; color: #6b7280; text-align: center; line-height: 36px; font-size: 16px; }
            .label { font-size: 11px; line-height: 1.2; color: #6b7280; margin-bottom: 2px; }
            .value { font-size: 14px; line-height: 1.35; color: #111827; font-weight: 700; }
            .subvalue { font-size: 12px; line-height: 1.4; color: #4b5563; margin-top: 2px; }
            .total { margin-top: 14px; border: 1px solid #9ca3af; background: #e5e7eb; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; font-weight: 700; }
            .total span:last-child { font-size: 18px; color: #6b7280; }
            .note { margin-top: 18px; padding: 14px 16px; background: #eff6ff; border: 1px solid #bfdbfe; color: #1e3a8a; font-size: 12px; line-height: 1.5; }
            .muted { color: #6b7280; font-size: 12px; }
            .spacer { height: 2px; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="card">
              <div class="header">
                <div class="check">✓</div>
                <h1 class="title">${escapeHtml(labels.title)}</h1>
                <p class="subtitle">${escapeHtml(labels.subtitle)}</p>
              </div>
              <div class="content">
                <h2 class="section-title">${escapeHtml(labels.details)}</h2>

                <div class="detail">
                  <div class="icon">👤</div>
                  <div>
                    <div class="label">${escapeHtml(labels.fullName)}</div>
                    <div class="value">${safeName}</div>
                  </div>
                </div>

                <div class="detail">
                  <div class="icon">✉</div>
                  <div>
                    <div class="label">${escapeHtml(labels.email)}</div>
                    <div class="value">${safeEmail}</div>
                  </div>
                </div>

                <div class="detail">
                  <div class="icon">☎</div>
                  <div>
                    <div class="label">${escapeHtml(labels.phone)}</div>
                    <div class="value">${escapeHtml(phone)}</div>
                  </div>
                </div>

                <div class="detail">
                  <div class="icon">◌</div>
                  <div>
                    <div class="label">${escapeHtml(labels.service)}</div>
                    <div class="value">${safeService}</div>
                    <div class="subvalue">${resolvedServiceDuration ? `${resolvedServiceDuration} minutes` : ''}${resolvedServiceDuration ? ' • ' : ''}${formatMoney(resolvedServicePrice)}</div>
                  </div>
                </div>

                ${normalizedAddons.length > 0 ? `
                <div class="detail">
                  <div class="icon">◌</div>
                  <div>
                    <div class="label">${escapeHtml(labels.addons)}</div>
                    <div class="value">${addonNames}</div>
                  </div>
                </div>
                ` : ''}

                <div class="detail" style="border: 1px solid #4b5563; background: #f3f4f6;">
                  <div class="icon">🗓</div>
                  <div>
                    <div class="label">${escapeHtml(labels.dateTime)}</div>
                    <div class="value">${escapeHtml(formattedDate)}</div>
                    <div class="subvalue">${formattedTime}</div>
                  </div>
                </div>

                ${safeNotes ? `
                <div class="detail">
                  <div class="icon">📝</div>
                  <div>
                    <div class="label">${escapeHtml(labels.notes)}</div>
                    <div class="value" style="font-weight: 600;">${safeNotes}</div>
                  </div>
                </div>
                ` : ''}

                <div class="total">
                  <span>${escapeHtml(labels.totalPrice)}:</span>
                  <span>${formatMoney(resolvedTotalPrice)}</span>
                </div>

                ${resolvedTotalDuration ? `<div class="muted" style="margin-top: 8px;">${language === 'en' ? 'Total duration' : 'Общо време'}: ${totalDurationLabel}</div>` : ''}

                <div class="note">
                  <strong>${escapeHtml(labels.confirmationNote)}</strong> ${escapeHtml(labels.confirmationEmailNote(email))}
                </div>
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
