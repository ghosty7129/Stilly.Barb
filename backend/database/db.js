import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_FILE = path.join(__dirname, 'appointments.json');
const VACATIONS_FILE = path.join(__dirname, 'vacations.json');

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

// Vacations (file-based mirror of the Postgres `vacations` table)
let vacations = [];

if (fs.existsSync(VACATIONS_FILE)) {
  try {
    vacations = JSON.parse(fs.readFileSync(VACATIONS_FILE, 'utf8'));
  } catch (error) {
    console.error('Error loading vacations:', error);
    vacations = [];
  }
} else {
  fs.writeFileSync(VACATIONS_FILE, JSON.stringify([], null, 2));
}

const saveVacations = () => {
  try {
    fs.writeFileSync(VACATIONS_FILE, JSON.stringify(vacations, null, 2));
  } catch (error) {
    console.error('Error saving vacations:', error);
  }
};

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
  },

  // --- Vacations ---
  getAllVacations: () => {
    return [...vacations].sort((a, b) => a.startDate.localeCompare(b.startDate));
  },

  createVacation: (vacation) => {
    vacations.push(vacation);
    saveVacations();
    return vacation;
  },

  removeVacation: (id) => {
    const index = vacations.findIndex(v => v.id === id);
    if (index !== -1) {
      vacations.splice(index, 1);
      saveVacations();
      return true;
    }
    return false;
  }
};

export default db;
