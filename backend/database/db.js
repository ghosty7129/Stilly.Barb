import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_FILE = path.join(__dirname, 'appointments.json');

// Initialize database
let appointments = [];

// Load from file if exists
if (fs.existsSync(DB_FILE)) {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    appointments = JSON.parse(data);
    console.log(`✅ Loaded ${appointments.length} appointments from database`);
  } catch (error) {
    console.error('Error loading database:', error);
    appointments = [];
  }
} else {
  // Create empty database file
  fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2));
  console.log('✅ Database initialized (empty)');
}

// Save to file
const saveToFile = () => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(appointments, null, 2));
  } catch (error) {
    console.error('Error saving database:', error);
  }
};

// Database operations
const db = {
  // Get all appointments
  getAll: () => {
    return appointments;
  },

  // Get appointment by ID
  getById: (id) => {
    return appointments.find(apt => apt.id === id);
  },

  // Create appointment
  create: (appointment) => {
    appointments.push(appointment);
    saveToFile();
    return appointment;
  },

  // Delete appointment
  delete: (id) => {
    const index = appointments.findIndex(apt => apt.id === id);
    if (index !== -1) {
      appointments.splice(index, 1);
      saveToFile();
      return true;
    }
    return false;
  },

  // Update appointment
  update: (id, updates) => {
    const index = appointments.findIndex(apt => apt.id === id);
    if (index !== -1) {
      appointments[index] = { ...appointments[index], ...updates };
      saveToFile();
      return appointments[index];
    }
    return null;
  }
};

export default db;
