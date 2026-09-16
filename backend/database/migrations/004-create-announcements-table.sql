CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY,
  title_bg TEXT,
  title_en TEXT,
  message_bg TEXT,
  message_en TEXT,
  style VARCHAR(20) DEFAULT 'banner',
  active BOOLEAN DEFAULT TRUE,
  start_date VARCHAR(20),
  end_date VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_announcements_active ON announcements(active);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON announcements(created_at);
