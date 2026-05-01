import emailService from '../services/emailService.js';

(async function run() {
  try {
    await emailService.sendConfirmationEmail({
      customerName: 'Script Test',
      email: process.env.EMAIL_USER || 'barbershopunusual@gmail.com',
      phone: '0881234567',
      service: 'Automated Test Service',
      serviceDuration: 15,
      servicePrice: 0,
      addons: [],
      addonDetails: [],
      totalDuration: 15,
      totalPrice: 0,
      language: 'bg',
      date: new Date().toISOString(),
      time: '12:00',
      notes: 'This is a test email sent from send-test-email.js'
    });

    console.log('✅ send-test-email: email send attempted.');
    process.exit(0);
  } catch (err) {
    console.error('❌ send-test-email failed:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
