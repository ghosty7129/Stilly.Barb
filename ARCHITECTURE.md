# 🏗️ Architecture Overview

## Application Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        USER JOURNEY                          │
└─────────────────────────────────────────────────────────────┘

   Landing Page (/)
         │
         ├─→ Browse Services
         ├─→ View Gallery
         ├─→ Read About
         │
         ↓
   Book Now (/book)
         │
         ├─→ Select Service
         ├─→ Choose Date
         ├─→ Pick Time Slot
         ├─→ Fill Details
         │
         ↓
   Confirmation (/confirmation)
         │
         ├─→ View Details
         ├─→ Download/Print
         └─→ Return Home

   Admin Dashboard (/admin)
         │
         ├─→ Login
         ├─→ View Bookings
         └─→ Manage Appointments
```

## Component Hierarchy

```
App.jsx
│
├── Routes
│   │
│   ├── Home
│   │   ├── Header
│   │   ├── Hero
│   │   ├── Services
│   │   ├── About
│   │   ├── Gallery
│   │   ├── Contact
│   │   └── Footer
│   │
│   ├── Booking
│   │   ├── Personal Info Form
│   │   ├── Service Selector
│   │   ├── Date Picker
│   │   ├── Time Slot Selector
│   │   └── Notes Input
│   │
│   ├── Confirmation
│   │   └── Booking Details Card
│   │
│   └── Admin
│       ├── Login Form
│       └── Bookings List
│
└── Global State (Zustand)
    └── Booking Store
```

## Data Flow

```
┌──────────────┐
│   User       │
│   Actions    │
└──────┬───────┘
       │
       ↓
┌──────────────────────────────┐
│  React Components            │
│  (UI Layer)                  │
└──────────┬───────────────────┘
           │
           ↓
┌──────────────────────────────┐
│  Services Layer              │
│  - appointmentService.js     │
│  - Validation Logic          │
│  - Business Rules            │
└──────────┬───────────────────┘
           │
           ↓
┌──────────────────────────────┐
│  State Management            │
│  (Zustand Store)             │
└──────────┬───────────────────┘
           │
           ↓
┌──────────────────────────────┐
│  Future: Backend API         │
│  - Database                  │
│  - Email Service             │
│  - Payment Processing        │
└──────────────────────────────┘
```

## State Management

```
bookingStore (Zustand)
│
├── State
│   └── bookings: []
│
└── Actions
    ├── addBooking(booking)
    ├── removeBooking(id)
    └── getBookingsByDate(date)
```

## Styling Architecture

```
Tailwind CSS Configuration
│
├── Base Layer
│   └── Global resets & defaults
│
├── Components Layer
│   ├── .container-custom
│   ├── .btn-primary
│   ├── .btn-secondary
│   └── .section-title
│
└── Utilities Layer
    ├── .text-gradient
    └── .hover-lift
```

## File Organization

```
src/
│
├── components/          # UI Components (Presentational)
│   ├── Header.jsx      # Navigation
│   ├── Hero.jsx        # Hero section
│   ├── Services.jsx    # Services grid
│   ├── About.jsx       # About section
│   ├── Gallery.jsx     # Image gallery
│   ├── Contact.jsx     # Contact form
│   └── Footer.jsx      # Footer
│
├── pages/              # Page Components (Container)
│   ├── Home.jsx        # Main page
│   ├── Booking.jsx     # Booking flow
│   ├── Confirmation.jsx # Success page
│   └── Admin.jsx       # Admin dashboard
│
├── services/           # Business Logic
│   ├── appointmentService.js  # Booking logic
│   └── database.js     # Schema & API design
│
├── store/              # State Management
│   └── bookingStore.js # Global state
│
├── App.jsx             # Route configuration
├── main.jsx            # Application entry
└── index.css           # Global styles
```

## Technology Stack Layers

```
┌────────────────────────────────────┐
│     User Interface (Browser)       │
└────────────────┬───────────────────┘
                 │
┌────────────────▼───────────────────┐
│     React Components               │
│     - Functional components        │
│     - Hooks (useState, useEffect)  │
└────────────────┬───────────────────┘
                 │
┌────────────────▼───────────────────┐
│     Routing (React Router)         │
│     - SPA navigation               │
│     - Route protection             │
└────────────────┬───────────────────┘
                 │
┌────────────────▼───────────────────┐
│     Styling (Tailwind CSS)         │
│     - Utility classes              │
│     - Responsive design            │
└────────────────┬───────────────────┘
                 │
┌────────────────▼───────────────────┐
│     Animation (Framer Motion)      │
│     - Page transitions             │
│     - Micro-interactions           │
└────────────────┬───────────────────┘
                 │
┌────────────────▼───────────────────┐
│     State (Zustand)                │
│     - Global state management      │
│     - Booking data                 │
└────────────────┬───────────────────┘
                 │
┌────────────────▼───────────────────┐
│     Build Tool (Vite)              │
│     - Fast HMR                     │
│     - Optimized builds             │
└────────────────────────────────────┘
```

## Deployment Architecture

```
┌──────────────┐
│   Developer  │
└──────┬───────┘
       │
       │ git push
       ↓
┌─────────────────────┐
│   GitHub Repository  │
└──────┬──────────────┘
       │
       │ Auto deploy
       ↓
┌─────────────────────┐
│   Vercel/Netlify    │
│   (Recommended)     │
└──────┬──────────────┘
       │
       ↓
┌─────────────────────┐
│   CDN Distribution  │
└──────┬──────────────┘
       │
       ↓
┌─────────────────────┐
│   End Users         │
└─────────────────────┘
```

## Future Backend Architecture

```
┌──────────────────┐
│   React Frontend │
└────────┬─────────┘
         │
         │ HTTPS/REST API
         ↓
┌──────────────────┐
│   Node.js API    │
│   (Express)      │
└────────┬─────────┘
         │
         ├─→ Authentication (JWT)
         ├─→ Email Service (SendGrid)
         ├─→ Payment (Stripe)
         │
         ↓
┌──────────────────┐
│   PostgreSQL DB  │
│   - Users        │
│   - Appointments │
│   - Services     │
│   - Barbers      │
└──────────────────┘
```

## Performance Optimizations

```
Build Process
│
├── Code Splitting
│   └── Lazy load pages
│
├── Tree Shaking
│   └── Remove unused code
│
├── Minification
│   ├── JavaScript
│   └── CSS
│
├── Asset Optimization
│   ├── Image compression
│   └── Font subsetting
│
└── Caching Strategy
    ├── Browser cache
    └── CDN cache
```

## Security Layers

```
Current (Development)
├── Client-side validation
├── Simple password auth
└── HTTPS (in production)

Future (Production)
├── Backend validation
├── JWT authentication
├── Rate limiting
├── SQL injection protection
├── XSS prevention
├── CSRF tokens
└── Secure headers
```

---

This architecture provides:
✅ Scalability
✅ Maintainability
✅ Performance
✅ Security (when backend added)
✅ Developer experience
✅ User experience
