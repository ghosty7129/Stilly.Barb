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

const html = `<!doctype html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head><body style="margin:0;padding:0;background:#f3f4f6;font-family:Segoe UI, Helvetica, Arial, sans-serif;color:#0f172a;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f4f6;width:100%;"><tr><td align="center" style="padding:10px 8px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="720" style="width:100%;max-width:720px;background:#ffffff;border:1px solid #e6e9ee;border-radius:10px;overflow:hidden;"><tr><td style="background:#8a8f99;padding:20px 16px 16px;text-align:center;color:#ffffff;"><div style="width:48px;height:48px;border-radius:999px;background:#ffffff;color:#7b8794;display:inline-block;line-height:48px;font-size:24px;font-weight:700;margin-bottom:8px">✓</div><h1 style="margin:0;font-size:18px;line-height:1.3;font-weight:700;color:#ffffff;letter-spacing:0.1px;word-break:break-word;white-space:normal;overflow-wrap:anywhere">${labels.title}</h1><p style="margin:6px 0 0;font-size:12px;line-height:1.35;color:rgba(255,255,255,0.92)">${labels.subtitle}</p></td></tr><tr><td style="padding:12px 12px 14px;"><h2 style="margin:0 0 8px;font-size:15px;line-height:1.2;font-weight:800;color:#0f172a">${labels.details}</h2><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;background:#fbfbfc;border:1px solid #eef2f6;border-radius:10px;"><tr><td style="padding:10px"><div style="font-size:10px;line-height:1.15;color:#6b7280;margin-bottom:2px">${labels.fullName}</div><div style="font-size:15px;line-height:1.3;font-weight:700;color:#0f172a;white-space:normal;overflow-wrap:anywhere">${sample.name}</div></td></tr></table><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;background:#fbfbfc;border:1px solid #eef2f6;border-radius:10px;"><tr><td style="padding:10px"><div style="font-size:10px;line-height:1.15;color:#6b7280;margin-bottom:2px">${labels.email}</div><div style="font-size:14px;line-height:1.3;font-weight:700;color:#0f172a;word-break:break-word;white-space:normal;overflow-wrap:anywhere">${sample.email}</div></td></tr></table><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;background:#fbfbfc;border:1px solid #eef2f6;border-radius:10px;"><tr><td style="padding:10px"><div style="font-size:10px;line-height:1.15;color:#6b7280;margin-bottom:2px">${labels.phone}</div><div style="font-size:15px;line-height:1.3;font-weight:700;color:#0f172a">${sample.phone}</div></td></tr></table><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;background:#fbfbfc;border:1px solid #eef2f6;border-radius:10px;"><tr><td style="padding:10px"><div style="font-size:10px;line-height:1.15;color:#6b7280;margin-bottom:2px">${labels.service}</div><div style="font-size:16px;line-height:1.15;font-weight:800;color:#0f172a;white-space:normal;overflow-wrap:anywhere">${sample.service}</div><div style="font-size:12px;line-height:1.25;color:#475569;margin-top:4px">${sample.serviceDuration} мин • € ${sample.servicePrice.toFixed(2)}</div></td></tr></table><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;background:#fbfbfc;border:1px solid #eef2f6;border-radius:10px;"><tr><td style="padding:10px"><div style="font-size:10px;line-height:1.15;color:#6b7280;margin-bottom:4px">${labels.addons}</div><div style="font-size:13px;line-height:1.2;font-weight:600;color:#0f172a;margin-bottom:2px;white-space:normal;overflow-wrap:anywhere">Прическа Фейд</div><div style="font-size:11px;line-height:1.2;color:#6b7280;margin-bottom:4px">15 мин • € 5.00</div><div style="font-size:13px;line-height:1.2;font-weight:600;color:#0f172a;margin-bottom:2px;white-space:normal;overflow-wrap:anywhere">Перманентна боя</div><div style="font-size:11px;line-height:1.2;color:#6b7280;margin-bottom:4px">30 мин • € 15.00</div></td></tr></table><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;background:#f3f4f6;border:1px solid #4b5563;border-radius:10px;"><tr><td style="padding:10px"><div style="font-size:10px;line-height:1.15;color:#6b7280;margin-bottom:2px">${labels.dateTime}</div><div style="font-size:15px;line-height:1.3;font-weight:700;color:#0f172a">${sample.date}</div><div style="font-size:12px;line-height:1.25;color:#475569;margin-top:2px">${sample.time}</div></td></tr></table><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;"><tr><td style="padding:0"><div style="display:block;border-radius:8px;border:1px solid #e6e9ee;background:#f8fafc;padding:10px 12px;font-weight:800;"><span style="font-size:13px;color:#0f172a">${labels.totalPrice}:&nbsp;</span><span style="float:right;font-size:16px;color:#7c3aed">€ ${(sample.totalPrice).toFixed(2)}</span><div style="clear:both"></div></div></td></tr></table><div style="margin-bottom:8px;color:#6b7280;font-size:11px">Общо време: ${sample.serviceDuration + 45} мин</div><div style="padding:10px;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:8px;font-size:12px;line-height:1.3;color:#0f172a;"><strong>${labels.confirmationNote}</strong> ${labels.confirmationEmailNote(sample.email)}</div></td></tr></table></td></tr></table></body></html>`;

const outPath = path.join(process.cwd(), 'backend', 'tmp', 'latest-email.html');
try {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, 'utf8');
  console.log('Wrote preview to', outPath);
} catch (err) {
  console.error('Failed to write preview:', err);
}

process.exit(0);
