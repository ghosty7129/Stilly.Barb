import { put, get } from '@vercel/blob';

const APPOINTMENTS_KEY = 'appointments.json';
let appointments = [];

async function initializeDatabase() {
  try {
    const blob = await get(APPOINTMENTS_KEY);
    
    if (!blob) {
      appointments = [];
      console.log('✅ Database initialized (empty Blob)');
      return;
    }

    const text = await blob.text();
    const blobData = JSON.parse(text);
    appointments = Array.isArray(blobData) ? blobData : [];
    console.log(`✅ Loaded ${appointments.length} appointments from Vercel Blob`);
  } catch (error) {
    console.error('Error loading database from Vercel Blob:', error);
    appointments = [];
  }
}

const saveToBlob = async () => {
  try {
    await put(APPOINTMENTS_KEY, JSON.stringify(appointments, null, 2), {
      access: 'private',
      contentType: 'application/json'
    });
  } catch (error) {
    console.error('Error saving database to Vercel Blob:', error);
    throw error;
  }
};

// Database operations
const db = {
  initialize: initializeDatabase,

  // Get all appointments
  getAll: () => {
    return appointments;
  },

  // Get appointment by ID
  getById: (id) => {
    return appointments.find(apt => apt.id === id);
  },

  // Create appointment
  create: async (appointment) => {
    appointments.push(appointment);
    await saveToBlob();
    return appointment;
  },

  // Delete appointment
  delete: async (id) => {
    const index = appointments.findIndex(apt => apt.id === id);
    if (index !== -1) {
      appointments.splice(index, 1);
      await saveToBlob();
      return true;
    }
    return false;
  },

  // Update appointment
  update: async (id, updates) => {
    const index = appointments.findIndex(apt => apt.id === id);
    if (index !== -1) {
      appointments[index] = { ...appointments[index], ...updates };
      await saveToBlob();
      return appointments[index];
    }
    return null;
  }
};

export default db;
