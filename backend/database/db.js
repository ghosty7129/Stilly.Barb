import { kv } from '@vercel/kv';

const APPOINTMENTS_KEY = 'appointments';

// Initialize database
let appointments = [];

// Load from Vercel KV on startup
async function initializeDatabase() {
  try {
    const data = await kv.get(APPOINTMENTS_KEY);
    if (data) {
      appointments = Array.isArray(data) ? data : [];
      console.log(`✅ Loaded ${appointments.length} appointments from Vercel KV`);
    } else {
      appointments = [];
      console.log('✅ Database initialized (empty)');
    }
  } catch (error) {
    console.error('Error loading database from Vercel KV:', error);
    appointments = [];
  }
}

// Save to Vercel KV
const saveToKV = async () => {
  try {
    await kv.set(APPOINTMENTS_KEY, appointments);
  } catch (error) {
    console.error('Error saving database to Vercel KV:', error);
  }
};

// Database operations
const db = {
    // Initialize on startup
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
    await saveToKV();
    return appointment;
  },

  // Delete appointment
  delete: async (id) => {
    const index = appointments.findIndex(apt => apt.id === id);
    if (index !== -1) {
      appointments.splice(index, 1);
      await saveToKV();
      return true;
    }
    return false;
  },

  // Update appointment
  update: async (id, updates) => {
    const index = appointments.findIndex(apt => apt.id === id);
    if (index !== -1) {
      appointments[index] = { ...appointments[index], ...updates };
      await saveToKV();
      return appointments[index];
    }
    return null;
  }
};

export default db;
