-- Migration: create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  customer_name TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  service_name TEXT,
  service_duration INTEGER,
  service_price NUMERIC(10,2),
  addons JSONB,
  addon_names TEXT[],
  addon_details JSONB,
  total_duration INTEGER,
  total_price NUMERIC(10,2),
  language VARCHAR(16),
  date DATE,
  time TIME,
  notes TEXT,
  status VARCHAR(32) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments (date);

CREATE INDEX IF NOT EXISTS idx_appointments_email ON appointments (email);