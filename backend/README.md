# Backend Server Setup

This backend provides API endpoints for the Stilly.Barb booking system.

## Features

- ✅ SQLite database for storing appointments
- ✅ Email notifications (Gmail SMTP)
- ✅ RESTful API endpoints
- ✅ CORS enabled for frontend integration

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### 3. Email Configuration (Optional for Testing)

To enable email notifications:

1. Use a Gmail account
2. Enable 2-factor authentication
3. Generate an App Password: https://support.google.com/accounts/answer/185833
4. Update `.env`:

```env
EMAIL_ENABLED=true
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-google-app-password
```

For testing without emails, leave `EMAIL_ENABLED=false`

### 4. Start the Server

```bash
npm start
```

Or with auto-reload during development:

```bash
npm run dev
```

The server will run on http://localhost:5000

## API Endpoints

### Get All Appointments

```
GET /api/appointments
```

### Get Single Appointment

```
GET /api/appointments/:id
```

### Create Appointment

```
POST /api/appointments
Content-Type: application/json

{
  "customerName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "service": "fade",
  "date": "2026-03-15",
  "time": "14:00",
  "notes": "Optional notes"
}
```

### Delete Appointment

```
DELETE /api/appointments/:id
```

### Update Appointment Status

```
PATCH /api/appointments/:id/status
Content-Type: application/json

{
  "status": "confirmed"
}
```

## Database

SQLite database is automatically created at `backend/database/appointments.db`

## Production Deployment

For production, consider:

1. Using PostgreSQL instead of SQLite
2. Adding authentication/authorization
3. Rate limiting
4. HTTPS
5. Environment-based configuration
6. Hosting on: Heroku, Railway, Render, or AWS

## Troubleshooting

**Port already in use:**

```bash
# Change PORT in .env file
PORT=5001
```

**Email not sending:**

- Verify EMAIL_ENABLED=true
- Check Gmail app password
- Check spam folder
- Review server logs for errors

**Database errors:**

- Delete `appointments.db` and restart server
- Database will be recreated automatically
