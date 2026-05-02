CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert the hardcoded admin user
INSERT INTO admin_users (username, password_hash)
VALUES ('barber_admin', '$2b$10$lKQn4.BFtzsxNQ28NBzp6eXcghqs4yQmGUNB9nq8iVNEmDPu4jOTa')
ON CONFLICT (username) DO NOTHING;
