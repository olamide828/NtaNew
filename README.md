# Testimony Parish V3 Frontend
### New Testament Assembly Worldwide — Ogun State

## Quick Start
```bash
npm install
cp .env.example .env
npm run dev
```

## Environment
```
VITE_API_URL=https://ntabackend-c5ks.onrender.com/api
```

## Deploy to Vercel
1. Push to GitHub
2. Import on vercel.com
3. Add VITE_API_URL environment variable
4. Deploy

## Folder Structure
```
src/
├── App.jsx                        # Routes + NProgress + ScrollToTop
├── main.jsx
├── index.css                      # Global styles + Tailwind
├── context/
│   └── AuthContext.jsx            # Admin JWT auth state
├── utils/
│   └── api.js                     # All API calls (backend: ntabackend-c5ks.onrender.com)
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx             # Sticky, transparent on home hero, mobile drawer
│   │   ├── Footer.jsx             # Navy footer, links, service times
│   │   └── PublicLayout.jsx       # Wraps all public pages
│   └── admin/
│       └── AdminLayout.jsx        # Navy sidebar + topbar
└── pages/
    ├── Home.jsx                   # Hero, scripture, pillars, events, CTA
    ├── About.jsx                  # Mission, vision, service times
    ├── Events.jsx                 # Filter + search grid
    ├── EventDetail.jsx            # Event info + registration form
    ├── Highlights.jsx             # Gallery grid (links to detail pages)
    ├── HighlightDetail.jsx        # Full page: left/right arrow nav, thumbnail strip
    ├── Contact.jsx                # Contact form + service times
    └── admin/
        ├── AdminLogin.jsx
        ├── AdminDashboard.jsx
        ├── AdminEvents.jsx
        ├── AdminEventForm.jsx     # Upload from device OR paste URL
        ├── AdminRegistrations.jsx # Verify code + manage registrations
        └── AdminHighlights.jsx   # Upload photos/videos
```

## Key Features
- NProgress loading bar on every navigation
- Scroll-to-top on every route change
- Button loading states everywhere
- Highlight detail page with left/right arrow navigation (keyboard supported)
- Admin-only registration code verification
- Image upload: choose from device OR paste URL
- Navy + gold + cream color palette
- Cormorant Garamond serif + Inter sans
- Framer Motion animations throughout
