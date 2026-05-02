CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY,
  name VARCHAR(120),
  customer_name VARCHAR(120),
  email VARCHAR(160),
  phone VARCHAR(40),
  service VARCHAR(80),
  service_name VARCHAR(120),
  service_duration INTEGER,
  service_price DECIMAL(10, 2),
  addons TEXT[] DEFAULT '{}',
  addon_names TEXT[] DEFAULT '{}',
  addon_details JSONB DEFAULT '[]',
  total_duration INTEGER,
  total_price DECIMAL(10, 2),
  language VARCHAR(8),
  date VARCHAR(20),
  time VARCHAR(10),
  notes TEXT,
  status VARCHAR(30) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_phone ON appointments(phone);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON appointments(created_at DESC);
