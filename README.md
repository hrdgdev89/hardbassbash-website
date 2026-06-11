# HardBassBash Website

> Jakarta's Hard Techno Collective — Official Website

[![GitHub](https://img.shields.io/badge/Follow-@hardbassbash-E5001A?style=flat&logo=instagram)](https://www.instagram.com/hardbassbash/)

---

## 🔥 About

**HardBassBash** adalah kolektif musik techno/hard techno yang berbasis di Jakarta, Indonesia. Website ini adalah platform resmi untuk events, artists, music releases, dan merchandise.

**Core Roster:** Oschie · Jourdy Cox · Marth · KittyFlip · Micju · Barra · HRDG

**Cities:** Jakarta · Bandung · Yogyakarta · Surabaya

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, Vanilla CSS, Vanilla JS |
| Backend | [PocketBase](https://pocketbase.io/) v0.39.x |
| Database | SQLite (embedded in PocketBase) |
| Fonts | Bebas Neue, Barlow Condensed, Inter |

---

## 📁 Project Structure

```
hardbassbash-website/
├── landing-page/           # Frontend static site
│   ├── index.html          # Home page
│   ├── events.html         # Events page
│   ├── artists.html        # Artists page
│   ├── music.html          # Music releases & mixes
│   ├── shop.html           # Merchandise shop
│   ├── contact.html        # Contact & booking
│   ├── css/style.css       # Global design system
│   ├── js/main.js          # Navigation & animations
│   ├── js/api.js           # PocketBase API client
│   └── images/             # Static assets
│
└── backend/                # PocketBase backend
    ├── pb_migrations/      # Database schema & seed data
    ├── pb_hooks/           # Server-side hooks (email notifications)
    └── README.md           # Backend setup guide
```

---

## 🚀 Getting Started

### Prerequisites
- Windows / macOS / Linux
- [PocketBase binary](https://github.com/pocketbase/pocketbase/releases) (download separately)

### 1. Clone the repo
```bash
git clone https://github.com/hrdgdev89/hardbassbash-website.git
cd hardbassbash-website
```

### 2. Setup PocketBase
Download `pocketbase` binary from [pocketbase.io](https://pocketbase.io) and place it in the `backend/` folder.

```bash
cd backend
./pocketbase serve
```

### 3. Initialize the database
On first run, migrations will auto-execute and create all collections + seed data.

Open the admin dashboard:
```
http://127.0.0.1:8090/_/
```

### 4. Access the website
```
http://127.0.0.1:8090/
```

> **Note:** Copy `landing-page/*` to `backend/pb_public/` to serve via PocketBase, or use any local HTTP server.

---

## 🗄️ Database Collections

| Collection | Description | Access |
|---|---|---|
| `artists` | Artist profiles & photos | Public read |
| `events` | Events by city & status | Public read |
| `releases` | Music releases (Single/EP/Album) | Public read |
| `mixes` | Mix recordings & podcasts | Public read |
| `products` | Merchandise catalog | Public read |
| `contact_messages` | Contact form submissions | Public create, Admin read |
| `newsletter_subscribers` | Email subscribers | Public create, Admin read |

---

## 📧 Contact & Booking

- **Instagram:** [@hardbassbash](https://www.instagram.com/hardbassbash/)
- **Booking inquiries:** Via contact form on the website

---

## 📄 License

© 2025 HardBassBash. All rights reserved.
