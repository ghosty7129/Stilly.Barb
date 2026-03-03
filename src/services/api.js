const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * API Service for managing appointments
 */
class AppointmentAPI {
  /**
   * Fetch all appointments
   */
  async getAllAppointments() {
    try {
      const response = await fetch(`${API_URL}/appointments`);
      if (!response.ok) throw new Error('Failed to fetch appointments');
      return await response.json();
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }
  }

  /**
   * Get appointments for a specific date
   */
  async getAppointmentsByDate(date) {
    try {
      const allAppointments = await this.getAllAppointments();
      return allAppointments.filter(apt => apt.date === date);
    } catch (error) {
      console.error('Error fetching appointments by date:', error);
      return [];
    }
  }

  /**
   * Create a new appointment
   */
  async createAppointment(appointmentData) {
    try {
      const response = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create appointment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }

  /**
   * Delete an appointment
   */
  async deleteAppointment(id) {
    try {
      const response = await fetch(`${API_URL}/appointments/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete appointment');
      return await response.json();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  }

  /**
   * Get a single appointment by ID
   */
  async getAppointment(id) {
    try {
      const response = await fetch(`${API_URL}/appointments/${id}`);
      if (!response.ok) throw new Error('Appointment not found');
      return await response.json();
    } catch (error) {
      console.error('Error fetching appointment:', error);
      throw error;
    }
  }
}

export const appointmentAPI = new AppointmentAPI();
