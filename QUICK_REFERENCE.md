# ⚡ Quick Reference Card

## 🎯 Essential Commands

```bash
# Install dependencies (FIRST TIME ONLY)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Key Files to Edit

### Content Updates

| File                          | What to Edit           |
| ----------------------------- | ---------------------- |
| `src/components/Hero.jsx`     | Main headline, tagline |
| `src/components/Services.jsx` | Service display        |
| `src/components/About.jsx`    | About text, stats      |
| `src/components/Contact.jsx`  | Contact information    |
| `src/components/Footer.jsx`   | Footer links, hours    |

### Business Logic

| File                                 | What to Edit                     |
| ------------------------------------ | -------------------------------- |
| `src/services/appointmentService.js` | Services, prices, business hours |
| `src/pages/Admin.jsx`                | Admin password                   |

### Styling

| File                 | What to Edit           |
| -------------------- | ---------------------- |
| `tailwind.config.js` | Colors, fonts, spacing |
| `src/index.css`      | Global styles          |

## 🎨 Quick Customization

### Change Colors

```javascript
// tailwind.config.js
colors: {
  primary: '#YOUR_COLOR',
  accent: {
    gold: '#YOUR_GOLD',
    silver: '#YOUR_SILVER'
  }
}
```

### Update Services

```javascript
// src/services/appointmentService.js
export const SERVICES = [
  {
    id: "haircut",
    name: "Haircut",
    duration: 60,
    price: 50,
  },
  // Add more...
];
```

### Change Business Hours

```javascript
// src/services/appointmentService.js
export const BUSINESS_HOURS = {
  start: 9, // 9 AM
  end: 18, // 6 PM
};
```

## 🔐 Admin Access

- **URL:** `http://localhost:3000/admin`
- **Password:** `admin123`
- **Change in:** `src/pages/Admin.jsx`

## 📱 Routes

| URL             | Page            |
| --------------- | --------------- |
| `/`             | Home            |
| `/book`         | Booking         |
| `/confirmation` | Confirmation    |
| `/admin`        | Admin Dashboard |

## 🛠️ Project Structure

```
src/
├── components/     # UI components
├── pages/         # Page components
├── services/      # Business logic
└── store/         # State management
```

## 💡 Common Tasks

### Add a New Service

1. Edit `src/services/appointmentService.js`
2. Add to `SERVICES` array
3. Save - it's live!

### Change Images

1. Replace image URLs in components
2. Or add images to `public/` folder
3. Reference as `/image.jpg`

### Update Contact Info

1. Edit `src/components/Contact.jsx`
2. Edit `src/components/Footer.jsx`
3. Save changes

### Modify Animations

1. Edit component files
2. Adjust Framer Motion props
3. See changes instantly

## 📚 Documentation

| Document             | Purpose            |
| -------------------- | ------------------ |
| `README.md`          | Full documentation |
| `SETUP.md`           | Quick setup        |
| `GETTING_STARTED.md` | First steps        |
| `PROJECT_SUMMARY.md` | Complete overview  |
| `ARCHITECTURE.md`    | Technical details  |
| `COMPARISON.md`      | Before/After       |
| `QUICK_REFERENCE.md` | This file          |

## 🚀 Deployment

### Quick Deploy to Vercel

1. Push to GitHub
2. Connect to Vercel
3. Auto-deploy on push

### Manual Deploy

```bash
npm run build
# Upload dist/ folder to host
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process or use different port
npm run dev -- --port 3001
```

### Module Not Found

```bash
npm install
# Clear cache if needed
rm -rf node_modules package-lock.json
npm install
```

### Build Fails

```bash
# Check for errors in console
# Ensure all imports are correct
# Run development first: npm run dev
```

## 💻 Development Tips

1. **Hot Reload:** Changes appear instantly
2. **Console:** Check browser console for errors
3. **Components:** Edit one at a time
4. **Save Often:** Changes are instant
5. **Test Mobile:** Use browser dev tools

## 🎯 Next Steps

1. ✅ Install Node.js
2. ✅ Run `npm install`
3. ✅ Run `npm run dev`
4. 🎨 Customize content
5. 🖼️ Add your images
6. 📝 Update contact info
7. 🔒 Change admin password
8. 🚀 Deploy to production

## 📞 Need Help?

- Read `README.md` for full docs
- Check `PROJECT_SUMMARY.md` for overview
- Review code comments in files

## ⚡ Performance Tips

- ✅ Images: Use optimized formats (WebP)
- ✅ Build: Always test production build
- ✅ Hosting: Use CDN (Vercel, Netlify)
- ✅ Analytics: Add later, not critical

## 🎉 You're Ready!

Your premium barbershop website is complete and ready to impress!

**Start:** `npm install` then `npm run dev`
**Enjoy:** Your luxury website at `localhost:3000`
