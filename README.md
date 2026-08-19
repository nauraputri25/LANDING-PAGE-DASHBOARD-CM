# Portal Pembelajaran — Cendekia Muda

Landing page interaktif yang jadi "gerbang" menuju dashboard resmi
`https://dashboard.cendekiamuda.sch.id/`. Setiap kelas / level / mata
pelajaran yang diklik akan langsung diarahkan (tab baru) ke Google Site
pembelajaran unit terkait, dan statistik kunjungan (Google Analytics 4
via Looker Studio) ditampilkan di halaman home.

## 📁 Struktur Folder

```
cendekia-muda-landing/
├── index.html          # Halaman utama (struktur & markup)
├── css/
│   └── style.css       # Semua styling & animasi kustom
├── js/
│   ├── data.js         # Data materi/level/kelas + konfigurasi GA4 & Looker Studio
│   └── main.js         # Logika render kartu, tab, search, tracking, animasi
├── assets/              # (kosong, siap dipakai untuk logo/gambar tambahan)
└── README.md
```

Kenapa dipisah begini?
- **`index.html`** hanya berisi kerangka halaman — bersih dan gampang dibaca.
- **`js/data.js`** adalah satu-satunya tempat yang perlu diedit kalau mau
  menambah/mengubah/menghapus kelas atau link Google Site — tidak perlu
  utak-atik HTML.
- **`js/main.js`** merender kartu secara otomatis dari `data.js`, jadi semua
  unit (TK/SD/SMP/SMA) tetap konsisten tampilannya.

## ▶️ Cara Menjalankan

Karena semua file statis (HTML/CSS/JS, tanpa build tool), tinggal:

1. Buka `index.html` langsung di browser, **atau**
2. Jalankan local server (disarankan, supaya `fetch`/iframe berjalan normal):
   ```bash
   cd cendekia-muda-landing
   npx serve .
   # atau
   python3 -m http.server 8080
   ```
3. Upload seluruh folder ini ke hosting (Netlify, Vercel, GitHub Pages,
   cPanel, dsb.) untuk versi production di domain sekolah.

## ✏️ Menambah / Mengubah Kelas & Link Google Site

Buka `js/data.js`, cari unit yang ingin diubah (`tk`, `sd`, `smp`, `sma`),
lalu edit array `items`. Contoh menambah mapel baru di SMP:

```js
smp: {
  ...
  items: [
    ...,
    { title: "Seni Budaya", desc: "Musik, Rupa & Tari", icon: "fa-palette", color: "green" }
  ]
}
```

Kalau satu kelas perlu link Google Site yang berbeda dari `baseUrl` unitnya,
tambahkan properti `url` pada item tersebut:

```js
{ title: "Kelas Apple", icon: "🍎", url: "https://sites.google.com/.../kelas-apple" }
```

## 📊 Menghubungkan Google Analytics (GA4) ke Looker Studio

1. **Buat/pastikan Property GA4** untuk domain portal ini di
   [analytics.google.com](https://analytics.google.com) → Admin → Data streams
   → salin **Measurement ID** (formatnya `G-XXXXXXXXXX`).
2. Buka `js/data.js`, cari `GA_MEASUREMENT_ID` di bagian paling bawah, ganti
   `"G-XXXXXXXXXX"` dengan Measurement ID asli.
3. **Buat laporan di Looker Studio** ([lookerstudio.google.com](https://lookerstudio.google.com)):
   - Data source → pilih **Google Analytics** → pilih Property GA4 di atas.
   - Susun laporan (pengunjung, sesi, halaman/materi terpopuler, dsb).
4. **Ambil ID laporan untuk embed**:
   - Di laporan Looker Studio → **File → Embed report** → aktifkan *Enable embedding*.
   - Salin ID yang tampil di URL, formatnya:
     `.../reporting/<REPORT_ID>/page/<PAGE_ID>`
5. Buka `js/data.js`, cari `ANALYTICS_CONFIG`, ganti `reportId` dan `pageId`
   sesuai punya sekolah.
6. Simpan, refresh halaman — dashboard Looker Studio akan otomatis tampil
   di section **"Statistik Kunjungan Portal"** pada halaman home.

> Catatan: Laporan Looker Studio yang di-embed harus diset **"Anyone with
> the link can view"** (atau publik) di pengaturan share-nya, kalau tidak
> iframe akan menampilkan halaman login Google.

## 🎯 Event Tracking yang Sudah Berjalan

`js/main.js` otomatis mengirim event ke GA4 setiap kali:
- **`select_content`** → saat kartu materi/level diklik (menyertakan `unit_jenjang`,
  `nama_materi`, dan `link_tujuan` yang dituju), berguna untuk melihat di Looker
  Studio materi apa yang paling sering diakses.
- **`select_tab`** → saat pengguna berpindah tab jenjang (TK/SD/SMP/SMA).

Event-event ini bisa langsung dijadikan dimensi/metrik kustom di laporan
Looker Studio (mis. tabel "Materi Terpopuler" berdasarkan `nama_materi`).

## ✨ Fitur Interaktif

- Pencarian real-time lintas semua jenjang, dengan highlight kata kunci
  dan otomatis pindah ke tab yang punya hasil.
- Animasi *reveal* saat kartu muncul di layar (scroll) dan saat ganti tab.
- Efek *ripple* dan toast notifikasi "Membuka Google Site..." saat kartu diklik.
- Skeleton loading saat laporan Looker Studio sedang dimuat.
- Tombol scroll-to-top yang muncul otomatis saat halaman di-scroll.
- Statistik ringkas (jumlah jenjang, kelas & mapel) dihitung otomatis dari `data.js`.
