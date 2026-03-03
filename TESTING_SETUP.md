# 🚀 Complete Setup Guide - Testing Backend + Email + Analytics

## What's Been Set Up

✅ **Backend API Server** (Express + SQLite)
✅ **Email Notifications** (Nodemailer with Gmail)
✅ **Google Analytics** (Page tracking + event tracking)
✅ **Database** (SQLite for easy testing)

---

## Quick Start (2 Commands)

### 1. Install & Start Backend

```powershell
cd backend
npm install
npm start
```

Backend runs on http://localhost:5000

### 2. Start Frontend (in a new terminal)

```powershell
npm run dev
```

Frontend runs on http://localhost:3000

---

## ✉️ Email Notifications Setup

### Option A: Testing WITHOUT Email (Recommended for Now)

Emails are **already disabled** by default. The system will:

- Log email info to console
- Work perfectly without sending actual emails
- Show `📧 [Test Mode]` messages in terminal

### Option B: Enable Real Emails (When Ready)

1. **Create Gmail App Password**
   - Go to: https://myaccount.google.com/security
   - Enable 2-Factor Authentication
   - Go to: https://myaccount.google.com/apppasswords
   - Generate new app password

2. **Update Backend Configuration**

   Edit `backend/.env`:

   ```env
   EMAIL_ENABLED=true
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   ```

3. **Restart Backend Server**
   ```powershell
   cd backend
   npm start
   ```

---

## 📊 Google Analytics Setup

### Option A: Testing WITHOUT Analytics (Current Setup)

Analytics is already configured to work in **test mode**:

- Console logs all events
- No tracking ID needed
- Shows `📊 [Test Mode]` messages

### Option B: Enable Real Analytics (When Ready)

1. **Create Google Analytics Account**
   - Go to: https://analytics.google.com
   - Create new property
   - Get Measurement ID (format: `G-XXXXXXXXXX`)

2. **Update Frontend Configuration**

   Edit `.env` in project root:

   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

3. **Restart Frontend**
   ```powershell
   npm run dev
   ```

---

## 🧪 Testing the System

### Test Booking Flow

1. Open http://localhost:3000
2. Click "Book Appointment"
3. Fill out the form:
   - Name, Email, Phone
   - Select Service
   - Pick Date & Time
   - Submit

4. **What Happens:**
   - ✅ Data saved to SQLite database
   - ✅ Email notification attempted (see console)
   - ✅ Analytics tracked (see console)
   - ✅ Redirect to confirmation page

### Test Admin Panel

1. Go to http://localhost:3000/admin
2. Login:
   - Username: `admin`
   - Password: `password123`

   ⚠️ **MUST CHANGE THIS** before production!

3. View all bookings
4. Delete test bookings

### Check Backend Logs

Backend terminal shows:

```
📧 Email disabled - Would send confirmation to: test@example.com
📊 [Test Mode] Event: booking_created
✅ Confirmation email sent to test@example.com
```

---

## 📁 Project Structure

```
Barber-Website/
├── backend/                    # Backend server
│   ├── database/
│   │   └── db.js              # SQLite setup
│   ├── routes/
│   │   └── appointments.js    # API endpoints
│   ├── services/
│   │   └── emailService.js    # Email functionality
│   ├── server.js              # Main server
│   ├── .env                   # Configuration
│   └── package.json
│
├── src/
│   ├── services/
│   │   ├── api.js            # API client
│   │   └── analytics.js      # Google Analytics
│   ├── store/
│   │   └── bookingStore.js   # State management (updated)
│   └── pages/
│       ├── Booking.jsx       # Booking form (updated)
│       └── Admin.jsx         # Admin panel (updated)
│
└── .env                       # Frontend config
```

---

## 🔧 Configuration Files

### Backend: `backend/.env`

```env
PORT=5000
EMAIL_ENABLED=false            # Set to 'true' to enable emails
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Frontend: `.env` (root folder)

```env
VITE_API_URL=http://localhost:5000/api
VITE_GA_MEASUREMENT_ID=        # Add your GA ID here
```

---

## 🎯 What Works RIGHT NOW

✅ Complete booking system
✅ Backend database storage
✅ Email system (ready, just disabled)
✅ Analytics system (ready, just in test mode)
✅ Admin panel
✅ Appointment management

## 🚀 For Production Launch

Before deploying with your domain:

1. **Change Admin Password** - Edit `src/pages/Admin.jsx`
2. **Enable Emails** - Follow "Option B" above
3. **Add Google Analytics** - Follow "Option B" above
4. **Deploy Backend** - Use Railway, Render, or Heroku
5. **Deploy Frontend** - Use Vercel or Netlify
6. **Update API URL** - Change `VITE_API_URL` to production URL

---

## 🆘 Troubleshooting

### Backend won't start

```powershell
cd backend
Remove-Item node_modules -Recurse -Force
npm install
```

### Port 5000 in use

Edit `backend/.env`:

```env
PORT=5001
```

### Frontend can't connect to backend

Check:

1. Backend is running (terminal shows "Backend server running")
2. `.env` has correct `VITE_API_URL`
3. Restart frontend after changing `.env`

### Email not sending

- Check `EMAIL_ENABLED=true` in `backend/.env`
- Verify Gmail app password (16 characters, no spaces)
- Check terminal for error messages
- Look in Gmail spam folder

---

## ✅ Testing Checklist

Run through this before showing to others:

- [ ] Backend starts without errors
- [ ] Frontend loads at http://localhost:3000
- [ ] Can create a booking
- [ ] Booking appears in admin panel
- [ ] Can delete booking from admin
- [ ] Console shows analytics events
- [ ] Console shows email logs

---

## 📞 Quick Reference

**Start Backend:**

```powershell
cd backend; npm start
```

**Start Frontend:**

```powershell
npm run dev
```

**Reset Database:**

```powershell
cd backend; Remove-Item database/appointments.db; npm start
```

**Check API:**

```powershell
curl http://localhost:5000/api/health
```

---

You're all set! The system is ready for testing. Everything works, but emails and analytics are in "test mode" so you can see what they'd do without actually sending/tracking yet.
