import emailService from '../services/emailService.js';
import dotenv from 'dotenv';

dotenv.config();

(async function run() {
  try {
    const target = process.env.TEST_EMAIL_RECIPIENT || process.env.EMAIL_USER || 'barbershopunusual@gmail.com';

    console.log('Using RESEND_API_KEY:', !!process.env.RESEND_API_KEY);
    console.log('Sending test email to:', target);

    await emailService.sendConfirmationEmail({
      customerName: 'Script Test',
      email: target,
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
      notes: 'This is a test email sent from send-test-email.js (Resend test)'
    });

    console.log('✅ send-test-email: email send attempted.');
    // Allow pending handles to close gracefully before exiting
    setTimeout(() => process.exit(0), 200);
  } catch (err) {
    console.error('❌ send-test-email failed:', err && err.message ? err.message : err);
    setTimeout(() => process.exit(1), 200);
  }
})();
