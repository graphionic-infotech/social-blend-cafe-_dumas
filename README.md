# Social Blend Dumas — Website Redesign

A responsive, dependency-free website for Social Blend Dumas, built from the supplied Google Business Profile and Pinterest visual reference.

## Preview locally

```bash
cd /home/user/social-blend
python3 -m http.server 4173 --bind 0.0.0.0
```

Then open `http://localhost:4173`.

## Files

- `index.html` — semantic page structure, local SEO metadata and LocalBusiness schema
- `styles.css` — complete responsive design system and layouts
- `script.js` — mobile navigation, live open/closed status, scroll reveals and gallery lightbox
- `assets/fonts/` — locally hosted typography
- `assets/images/optimized/` — optimized real business photography

## Verified business details used

- **Business:** Social Blend Dumas
- **Category:** Café
- **Address:** Right from Langar Circle, Sultanabad–Dumas Road, near Jukamata Temple, Surat, Gujarat 394550
- **Phone / WhatsApp:** +91 93276 15130
- **Hours:** Daily, 12:00 PM–12:00 AM
- **Google rating:** 4.5 from 746 reviews at research time
- **Dining:** Vegetarian Italian, American and fusion café menu; indoor and outdoor garden seating

## Built-in features

- Responsive layouts for desktop, tablet and mobile widths
- Sticky navigation and accessible mobile drawer
- Click-to-call, WhatsApp and Google Directions actions
- Real business image gallery with keyboard-accessible lightbox
- Dynamic India-time open/closed indicator
- LocalBusiness structured data and social metadata
- Local fonts, optimized WebP imagery and lazy loading
- Reduced-motion support and WCAG AA contrast checks

No build step or third-party frontend library is required.
