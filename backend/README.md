# HardBassBash — PocketBase Backend

Backend untuk website HardBassBash menggunakan **PocketBase v0.39.x** — single binary backend dengan embedded SQLite, REST API, file storage, dan admin dashboard.

---

## 🚀 Cara Menjalankan (Local Dev)

### 1. Download PocketBase

Unduh binary PocketBase untuk Windows dari GitHub Releases:
```
https://github.com/pocketbase/pocketbase/releases/download/v0.39.3/pocketbase_0.39.3_windows_amd64.zip
```

Ekstrak `pocketbase.exe` ke folder ini (`backend/`).

### 2. Setup Pertama Kali

Jalankan server:
```powershell
.\pocketbase.exe serve
```

Server akan berjalan di:
- **Frontend**: `http://127.0.0.1:8090` (static files dari `pb_public/`)
- **Admin Dashboard**: `http://127.0.0.1:8090/_/`
- **REST API**: `http://127.0.0.1:8090/api/`

Buka browser ke `http://127.0.0.1:8090/_/` dan buat superuser pertama.

### 3. Jalankan Migration (Setup Database)

Migrasi akan berjalan otomatis saat server dijalankan. Semua koleksi dan data awal akan dibuat.

Atau jalankan manual:
```powershell
.\pocketbase.exe migrate up
```

---

## 📧 Konfigurasi SMTP (Gmail)

Untuk menerima email notifikasi dari contact form:

1. Buka **Admin Dashboard** → `Settings` → `Mail settings`
2. Isi konfigurasi:
   - **Sender name**: `HardBassBash`
   - **Sender address**: `ekomurdiansyah89@gmail.com`
   - **SMTP host**: `smtp.gmail.com`
   - **SMTP port**: `587`
   - **Username**: `ekomurdiansyah89@gmail.com`
   - **Password**: [App Password dari Google] — lihat langkah di bawah
   - **TLS**: Centang **STARTTLS**
3. Klik **Save changes** dan **Send test email**

### Membuat Gmail App Password:
1. Buka `https://myaccount.google.com/apppasswords`
2. Login dengan akun `ekomurdiansyah89@gmail.com`
3. Pilih app: **Mail**, device: **Other (Custom name)** → ketik "HardBassBash"
4. Copy password 16-digit yang muncul
5. Gunakan password itu di kolom SMTP Password

> **Catatan**: Fitur App Password membutuhkan 2-Factor Authentication aktif di Google Account.

---

## 🗄️ Koleksi Database

| Koleksi | Akses Baca | Akses Tulis |
|---|---|---|
| `artists` | Public | Admin |
| `events` | Public | Admin |
| `releases` | Public | Admin |
| `mixes` | Public | Admin |
| `products` | Public | Admin |
| `contact_messages` | Admin only | Public (create) |
| `newsletter_subscribers` | Admin only | Public (create) |

---

## 📁 Struktur Folder

```
backend/
├── pocketbase.exe          ← Binary (download manual)
├── pb_data/                ← Database SQLite + file uploads (git-ignored)
├── pb_migrations/          ← Migration scripts (auto-run on startup)
│   └── 1_init_collections.js
├── pb_hooks/               ← Custom server-side hooks
│   └── contact_notify.pb.js
├── .gitignore
└── README.md               ← File ini
```

---

## 🔄 API Endpoints (Contoh)

```
GET  /api/collections/artists/records
GET  /api/collections/events/records?filter=(status='upcoming')
GET  /api/collections/releases/records?sort=-release_date
POST /api/collections/contact_messages/records
```

---

## 🌐 Deploy ke Production (Nanti)

Pilihan hosting PocketBase:
- **PocketHost.io** — Managed hosting gratis untuk PocketBase
- **VPS/Server** — Jalankan binary langsung
- **Railway / Render** — Dengan Docker

Untuk production, copy semua file dari `landing-page/` ke folder `pb_public/` agar PocketBase bisa serve static files.
