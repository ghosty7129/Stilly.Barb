import { list, put } from '@vercel/blob';

const APPOINTMENTS_PATH = 'appointments/appointments.json';
let appointments = [];

const fetchBlobJson = async (url) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`
    }
  });

  if (!response.ok) {
    throw new Error(`Blob fetch failed (${response.status})`);
  }

  return response.json();
};

async function initializeDatabase() {
  try {
    const { blobs } = await list({ prefix: APPOINTMENTS_PATH, limit: 1 });

    if (!blobs || blobs.length === 0) {
      appointments = [];
      console.log('✅ Database initialized (empty Blob)');
      return;
    }

    const blobData = await fetchBlobJson(blobs[0].url);
    appointments = Array.isArray(blobData) ? blobData : [];
    console.log(`✅ Loaded ${appointments.length} appointments from Vercel Blob`);
  } catch (error) {
    console.error('Error loading database from Vercel Blob:', error);
    appointments = [];
  }
}

const saveToBlob = async () => {
  try {
    await put(APPOINTMENTS_PATH, JSON.stringify(appointments, null, 2), {
      access: 'private',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true
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
