import { Resend } from 'resend';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const formatMoney = (value) => {
  const number = Number(value || 0);
  return `€ ${number.toFixed(2)}`;
};

const capitalizeFirstLetter = (text, locale = 'en-US') => {
  if (!text) return '';
  return text.charAt(0).toLocaleUpperCase(locale) + text.slice(1);
};

const formatDateLabel = (date, language = 'bg') => {
  if (!date) return '';

  const locale = language === 'bg' ? 'bg-BG' : 'en-US';
  const formatted = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(date));

  return capitalizeFirstLetter(formatted, locale);
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
    subtitle: 'Благодарим, че резервирахте час при нас. Ще се видим скоро!',
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
    confirmationEmailNote: (email) => `Това е потвърдителен имейл изпратен до ${email}. Моля, елате 5 минути по-рано за вашия час.`
  };
};

class EmailService {
  constructor() {
    this.enabled = process.env.EMAIL_ENABLED === 'true';
    this.isConfigured =
      !!process.env.RESEND_API_KEY &&
      process.env.RESEND_API_KEY !== 'your-resend-api-key';

    console.log('[EmailService] Initializing...');
    console.log('[EmailService] EMAIL_ENABLED:', process.env.EMAIL_ENABLED);
    console.log('[EmailService] RESEND_API_KEY present:', !!process.env.RESEND_API_KEY);
    console.log('[EmailService] RESEND_API_KEY prefix:', process.env.RESEND_API_KEY
      ? process.env.RESEND_API_KEY.slice(0, 8) + '...'
      : '(none)');
    console.log('[EmailService] isConfigured:', this.isConfigured);

    if (this.enabled && this.isConfigured) {
      try {
        this.resend = new Resend(process.env.RESEND_API_KEY);
        console.log('[EmailService] Resend client created successfully. Type:', typeof this.resend);
      } catch (initError) {
        console.error('[EmailService] Failed to create Resend client:', initError);
        this.resend = null;
      }
    } else {
      console.warn('[EmailService] Resend client NOT created. enabled=%s, isConfigured=%s',
        this.enabled, this.isConfigured);
      this.resend = null;
    }
  }

