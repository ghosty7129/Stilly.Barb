/**
 * Database Schema for Appointments System
 * 
 * This is a production-ready schema design for PostgreSQL/MySQL
 * Can be adapted for MongoDB or other databases
 */

export const appointmentsSchema = `
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Barbers table
CREATE TABLE barbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  bio TEXT,
  specialties TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id),
  barber_id UUID REFERENCES barbers(id),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, completed, cancelled
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Ensure no double booking
  UNIQUE(barber_id, appointment_date, appointment_time)
);

-- Working hours table
CREATE TABLE working_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id UUID REFERENCES barbers(id),
  day_of_week INTEGER NOT NULL, -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true
);

-- Blocked dates table (for holidays, etc.)
CREATE TABLE blocked_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id UUID REFERENCES barbers(id),
  blocked_date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_user ON appointments(user_id);
CREATE INDEX idx_appointments_barber ON appointments(barber_id);
CREATE INDEX idx_appointments_status ON appointments(status);
`;

/**
 * Sample API endpoints structure
 */
export const apiEndpoints = {
  // Get available time slots for a specific date
  GET_AVAILABLE_SLOTS: '/api/appointments/available-slots',
  
  // Create new appointment
  CREATE_APPOINTMENT: '/api/appointments',
  
  // Get user's appointments
  GET_USER_APPOINTMENTS: '/api/appointments/user/:userId',
  
  // Update appointment
  UPDATE_APPOINTMENT: '/api/appointments/:appointmentId',
  
  // Cancel appointment
  CANCEL_APPOINTMENT: '/api/appointments/:appointmentId/cancel',
  
  // Admin: Get all appointments
  ADMIN_GET_APPOINTMENTS: '/api/admin/appointments',
  
  // Services
  GET_SERVICES: '/api/services',
  
  // Barbers
  GET_BARBERS: '/api/barbers'
}

/**
 * Sample API service functions
 */
export class AppointmentAPI {
  static async getAvailableSlots(date, serviceId) {
    // In production, this would make an HTTP request
    // For now, returns mock data structure
    return {
      date,
      slots: [
        { time: '09:00', available: true },
        { time: '10:00', available: false },
        { time: '11:00', available: true },
        // ... more slots
      ]
    }
  }
  
  static async createAppointment(appointmentData) {
    // Validate data
    const { userId, serviceId, date, time, notes } = appointmentData
    
    // In production: POST to API
    // const response = await fetch(apiEndpoints.CREATE_APPOINTMENT, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(appointmentData)
    // })
    
    return {
      success: true,
      appointmentId: 'mock-id',
      message: 'Appointment created successfully'
    }
  }
  
  static async cancelAppointment(appointmentId) {
    // In production: DELETE or PUT to API
    return {
      success: true,
      message: 'Appointment cancelled'
    }
  }
}
