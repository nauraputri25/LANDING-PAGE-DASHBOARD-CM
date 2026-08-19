/**
 * =============================================================
 *  DATA PORTAL PEMBELAJARAN — CENDEKIA MUDA
 * =============================================================
 *  Semua materi / level / mata pelajaran ditaruh di sini.
 *  Kalau mau nambah, ubah, atau hapus kelas & Google Site,
 *  CUKUP EDIT FILE INI SAJA — tidak perlu sentuh index.html.
 *
 *  Struktur tiap unit:
 *    label      : judul unit (ditampilkan di header tab)
 *    desc       : deskripsi singkat di bawah judul
 *    badge      : teks badge kecil di kanan header (mis. "Level 1-6")
 *    accent     : warna aksen unit -> 'blue' | 'green' | 'red' | 'dark'
 *    layout     : 'fruit' (kartu buah TK) | 'level' (kartu angka SD)
 *                 | 'subject' (kartu mapel SMP/SMA)
 *    baseUrl    : link Google Site default untuk seluruh item di unit ini
 *    items[]    : daftar kelas/level/mapel
 *        title  : nama yang tampil
 *        icon   : emoji (fruit) ATAU kelas ikon Font Awesome (subject)
 *        desc   : deskripsi singkat (khusus layout 'subject')
 *        color  : 'blue' | 'green' | 'red' (khusus layout 'subject', warna ikon)
 *        url    : (opsional) override baseUrl kalau kelas ini linknya beda
 * =============================================================
 */

const SCHOOL_DATA = {
  tk: {
    label: "TK Islam Cendekia Muda",
    desc: "Pilih kelas buah-buahan untuk menuju Google Site pembelajaran.",
    badge: "10 Kelas Buah",
    accent: "green",
    layout: "fruit",
    baseUrl: "https://sites.google.com/cendekiamuda.sch.id/tk-cendekiamuda",
    items: [
      { title: "Kelas Apple", icon: "🍎" },
      { title: "Kelas Cherry", icon: "🍒" },
      { title: "Kelas Honeydew", icon: "🍈" },
      { title: "Kelas Kiwi", icon: "🥝" },
      { title: "Kelas Lemon", icon: "🍋" },
      { title: "Kelas Orange", icon: "🍊" },
      { title: "Kelas Pear", icon: "🍐" },
      { title: "Kelas Pineapple", icon: "🍍" },
      { title: "Kelas Pomelo", icon: "🍊" },
      { title: "Kelas Watermelon", icon: "🍉" }
    ]
  },

  sd: {
    label: "SD Islam Cendekia Muda",
    desc: "Pilih tingkat level kelas untuk mengakses Google Site pembelajaran SD.",
    badge: "Level 1 - Level 6",
    accent: "blue",
    layout: "level",
    baseUrl: "https://sites.google.com/cendekiamuda.sch.id/sd-cendekiamuda",
    items: [1, 2, 3, 4, 5, 6].map(n => ({ title: `Level ${n} SD`, number: n }))
  },

  smp: {
    label: "SMP Islam Cendekia Muda",
    desc: "Pilih mata pelajaran untuk membuka materi Google Site SMP (Level 7-9).",
    badge: "Level 7, 8, 9",
    accent: "dark",
    layout: "subject",
    baseUrl: "https://sites.google.com/cendekiamuda.sch.id/smp-cendekiamuda",
    items: [
      { title: "PAI & Tahfidz", desc: "Agama Islam & Al-Qur'an", icon: "fa-kaaba", color: "green" },
      { title: "Matematika", desc: "Mata Pelajaran Matematika", icon: "fa-calculator", color: "blue" },
      { title: "IPA Terpadu", desc: "Fisika, Biologi, Kimia Dasar", icon: "fa-atom", color: "green" },
      { title: "IPS Terpadu", desc: "Sejarah, Geografi, Ekonomi", icon: "fa-globe", color: "red" },
      { title: "Bahasa Indonesia", desc: "Literasi & Komunikasi", icon: "fa-book", color: "blue" },
      { title: "Bahasa Inggris", desc: "English Literacy & Speaking", icon: "fa-language", color: "green" },
      { title: "Informatika", desc: "Teknologi & Komputer", icon: "fa-laptop-code", color: "blue" }
    ]
  },

  sma: {
    label: "SMA Islam Cendekia Muda",
    desc: "Pilih mata pelajaran untuk membuka materi Google Site SMA (Level 10-12).",
    badge: "Level 10, 11, 12",
    accent: "red",
    layout: "subject",
    baseUrl: "https://sites.google.com/cendekiamuda.sch.id/sma-cendekiamuda",
    items: [
      { title: "Fisika", desc: "Sains & Terapan", icon: "fa-bolt", color: "red" },
      { title: "Kimia", desc: "Materi & Reaksi", icon: "fa-flask", color: "blue" },
      { title: "Biologi", desc: "Sains Hayati & Ekosistem", icon: "fa-dna", color: "green" },
      { title: "Matematika", desc: "Matematika Wajib & Lanjut", icon: "fa-square-root-variable", color: "blue" },
      { title: "Ekonomi", desc: "Ekonomi & Bisnis", icon: "fa-chart-line", color: "green" },
      { title: "PAI & Tahfidz", desc: "Pendidikan Agama Islam", icon: "fa-kaaba", color: "red" }
    ]
  }
};

/**
 * Link Looker Studio (sumber data: Google Analytics 4 -> Looker Studio).
 * Ganti REPORT_ID di bawah dengan ID laporan Looker Studio milik sekolah.
 * Cara mendapatkan ID: buka laporan di Looker Studio -> File -> Embed report
 * -> salin ID yang ada di URL, di antara /reporting/ dan /page/.
 */
const ANALYTICS_CONFIG = {
  reportId: "81fac7f5-c05d-4923-a8b4-a241f6328551",
  pageId: "ZIF6F",
  get fullReportUrl() {
    return `https://lookerstudio.google.com/u/0/reporting/${this.reportId}/page/${this.pageId}`;
  },
  get embedUrl() {
    return `https://lookerstudio.google.com/embed/reporting/${this.reportId}/page/${this.pageId}`;
  }
};

/**
 * Google Analytics 4 Measurement ID.
 * Ganti "G-XXXXXXXXXX" dengan Measurement ID GA4 sekolah (Admin -> Data streams).
 */
const GA_MEASUREMENT_ID = "G-XXXXXXXXXX";