  async sendConfirmationEmail({
    customerName,
    phone = '',
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
    const previewOnly = process.env.SAVE_EMAIL_PREVIEW === 'true';

    if (!this.enabled && !previewOnly) {
      console.log('📧 Email disabled - Would send confirmation to:', email);
      return;
    }

    if (!this.isConfigured && !previewOnly) {
      console.warn('📧 Email is enabled but RESEND_API_KEY is missing or a placeholder. Set RESEND_API_KEY in backend/.env');
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
    const totalDurationLabel = resolvedTotalDuration > 0 ? `${resolvedTotalDuration} ${language === 'en' ? 'min' : 'мин'}` : '';

    const mailOptions = {
      from: 'Barbershop Unusual <noreply@barbershop-unusual.com>',
      to: email,
      subject: language === 'en'
        ? '✂️ Appointment Confirmation - Barbershop Unusual'
        : '✂️ Потвърждение на резервация - Barbershop Unusual',
      html: `<!doctype html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head><body style="margin:0;padding:0;background:#f3f4f6;font-family:Segoe UI, Helvetica, Arial, sans-serif;color:#0f172a;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f4f6;width:100%;"><tr><td align="center" style="padding:18px 12px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="720" style="width:100%;max-width:720px;background:#ffffff;border:1px solid #e6e9ee;border-radius:12px;overflow:hidden;"><tr><td style="background:#8a8f99;padding:28px 18px 22px;text-align:center;color:#ffffff;"><div style="width:56px;height:56px;border-radius:999px;background:#ffffff;color:#7b8794;display:inline-block;line-height:56px;font-size:28px;font-weight:700;margin-bottom:12px">✓</div><h1 style="margin:0;font-size:20px;line-height:1.34;font-weight:700;color:#ffffff;letter-spacing:0.2px;word-break:break-word;white-space:normal;overflow-wrap:anywhere">${escapeHtml(labels.title)}</h1><p style="margin:8px 0 0;font-size:13px;line-height:1.4;color:rgba(255,255,255,0.92)">${escapeHtml(labels.subtitle)}</p></td></tr><tr><td style="padding:18px 16px 22px;"><h2 style="margin:0 0 12px;font-size:17px;line-height:1.25;font-weight:800;color:#0f172a">${escapeHtml(labels.details)}</h2><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;background:#fbfbfc;border:1px solid #eef2f6;border-radius:12px;"><tr><td style="padding:12px"><div style="font-size:11px;line-height:1.2;color:#6b7280;margin-bottom:4px">${escapeHtml(labels.fullName)}</div><div style="font-size:16px;line-height:1.35;font-weight:700;color:#0f172a;white-space:normal;overflow-wrap:anywhere">${safeName}</div></td></tr></table><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;background:#fbfbfc;border:1px solid #eef2f6;border-radius:12px;"><tr><td style="padding:12px"><div style="font-size:11px;line-height:1.2;color:#6b7280;margin-bottom:4px">${escapeHtml(labels.email)}</div><div style="font-size:16px;line-height:1.35;font-weight:700;color:#0f172a;word-break:break-word;white-space:normal;overflow-wrap:anywhere">${safeEmail}</div></td></tr></table><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;background:#fbfbfc;border:1px solid #eef2f6;border-radius:12px;"><tr><td style="padding:12px"><div style="font-size:11px;line-height:1.2;color:#6b7280;margin-bottom:4px">${escapeHtml(labels.phone)}</div><div style="font-size:16px;line-height:1.35;font-weight:700;color:#0f172a">${escapeHtml(phone)}</div></td></tr></table><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;background:#fbfbfc;border:1px solid #eef2f6;border-radius:12px;"><tr><td style="padding:12px"><div style="font-size:11px;line-height:1.2;color:#6b7280;margin-bottom:4px">${escapeHtml(labels.service)}</div><div style="font-size:18px;line-height:1.18;font-weight:800;color:#0f172a;white-space:normal;overflow-wrap:anywhere">${safeService}</div><div style="font-size:13px;line-height:1.3;color:#475569;margin-top:6px">${resolvedServiceDuration ? `${resolvedServiceDuration} ${language === 'en' ? 'minutes' : 'мин'}` : ''}${resolvedServiceDuration ? ' • ' : ''}${formatMoney(resolvedServicePrice)}</div></td></tr></table><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;background:#f3f4f6;border:1px solid #4b5563;border-radius:12px;"><tr><td style="padding:12px"><div style="font-size:11px;line-height:1.2;color:#6b7280;margin-bottom:4px">${escapeHtml(labels.dateTime)}</div><div style="font-size:16px;line-height:1.35;font-weight:700;color:#0f172a">${escapeHtml(formattedDate)}</div><div style="font-size:13px;line-height:1.3;color:#475569;margin-top:6px">${formattedTime}</div></td></tr></table><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:8px;"><tr><td style="padding:0"><div style="display:block;border-radius:10px;border:1px solid #e6e9ee;background:#f8fafc;padding:14px 16px;font-weight:800;"><span style="font-size:14px;color:#0f172a">${escapeHtml(labels.totalPrice)}:&nbsp;</span><span style="float:right;font-size:18px;color:#7c3aed">${formatMoney(resolvedTotalPrice)}</span><div style="clear:both"></div></div></td></tr></table>${resolvedTotalDuration ? `<div style="margin-top:8px;color:#6b7280;font-size:12px">${language === 'en' ? 'Total duration' : 'Общо време'}: ${totalDurationLabel}</div>` : ''}<div style="margin-top:16px;padding:12px;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:10px;font-size:13px;color:#0f172a;"><strong>${escapeHtml(labels.confirmationNote)}</strong> ${escapeHtml(labels.confirmationEmailNote(email))}</div></td></tr></table></td></tr></table></body></html>`
    };

    console.log('[EmailService] Preparing to send email. mailOptions:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      htmlLength: mailOptions.html ? mailOptions.html.length : 0
    });

    // Optional: save preview HTML locally if requested (useful during development)
    try {
      if (process.env.SAVE_EMAIL_PREVIEW === 'true') {
        const previewPath = new URL('../../backend/tmp/latest-email.html', import.meta.url).pathname.replace(/^\\/,'');
        fs.writeFileSync(previewPath, mailOptions.html, { encoding: 'utf8' });
        console.log('[EmailService] Saved email preview to', previewPath);
      }
    } catch (e) {
      console.warn('[EmailService] Failed to save preview HTML:', e && e.message);
    }

    if (!this.resend) {
      console.error('[EmailService] Cannot send — this.resend is null/undefined. ' +
        'Check that EMAIL_ENABLED=true and RESEND_API_KEY is set correctly.');
      console.warn('No email provider configured.');
      return;
    }

    try {
      console.log('[EmailService] Calling resend.emails.send()...');
      const response = await this.resend.emails.send(mailOptions);
      console.log('[EmailService] Resend API raw response:', JSON.stringify(response));
      if (response && response.error) {
        console.error('[EmailService] Resend returned an error in the response body:', response.error);
        throw new Error(`Resend API error: ${JSON.stringify(response.error)}`);
      }
      console.log(`✅ Email sent (Resend) to ${email}. id=${response && response.data && response.data.id}`);
    } catch (error) {
      console.error('[EmailService] resend.emails.send() threw an exception:');
      console.error('[EmailService] Error name   :', error && error.name);
      console.error('[EmailService] Error message:', error && error.message);
      console.error('[EmailService] Error status :', error && error.statusCode);
      console.error('[EmailService] Full error   :', error);
      throw error;
    }
  }
}

export default new EmailService();
