# PLAN: Beauty Tools Website — "RINDANG CEMARA GROUP"

## Deskripsi
Website e-commerce alat kecantikan (beauty tools) modern dengan desain Light Mode 2025/2026.
Frontend React + TypeScript + Vite, backend Laravel (beauty-api).

---

## Tech Stack

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| React | 19 | UI Framework |
| TypeScript | 5.7+ | Type Safety |
| Vite | 8+ | Build Tool |
| Tailwind CSS | v4 | Utility-first CSS |
| wouter | 3.3 | Hash-based Routing |
| @tanstack/react-query | 5 | Server State / Data Fetching |
| axios | 1.7 | HTTP Client |
| framer-motion | 12+ | Animations |
| lucide-react | 0.545 | Icons |
| Radix UI | latest | Headless UI Primitives |
| react-hook-form | 7 | Form Management |
| sonner | 2 | Toast Notifications |
| embla-carousel-react | 8 | Carousel |
| zustand | 5 | Wishlist State (lightweight) |
| next-themes | 0.4 | Theme Provider |
| date-fns | 3 | Date Utilities |
| clsx + tailwind-merge | latest | Class utilities |
| class-variance-authority | latest | Component Variants |
| cmdk | 1.1 | Command Menu |
| vaul | 1.1 | Drawer |
| react-day-picker | 9 | Calendar |

---

## Color Palette — "Warm Rose + Sand" (Light Mode)

| Peran | Warna | Tailwind |
|-------|-------|----------|
| Background | `#FAF8F5` | `bg-[#FAF8F5]` |
| Card Surface | `#FFFFFF` | `bg-white` |
| Primary | `#D4A574` (Rose Gold) | rose gold |
| Secondary | `#8B7E74` (Taupe) | taupe |
| Accent | `#2D6A4F` (Sage Green) | sage |
| Text Primary | `#1C1917` | near-black |
| Text Muted | `#78716C` | warm gray |

### Typography
- **Headings:** Outfit (geometric, modern sans-serif)
- **Body:** Inter (clean, readable)

### Design Signature
- Glassmorphism cards: `bg-white/70 backdrop-blur-xl` + subtle border
- Rounded soft: `rounded-2xl` / `rounded-3xl`
- Bento grid: asymmetric, modular, magazine-style layout
- Shadows: warm soft shadows
- Hover micro-interactions: subtle scale + glow

---

## Halaman & Fitur

### Public Pages
| Halaman | Fitur |
|---------|-------|
| Home | Hero (gradient + blur bg), Category Bento Grid, Featured Products, "How It Works" (3 steps), Testimonials Carousel, Newsletter Signup, Footer |
| Products | Filter sidebar (kategori, search), Product Grid, Quick View modal, Quick Add to Wishlist |
| Product Detail | Image gallery, Tech Specs table, Before/After slider, Benefits, How-to-Use, Comparison toggle, Related Products |
| About | Brand story, Technology / Innovation, Team / Values |
| Contact/FAQ | FAQ accordion, Contact form, Social media links |
| Wishlist | Heart icon on navbar, dedicated page, localStorage persistence |
| Skin Quiz | 3-step interactive quiz → personalized product recommendations |
| 404 | Custom not-found page with link home |

### Admin Panel
| Halaman | Fitur |
|---------|-------|
| Login | Split layout: branding panel + login form, eye toggle password |
| Setup | Initial data seeding with setup key |
| Dashboard | Stat cards (total products, testimonials), management cards |
| Products | Full CRUD via modal form, QR code generation + download |
| Homepage Content | Edit all homepage text content |
| Testimonials | CRUD via modal, toggle active status |
| Gallery | Image upload + preview, grid display, toggle active, delete |

---

## Fitur Tambahan (Versus Existing Project)

| Fitur | Implementasi |
|-------|--------------|
| Category Filter | Button group filter on Products page |
| Search | Search input with text filtering |
| Quick View | Modal produk tanpa navigasi ke halaman detail |
| Quick Add Wishlist | Heart button on product card |
| Product Comparison | Side-by-side spec table (max 3 produk) |
| Before/After Slider | Image comparison slider component |
| Skin Concern Quiz | 3-step interactive quiz → rekomendasi |
| Wishlist | Zustand store + localStorage persist, heart icon, wishlist page |

---

## API Endpoints (beauty-api)

Semua endpoint menggunakan base URL dari env `VITE_API_URL`.

### Public
| Method | Endpoint | Response |
|--------|----------|----------|
| GET | `/products` | Array produk (snake_case) |
| GET | `/products/{id}` | Single produk |
| GET | `/testimonials` | Testimonial aktif |
| GET | `/gallery` | Gallery aktif |
| GET | `/homepage-content` | Key-value homepage content |

### Admin Auth
| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/admin/login` | `{ username, password }` → `{ token, username }` |
| POST | `/admin/seed` | `{ setupKey }` → seed data |

### Admin Protected (Bearer Token)
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/admin/stats` | Products & testimonials count |
| GET | `/admin/products` | Array produk (camelCase) |
| POST | `/admin/products` | Create produk |
| PUT | `/admin/products/{id}` | Update produk |
| DELETE | `/admin/products/{id}` | Hapus produk |
| GET | `/admin/testimonials` | All testimonials |
| POST | `/admin/testimonials` | Create testimonial |
| PUT | `/admin/testimonials/{id}` | Update testimonial |
| DELETE | `/admin/testimonials/{id}` | Hapus testimonial |
| GET | `/admin/gallery` | All gallery items |
| POST | `/admin/gallery` | Create gallery item |
| PUT | `/admin/gallery/{id}` | Update gallery item |
| DELETE | `/admin/gallery/{id}` | Hapus gallery item |
| POST | `/admin/homepage-content` | Save homepage content |
| POST | `/admin/upload` | Upload image (multipart) |

### Field Mapping Penting
- Request: `camelCase` (howToUse, imageUrl, isActive, sortOrder, altText)
- Response Public: `snake_case` (how_to_use, image_url)
- Response Admin: `camelCase` (howToUse, imageUrl, isActive, sortOrder, altText)
- Product categories: `Wanita`, `Pria`, `Anak`

---

## Struktur Folder

```
beauty-tools/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .env
├── plan1.md
├── public/images/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── lib/
│   │   ├── api.ts
│   │   └── utils.ts
│   ├── store/
│   │   └── wishlist.ts
│   ├── data/
│   │   └── products.ts
│   ├── hooks/
│   │   ├── use-toast.ts
│   │   ├── use-mobile.tsx
│   │   └── use-wishlist.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── ui/ (22 components)
│   │   └── features/ (7 components)
│   └── pages/
│       ├── Home.tsx, Products.tsx, ProductDetail.tsx
│       ├── About.tsx, Contact.tsx, Wishlist.tsx
│       ├── Quiz.tsx, not-found.tsx
│       └── admin/ (Login, Setup, Dashboard, Products, Homepage, Testimonials, Gallery)
```
