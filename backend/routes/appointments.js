import express from 'express';
import db from '../database/db.js';
import emailService from '../services/emailService.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const safeString = (value, maxLength = 255) => {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
};

// Get all appointments
router.get('/', (req, res) => {
  try {
    const appointments = db.getAll();
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Get appointment by ID
router.get('/:id', (req, res) => {
  try {
    const appointment = db.getById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ error: 'Failed to fetch appointment' });
  }
});

// Create new appointment
router.post('/', async (req, res) => {
  try {
    const {
      customerName,
      email,
      phone,
      service,
      serviceName,
      serviceDuration,
      servicePrice,
      addons,
      addonNames,
      addonDetails,
      totalDuration,
      totalPrice,
      language,
      date,
      time,
      notes
    } = req.body;
    
    const normalizedCustomerName = safeString(customerName, 120);
    const normalizedEmail = safeString(email, 160).toLowerCase();
    const normalizedPhone = safeString(phone, 40);
    const normalizedService = safeString(service, 80);
    const normalizedServiceName = safeString(serviceName || service, 120);
    const normalizedServiceDuration = Number.isFinite(Number(serviceDuration)) ? Number(serviceDuration) : null;
    const normalizedServicePrice = Number.isFinite(Number(servicePrice)) ? Number(servicePrice) : null;
    const normalizedDate = safeString(date, 20);
    const normalizedTime = safeString(time, 10);
    const normalizedNotes = safeString(notes || '', 1000);
    const normalizedLanguage = safeString(language || 'bg', 8) || 'bg';

    // Validation
    if (!normalizedCustomerName || !normalizedEmail || !normalizedPhone || !normalizedService || !normalizedDate || !normalizedTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const normalizedAddons = Array.isArray(addons) ? addons.map((addon) => safeString(addon, 80)).filter(Boolean) : [];
    const normalizedAddonNames = Array.isArray(addonNames) ? addonNames.map((addon) => safeString(addon, 120)).filter(Boolean) : [];
    const normalizedAddonDetails = Array.isArray(addonDetails)
      ? addonDetails.map((addon) => ({
          id: safeString(addon?.id, 80),
          name: safeString(addon?.name, 120),
          duration: Number.isFinite(Number(addon?.duration)) ? Number(addon.duration) : 0,
          price: Number.isFinite(Number(addon?.price)) ? Number(addon.price) : 0
        })).filter((addon) => addon.id && addon.name)
      : [];
    const normalizedTotalDuration = Number.isFinite(Number(totalDuration)) ? Number(totalDuration) : null;
    const normalizedTotalPrice = Number.isFinite(Number(totalPrice)) ? Number(totalPrice) : null;

    const id = uuidv4();
    const newAppointment = {
      id,
      name: normalizedCustomerName,
      customer_name: normalizedCustomerName,
      email: normalizedEmail,
      phone: normalizedPhone,
      service: normalizedService,
      service_name: normalizedServiceName,
      service_duration: normalizedServiceDuration,
      service_price: normalizedServicePrice,
      addons: normalizedAddons,
      addon_names: normalizedAddonNames,
      addon_details: normalizedAddonDetails,
      total_duration: normalizedTotalDuration,
      total_price: normalizedTotalPrice,
      language: normalizedLanguage,
      date: normalizedDate,
      time: normalizedTime,
      notes: normalizedNotes,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    db.create(newAppointment);

    // Send confirmation email
    try {
      await emailService.sendConfirmationEmail({
        customerName: normalizedCustomerName,
        phone: normalizedPhone,
        email: normalizedEmail,
        service: normalizedServiceName,
        serviceDuration: normalizedServiceDuration,
        servicePrice: normalizedServicePrice,
        addons: normalizedAddonNames,
        addonDetails: normalizedAddonDetails,
        totalDuration: normalizedTotalDuration,
        totalPrice: normalizedTotalPrice,
        language: normalizedLanguage,
        date: normalizedDate,
        time: normalizedTime
      });
      console.log(`✅ Confirmation email sent to ${normalizedEmail}`);
    } catch (emailError) {
      console.error('Failed to send email:', emailError.message);
      // Don't fail the request if email fails
    }

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// Delete appointment
router.delete('/:id', (req, res) => {
  try {
    const deleted = db.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});

// Update appointment status
router.patch('/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updated = db.update(req.params.id, { status });

    if (!updated) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

export default router;
