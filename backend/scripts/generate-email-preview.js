import fs from 'fs';
import path from 'path';

const labels = {
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

const sample = {
  name: 'Nikola Ivanov',
  email: 'niko1bgvr@gmail.com',
  phone: '0123456789',
  service: 'Бъзкъм Фейд',
  serviceDuration: 30,
  servicePrice: 12.0,
  date: 'Сряда, 27 май 2026 г.',
  time: '14:30',
  notes: 'Това е потвърдителен имейл.',
  totalPrice: 12.0
};

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { margin: 0; padding: 0; background: #f3f4f6; font-family: "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif; color: #0f172a; }
    .wrapper { width: 100%; padding: 20px 12px; box-sizing: border-box; }
    .card { max-width: 720px; margin: 0 auto; background: #ffffff; border: 1px solid #e6e9ee; border-radius: 16px; box-shadow: 0 20px 60px rgba(2,6,23,0.08); overflow: hidden; }
    .header { background: #8a8f99; color: #ffffff; text-align: center; padding: 28px 18px 22px; }
    .check { width: 56px; height: 56px; border-radius: 999px; background: #ffffff; color: #7b8794; display: inline-block; line-height: 56px; font-size: 28px; font-weight: 700; margin-bottom: 12px; }
    .title { margin: 0; font-size: 20px; line-height: 1.28; font-weight: 700; letter-spacing: 0.2px; word-break: break-word; white-space: normal; overflow-wrap: anywhere; }
    .subtitle { margin: 8px 0 0; font-size: 13px; line-height: 1.4; color: rgba(255,255,255,0.92); }
    .content { padding: 18px 16px 22px; }
    .section-title { margin: 0 0 12px; font-size: 17px; line-height: 1.25; font-weight: 800; color: #0f172a; }
    .detail { display: block; background: #fbfbfc; border: 1px solid #eef2f6; padding: 12px; margin-bottom: 12px; border-radius: 12px; }
    .label { font-size: 11px; line-height: 1.2; color: #6b7280; margin-bottom: 4px; }
    .value { font-size: 16px; line-height: 1.35; color: #0f172a; font-weight: 700; word-break: break-word; white-space: normal; overflow-wrap: anywhere; }
    .subvalue { font-size: 13px; line-height: 1.4; color: #475569; margin-top: 4px; }
    .total { margin-top: 14px; border-radius: 10px; border: 1px solid #e6e9ee; background: #f8fafc; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; font-weight: 800; }
    .note { margin-top: 16px; padding: 12px 14px; background: #f1f5f9; border: 1px solid #e2e8f0; color: #0f172a; font-size: 13px; line-height: 1.4; border-radius: 10px; }
    .muted { color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
        <div class="header">
        <div class="check">✓</div>
        <h1 class="title" style="margin:0;font-size:20px;line-height:1.38;font-weight:700;letter-spacing:0.2px;word-break:break-word;white-space:normal;overflow-wrap:anywhere">${labels.title}</h1>
        <p class="subtitle" style="margin:8px 0 0;font-size:13px;line-height:1.4;color:rgba(255,255,255,0.92)">${labels.subtitle}</p>
      </div>
      <div class="content">
        <h2 class="section-title">${labels.details}</h2>
        <div class="detail"><div class="label">${labels.fullName}</div><div class="value">${sample.name}</div></div>
        <div class="detail"><div class="label">${labels.email}</div><div class="value">${sample.email}</div></div>
        <div class="detail"><div class="label">${labels.phone}</div><div class="value">${sample.phone}</div></div>
        <div class="detail"><div class="label">${labels.service}</div><div class="value" style="white-space:normal;overflow-wrap:anywhere;line-height:1.28">${sample.service}</div><div class="subvalue" style="line-height:1.28">${sample.serviceDuration} мин • € ${sample.servicePrice.toFixed(2)}</div></div>
        <div class="total"><span>${labels.totalPrice}:&nbsp;</span><span>€ ${sample.totalPrice.toFixed(2)}</span></div>
        <div class="muted" style="margin-top:8px;">Общо време: ${sample.serviceDuration} мин</div>
        <div class="note"><strong>${labels.confirmationNote}</strong> ${labels.confirmationEmailNote(sample.email)}</div>
      </div>
    </div>
  </div>
</body>
</html>`;

const outPath = path.join(process.cwd(), 'backend', 'tmp', 'latest-email.html');
try {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, 'utf8');
  console.log('Wrote preview to', outPath);
} catch (err) {
  console.error('Failed to write preview:', err);
}

process.exit(0);
