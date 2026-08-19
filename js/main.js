/**
 * =============================================================
 *  PORTAL PEMBELAJARAN — CENDEKIA MUDA — main.js
 * =============================================================
 *  - Merender kartu unit (TK/SD/SMP/SMA) dari SCHOOL_DATA (data.js)
 *  - Klik kartu -> kirim event ke Google Analytics -> redirect ke Google Sites
 *  - Tab switch, pencarian real-time + highlight, animasi reveal,
 *    ripple effect, toast, tombol scroll-to-top, skeleton loader Looker Studio
 * =============================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  const ACCENT = {
    green: { dot: "bg-cmGreen-500", badgeBg: "bg-cmGreen-50", badgeText: "text-cmGreen-700", badgeBorder: "border-cmGreen-200" },
    blue:  { dot: "bg-cmBlue-500",  badgeBg: "bg-cmBlue-50",  badgeText: "text-cmBlue-700",  badgeBorder: "border-cmBlue-200" },
    red:   { dot: "bg-cmRed-500",   badgeBg: "bg-cmRed-50",   badgeText: "text-cmRed-600",   badgeBorder: "border-cmRed-200" },
    dark:  { dot: "bg-cmDark-800",  badgeBg: "bg-slate-100",  badgeText: "text-cmDark-800",  badgeBorder: "border-slate-300" }
  };
  const ICON_COLOR = {
    green: "bg-cmGreen-50 text-cmGreen-700 border-cmGreen-200",
    blue:  "bg-cmBlue-50 text-cmBlue-700 border-cmBlue-200",
    red:   "bg-cmRed-50 text-cmRed-600 border-cmRed-200"
  };

  const portalRoot = document.getElementById("portalContent");
  const tabsRoot = document.getElementById("tabsRoot");
  const unitKeys = Object.keys(SCHOOL_DATA);

  /* ---------------- Bangun tombol tab ---------------- */
  const TAB_ICON = { tk: "fa-apple-whole", sd: "fa-shapes", smp: "fa-book-open", sma: "fa-graduation-cap" };
  tabsRoot.innerHTML = unitKeys.map((key, i) => `
    <button onclick="switchTab('${key}')" id="tab-${key}"
      class="tab-btn ${i === 0 ? "active" : "text-slate-700"} flex-1 min-w-[110px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold text-center flex items-center justify-center gap-2 hover:bg-white/70">
      <i class="fa-solid ${TAB_ICON[key]} text-sm"></i><span>${key.toUpperCase()}</span>
    </button>`).join("");

  /* ---------------- Bangun 1 kartu ---------------- */
  function buildCard(unitKey, unit, item, index) {
    const url = item.url || unit.baseUrl;
    const dataTitle = `${item.title} ${unitKey.toUpperCase()}`;
    const trackAttrs = `data-unit="${unitKey}" data-materi="${item.title}" data-url="${url}"`;
    const delay = `style="animation-delay:${index * 35}ms"`;

    if (unit.layout === "fruit") {
      return `
        <a href="${url}" target="_blank" rel="noopener" ${trackAttrs}
           class="fruit-card ripple-wrap searchable-item reveal-card js-track" data-title="${dataTitle}" ${delay}>
          <div class="fruit-card-side">${item.title}</div>
          <div class="flex-1 flex flex-col justify-between pl-2 h-full">
            <div class="flex items-center justify-between"><span class="text-xs font-black text-slate-800">Buka Kelas</span><span class="text-2xl">${item.icon}</span></div>
            <span class="mt-2 text-cmGreen-700 text-[11px] font-bold flex items-center gap-1">Google Site <i class="fa-solid fa-arrow-right text-[10px]"></i></span>
          </div>
        </a>`;
    }
    if (unit.layout === "level") {
      return `
        <a href="${url}" target="_blank" rel="noopener" ${trackAttrs}
           class="ripple-wrap searchable-item reveal-card js-track bg-white p-5 rounded-2xl border border-slate-200 hover:border-cmBlue-500 hover:shadow-soft-blue transition-all flex items-center justify-between" data-title="${dataTitle}" ${delay}>
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-cmBlue-500 to-cmBlue-700 text-white flex items-center justify-center font-black text-xl shadow-sm">${item.number}</div>
            <div><h3 class="text-base font-extrabold text-slate-900">${item.title}</h3><p class="text-xs text-slate-500">Situs Pembelajaran</p></div>
          </div>
          <span class="text-cmBlue-600 font-bold text-xs flex items-center gap-1.5">Akses <i class="fa-solid fa-chevron-right text-[10px]"></i></span>
        </a>`;
    }
    /* layout === 'subject' */
    const c = ICON_COLOR[item.color] || ICON_COLOR.blue;
    return `
      <a href="${url}" target="_blank" rel="noopener" ${trackAttrs}
         class="ripple-wrap searchable-item reveal-card js-track bg-white p-5 rounded-2xl border border-slate-200 hover:border-cmBlue-400 hover:shadow-md transition-all flex items-center justify-between gap-3" data-title="${dataTitle}" ${delay}>
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-xl ${c} flex items-center justify-center text-lg border flex-shrink-0"><i class="fa-solid ${item.icon}"></i></div>
          <div><h3 class="font-extrabold text-slate-900 text-sm sm:text-base">${item.title}</h3><p class="text-xs text-slate-500">${item.desc}</p></div>
        </div>
        <i class="fa-solid fa-arrow-right text-slate-300 text-sm flex-shrink-0"></i>
      </a>`;
  }

  /* ---------------- Bangun 1 section unit ---------------- */
  function buildUnitSection(unitKey, unit, index) {
    const a = ACCENT[unit.accent] || ACCENT.blue;
    const grid = unit.layout === "fruit"
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5"
      : unit.layout === "level"
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";

    const cards = unit.items.map((item, i) => buildCard(unitKey, unit, item, i)).join("");

    return `
      <div id="content-${unitKey}" class="unit-content ${index === 0 ? "" : "hidden"}">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2 border-b border-slate-200 pb-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full ${a.dot} inline-block"></span>
              <h2 class="text-lg sm:text-2xl font-extrabold text-cmDark-800">${unit.label}</h2>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">${unit.desc}</p>
          </div>
          <span class="self-start sm:self-auto px-3 py-1 ${a.badgeBg} ${a.badgeText} rounded-full text-[11px] font-bold border ${a.badgeBorder}">${unit.badge}</span>
        </div>
        <div class="grid ${grid}">${cards}</div>
      </div>`;
  }

  portalRoot.innerHTML = unitKeys.map((key, i) => buildUnitSection(key, SCHOOL_DATA[key], i)).join("");

  /* ---------------- Statistik ringkas di hero ---------------- */
  const totalItems = unitKeys.reduce((sum, k) => sum + SCHOOL_DATA[k].items.length, 0);
  const heroStats = document.getElementById("heroStats");
  if (heroStats) {
    heroStats.innerHTML = `
      <div class="stat-chip px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold">${unitKeys.length} Jenjang</div>
      <div class="stat-chip px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold">${totalItems} Kelas &amp; Mapel</div>
      <div class="stat-chip px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold">4 Google Site Terhubung</div>`;
  }

  /* ---------------- Tab switching ---------------- */
  window.switchTab = function (unit) {
    document.querySelectorAll(".unit-content").forEach(el => el.classList.add("hidden"));
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.classList.remove("active");
      btn.classList.add("text-slate-700");
    });
    const targetContent = document.getElementById(`content-${unit}`);
    if (targetContent) {
      targetContent.classList.remove("hidden");
      targetContent.querySelectorAll(".reveal-card").forEach(card => {
        card.style.animation = "none";
        void card.offsetWidth; // restart animasi tiap ganti tab
        card.style.animation = "";
      });
    }
    const activeBtn = document.getElementById(`tab-${unit}`);
    if (activeBtn) { activeBtn.classList.add("active"); activeBtn.classList.remove("text-slate-700"); }

    if (typeof gtag === "function") {
      gtag("event", "select_tab", { tab_name: unit });
    }
  };

  /* ---------------- Pencarian real-time + highlight ---------------- */
  const searchInput = document.getElementById("globalSearch");
  const clearBtn = document.getElementById("clearSearch");
  const emptyState = document.getElementById("emptyState");

  function highlight(el, query) {
    const original = el.getAttribute("data-original-html") || el.innerHTML;
    el.setAttribute("data-original-html", original);
    if (!query) { el.innerHTML = original; return; }
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig");
    el.innerHTML = original.replace(regex, "<mark class=\"search-hit\">$1</mark>");
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.trim();
      const q = query.toLowerCase();
      clearBtn.classList.toggle("hidden", query.length === 0);

      let visibleAcrossAll = 0;
      document.querySelectorAll(".searchable-item").forEach(item => {
        const title = item.getAttribute("data-title")?.toLowerCase() || "";
        const text = item.innerText.toLowerCase();
        const match = !q || title.includes(q) || text.includes(q);
        item.style.display = match ? "" : "none";
        if (match) visibleAcrossAll++;
        const h3 = item.querySelector("h3, .fruit-card-side");
        if (h3) highlight(h3, query.length >= 2 ? query : "");
      });

      // kalau sedang mencari, otomatis pindah ke tab pertama yang punya hasil
      if (q) {
        unitKeys.forEach(key => {
          const section = document.getElementById(`content-${key}`);
          const hasVisible = section && [...section.querySelectorAll(".searchable-item")]
            .some(it => it.style.display !== "none");
          if (hasVisible && section.classList.contains("hidden")) {
            switchTab(key);
          }
        });
      }

      if (emptyState) emptyState.classList.toggle("show", visibleAcrossAll === 0);
    });
  }

  window.clearSearchInput = function () {
    if (searchInput) { searchInput.value = ""; searchInput.dispatchEvent(new Event("input")); searchInput.focus(); }
  };

  /* ---------------- Klik kartu materi: tracking GA4 + toast + ripple ---------------- */
  const toast = document.getElementById("redirectToast");
  const toastText = document.getElementById("redirectToastText");

  document.addEventListener("click", (e) => {
    const card = e.target.closest(".js-track");
    if (!card) return;

    // ripple effect
    const rect = card.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height);
    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    card.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);

    // GA4 event
    const materi = card.getAttribute("data-materi");
    const unit = card.getAttribute("data-unit");
    if (typeof gtag === "function") {
      gtag("event", "select_content", {
        content_type: "materi_pembelajaran",
        item_id: `${unit}-${materi}`,
        unit_jenjang: unit,
        nama_materi: materi,
        link_tujuan: card.getAttribute("data-url")
      });
    }

    // toast kecil "membuka Google Site..."
    if (toast && toastText) {
      toastText.textContent = `Membuka Google Site: ${materi}...`;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 1800);
    }
  });

  /* ---------------- Reveal animation saat scroll ---------------- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("reveal-card");
    });
  }, { threshold: 0.05 });
  document.querySelectorAll(".searchable-item").forEach(el => observer.observe(el));

  /* ---------------- Skeleton loader untuk iframe Looker Studio ---------------- */
  const lookerFrame = document.getElementById("lookerFrame");
  const lookerSkeleton = document.getElementById("lookerSkeleton");
  if (lookerFrame && lookerSkeleton) {
    lookerFrame.addEventListener("load", () => {
      lookerSkeleton.style.opacity = "0";
      setTimeout(() => lookerSkeleton.remove(), 400);
    });
  }

  /* ---------------- Tombol scroll-to-top ---------------- */
  const scrollBtn = document.getElementById("scrollTopBtn");
  window.addEventListener("scroll", () => {
    if (scrollBtn) scrollBtn.classList.toggle("show", window.scrollY > 480);
  });
  if (scrollBtn) {
    scrollBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---------------- Setup Analytics section (link laporan + embed) ---------------- */
  const fullReportLink = document.getElementById("fullReportLink");
  if (fullReportLink) fullReportLink.href = ANALYTICS_CONFIG.fullReportUrl;
  if (lookerFrame) lookerFrame.src = ANALYTICS_CONFIG.embedUrl;
});
