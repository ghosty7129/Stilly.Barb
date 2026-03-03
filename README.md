# Stilly.Barb - Premium Barbershop Website

A modern, luxury barbershop website built with React, featuring a sophisticated booking system and premium design aesthetic.

## 🎨 Design Philosophy

This website embodies minimalism, luxury, and professionalism. Inspired by high-end barber brands like Menspire, the design features:

- **Clean Typography**: Playfair Display for headings, Inter for body text
- **Sophisticated Color Palette**: Dark/light luxury colors with gold and silver accents
- **Smooth Animations**: Framer Motion for premium micro-interactions
- **Mobile-First**: Fully responsive across all devices
- **Premium UX**: Intuitive navigation and booking flow

## 🏗️ Project Structure

```
barber-website/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.jsx       # Navigation header with mobile menu
│   │   ├── Hero.jsx         # Landing hero section
│   │   ├── Services.jsx     # Services grid with animations
│   │   ├── About.jsx        # About section with stats
│   │   ├── Gallery.jsx      # Image gallery with lightbox
│   │   ├── Contact.jsx      # Contact form and info
│   │   └── Footer.jsx       # Site footer
│   │
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Main landing page
│   │   ├── Booking.jsx      # Appointment booking page
│   │   ├── Confirmation.jsx # Booking confirmation page
│   │   └── Admin.jsx        # Admin dashboard
│   │
│   ├── services/            # Business logic
│   │   ├── appointmentService.js  # Appointment logic & validation
│   │   └── database.js      # Database schema & API structure
│   │
│   ├── store/               # State management
│   │   └── bookingStore.js  # Zustand store for bookings
│   │
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles (Tailwind)
│
├── index.html               # HTML entry point
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── postcss.config.js        # PostCSS configuration
```

## 🚀 Technology Stack

### Frontend

- **React 18** - Modern UI framework
- **Vite** - Lightning-fast build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Zustand** - Lightweight state management
- **date-fns** - Date manipulation library

### Design Features

- Custom color palette with gold/silver accents
- Responsive design system
- Smooth page transitions
- Micro-interactions on hover
- Professional typography hierarchy

## 📋 Key Features

### 1. **Appointment Booking System**

- Business hours: 09:00 - 18:00 (Mon-Fri)
- Real-time slot availability
- 30-day advance booking
- Time slot validation
- Service selection with pricing
- Customer information collection

### 2. **Service Management**

- 6 premium services (Haircut, Shave, Styling, Fade, VIP Combo, Coloring)
- Duration and pricing display
- Detailed service cards with hover effects

### 3. **Admin Dashboard**

- Password-protected access
- View all bookings
- Delete appointments
- Sorted by date/time
- Responsive layout

### 4. **Premium UI Components**

- Animated hero section
- Smooth scroll navigation
- Image gallery with lightbox
- Contact form
- Social media integration
- Mobile-friendly hamburger menu

## 🗄️ Database Schema

Production-ready PostgreSQL/MySQL schema included in `src/services/database.js`:

- **users** - Customer information
- **services** - Service catalog
- **barbers** - Staff management
- **appointments** - Booking records
- **working_hours** - Barber availability
- **blocked_dates** - Holiday management

## 📦 Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start development server:**

   ```bash
   npm run dev
   ```

3. **Build for production:**

   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## 🎯 Usage Guide

### Booking Flow

1. User lands on homepage
2. Clicks "Book Now" CTA
3. Fills personal information
4. Selects service
5. Picks date from calendar
6. Chooses available time slot
7. Adds optional notes
8. Confirms booking
9. Receives confirmation page

### Admin Access

1. Navigate to `/admin`
2. Enter password (default: `admin123`)
3. View all appointments
4. Manage bookings

**Note:** Change the admin password in `src/pages/Admin.jsx` for production.

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to customize the color palette:

```js
colors: {
  primary: '#0a0a0a',
  accent: {
    gold: '#D4AF37',
    silver: '#C0C0C0'
  }
}
```

### Services

Update services in `src/services/appointmentService.js`:

```js
export const SERVICES = [
  { id: "haircut", name: "Haircut", duration: 60, price: 50 },
  // Add more services...
];
```

### Business Hours

Modify hours in `src/services/appointmentService.js`:

```js
export const BUSINESS_HOURS = {
  start: 9,
  end: 18,
};
```

## 🔒 Security Considerations

For production deployment:

1. **Authentication**: Replace simple password with proper authentication (JWT, OAuth)
2. **Backend Integration**: Connect to real database and API
3. **Environment Variables**: Use `.env` for sensitive data
4. **Email Service**: Integrate with SendGrid/Mailgun for confirmations
5. **Payment Processing**: Add Stripe/PayPal for deposits
6. **SSL Certificate**: Ensure HTTPS for all traffic

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🌐 Deployment

### Recommended Platforms

- **Vercel** - Zero configuration deployment
- **Netlify** - Automatic builds and deploys
- **GitHub Pages** - Free static hosting
- **AWS S3 + CloudFront** - Scalable enterprise solution

### Build Command

```bash
npm run build
```

Output directory: `dist/`

## 📈 Future Enhancements

- [ ] Backend API with Node.js/Express
- [ ] Database integration (PostgreSQL)
- [ ] Email confirmation system
- [ ] SMS notifications (Twilio)
- [ ] Payment integration
- [ ] Customer accounts & history
- [ ] Loyalty program
- [ ] Multi-language support
- [ ] Online payment for deposits
- [ ] Calendar sync (Google Calendar, iCal)
- [ ] Staff management system
- [ ] Analytics dashboard

## 📄 License

Private project for Stilly.Barb barbershop.

## 🤝 Support

For questions or support, contact via Instagram: [@stilly.barb](https://www.instagram.com/stilly.barb/)

---

**Built with ❤️ for Stilly.Barb**
