# 🚀 Deployment Guide - Step by Step

Complete this in ~20 minutes to publish your barbershop site online!

---

## 📋 CHECKLIST - Do These First

Before starting deployment, complete these 4 things:

- [ ] Buy a domain (or have one ready) — example: `mybarbershop.com`
- [ ] Create a GitHub account (free) — https://github.com
- [ ] Create a Vercel account (free) — https://vercel.com
- [ ] Create a Render account (free) — https://render.com

---

## ✅ STEP 1: Get Your Code Ready (5 minutes)

### 1.1 → Open Command Line

Press `Win + R`, type:

```
powershell
```

### 1.2 → Navigate to Your Project

```powershell
cd d:\Barber-Website
```

### 1.3 → Initialize Git

```powershell
git init
git add .
git commit -m "Initial commit - barber website"
```

> **If you see an error about "git not found":**
>
> - Download Git: https://git-scm.com/download/win
> - Restart PowerShell after installing

### 1.4 → Verify Everything Works Locally

```powershell
npm run build
```

You should see: ✓ `built in XX.XXs`

---

## 📤 STEP 2: Upload Code to GitHub (5 minutes)

### 2.1 → Go to GitHub

Visit: https://github.com/new

### 2.2 → Create New Repository

Fill in:

- **Repository name:** `barber-website` (or any name)
- **Description:** Optional
- **Public:** Choose this (so Vercel can access it)
- Click **Create repository**

### 2.3 → Copy Commands

GitHub will show you commands. In your PowerShell, run these (replace `YOUR_USERNAME` with your actual GitHub username):

```powershell
git branch -M main
git remote add origin https://github.com/ghosty7129/Stilly.Barb.git
git push -u origin main
```

**Example:**

```powershell
git branch -M main
git remote add origin https://github.com/johndoe/barber-website.git
git push -u origin main
```

