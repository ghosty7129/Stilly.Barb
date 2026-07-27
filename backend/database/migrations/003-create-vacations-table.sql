CREATE TABLE IF NOT EXISTS vacations (
  id UUID PRIMARY KEY,
  start_date VARCHAR(20) NOT NULL,
  end_date VARCHAR(20) NOT NULL,
  announce BOOLEAN DEFAULT FALSE,
  message_bg TEXT,
  message_en TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vacations_start_date ON vacations(start_date);
CREATE INDEX IF NOT EXISTS idx_vacations_end_date ON vacations(end_date);