> It will ask for your GitHub password — use your **GitHub personal access token** (create here: https://github.com/settings/tokens)
>
> - Click "Generate new token"
> - Check ✓ `repo`
> - Copy the token → paste in PowerShell when asked

### 2.4 → Confirm It Uploaded

Refresh your GitHub repository page — you should see all your files there!

---

## 🌐 STEP 3: Deploy Frontend (Vercel) - 5 minutes

### 3.1 → Sign In to Vercel

Go to: https://vercel.com/login

### 3.2 → Import Project

- Click **"Add New..."** → **"Project"**
- Select your GitHub repository: `barber-website`
- Click **Import**

### 3.3 → Configure Settings

Vercel will show a form:

- **Framework Preset:** Select `Vite` (if asked)
- **Root Directory:** Leave empty (or set to root)
- **Build Command:** Leave as is (should be `npm run build`)
- **Output Directory:** Leave as is (should be `dist`)

Click **Deploy**

### 3.4 → Wait for Deployment

Vercel will show a progress bar. Wait until it says: **"✓ Ready"**

Copy your **frontend URL** — looks like:

```
https://stilly-barb.vercel.app/
```

**SAVE THIS URL!** You'll need it next.

---

## ⚙️ STEP 4: Deploy Backend (Render) - 5 minutes

### 4.1 → Sign In to Render

Go to: https://dashboard.render.com

### 4.2 → Create New Service

- Click **"New +"** → **"Web Service"**
- Click **"Connect repository"**
- Connect your GitHub account (if asked)
- Select: `barber-website`
- Click **"Connect"**

### 4.3 → Configure Service

Fill in the form:

| Field             | Value                       |
| ----------------- | --------------------------- |
| **Name**          | `barber-api`                |
| **Environment**   | `Node`                      |
| **Build Command** | `cd backend && npm install` |
| **Start Command** | `cd backend && npm start`   |

### 4.4 → Add Environment Variables

Scroll down to **Environment** section. Add these variables:

| Key               | Value                                                                    |
| ----------------- | ------------------------------------------------------------------------ |
| `NODE_ENV`        | `production`                                                             |
| `RATE_LIMIT_MAX`  | `200`                                                                    |
| `EMAIL_ENABLED`   | `false`                                                                  |
| `ALLOWED_ORIGINS` | Your Vercel URL from Step 3 → `https://barber-website-abc123.vercel.app` |
| `EMAIL_USER`      | `your-email@gmail.com` (you'll update later)                             |
| `EMAIL_PASSWORD`  | `your-app-password` (you'll update later)                                |

### 4.5 → Deploy

Scroll to bottom → Click **"Create Web Service"**

Wait for Render to build and deploy. Look for: **"✓ Service Started"**

Copy your **backend URL** — looks like:

```
https://stilly-barb.onrender.com/
```

**SAVE THIS URL!** You'll need it next.

---

## 🔗 STEP 5: Connect Frontend to Backend (5 minutes)

### 5.1 → Update Frontend Settings on Vercel

Back on Vercel:

- Go to your project
- Click **Settings** → **Environment Variables**
- Add new variable:
  - **Name:** `VITE_API_URL`
  - **Value:** Your backend URL from Step 4 → `https://barber-api-abc123.onrender.com/api`
  - Click **Save**

### 5.2 → Redeploy Frontend

- Go to **Deployments** tab
- Click the three-dot menu next to latest deployment
- Select **Redeploy**
- Confirm

Wait for ✓ **Ready**

### 5.3 → Update Backend Settings on Render

Go back to Render:

- Click your `barber-api` service
- Click **Environment** → Edit the `ALLOWED_ORIGINS` variable
- Change to your actual Vercel URL: `https://barber-website-abc123.vercel.app`
- Click **Save Changes**

Render will automatically redeploy.

---

## 🧪 STEP 6: Test Your Live Site (2 minutes)

### 6.1 → Open Your Frontend

Click your Vercel URL from Step 3:

```
https://barber-website-abc123.vercel.app
```

### 6.2 → Test Booking

1. Click **"Book Appointment"**
2. Fill in form:
   - Name: `Test User`
   - Email: Your email
   - Phone: Any number
   - Service: Any service
   - Date & Time: Pick any date/time
   - Add-services: Optional
3. Click **Submit**

**Expected:** Redirects to confirmation page ✓

### 6.3 → Test Admin Panel

1. Go to: `https://barber-website-abc123.vercel.app/admin`
2. Login:
   - Username: `admin`
   - Password: `ChangeThisAdminPassword123!`
3. Select a date → See your test booking

**Expected:** Booking appears in list ✓

---

## 🔒 STEP 7: Change Admin Password (Important!)

### 7.1 → Update Password Locally

Edit file: `d:\Barber-Website\.env`

Find:

```
VITE_ADMIN_PASSWORD=ChangeThisAdminPassword123!
```

Change to a **strong password** (example):

```
VITE_ADMIN_PASSWORD=MySecurePassword#2026!
```

### 7.2 → Upload Change to GitHub

In PowerShell:

```powershell
cd d:\Barber-Website
git add .
git commit -m "Update admin password"
git push
```

### 7.3 → Redeploy on Vercel

Vercel will automatically redeploy when code changes.

Wait for ✓ **Ready**

---

## 📧 STEP 8: Enable Email Notifications (Optional - Do Later)

When you're ready to send real booking confirmations:

### 8.1 → Get Gmail App Password

1. Go to: https://myaccount.google.com
2. Click **Security** → **2-Step Verification** (turn on if not enabled)
3. Go to **App passwords**
4. Select **Mail** and **Windows Computer**
5. Google gives you 16-character password → **Copy it**

### 8.2 → Update Environment on Render

Go to Render → Your `barber-api` service → **Environment**

Update:
| Key | Value |
|-----|-------|
| `EMAIL_ENABLED` | `true` |
| `EMAIL_USER` | Your Gmail address |
| `EMAIL_PASSWORD` | 16-char password from step 8.1 |

Click **Save Changes**

Render will redeploy. Emails now send on every booking! ✉️

---

## ✨ DONE!

Your site is now **LIVE** at: `https://barber-website-abc123.vercel.app`

Share this URL with testers for the next 2 weeks!

---

## 🔗 Quick Reference - Your URLs

| Service         | URL                                              | Purpose                  |
| --------------- | ------------------------------------------------ | ------------------------ |
| **Frontend**    | `https://barber-website-abc123.vercel.app`       | Customer booking page    |
| **Admin**       | `https://barber-website-abc123.vercel.app/admin` | Manage bookings          |
| **Backend API** | `https://barber-api-abc123.onrender.com`         | Server (not for browser) |

---

## 🆘 Troubleshooting

### "Booking button doesn't work"

- Check browser console (F12) for errors
- Verify `VITE_API_URL` env variable on Vercel
- Backend URL must NOT have `/api` at the end there

### "Admin login fails"

- Check you're using correct password from `.env`
- Clear browser cache
- Try incognito window

### "Email not sending"

- Verify `EMAIL_ENABLED=true` on Render
- Check Gmail app password is correct (16 chars, no spaces)
- Check spam folder

### Backend service goes to sleep

- Render free tier sleeps after 15 min inactivity
- Visit `/api/health` endpoint to wake it up
- Upgrade to paid for always-on

---

## 📞 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **Git Issues:** https://docs.github.com/en

---

**You did it! 🎉 Your barbershop is online!**
