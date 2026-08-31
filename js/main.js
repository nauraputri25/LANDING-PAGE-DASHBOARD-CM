document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial State & Elements Setup
  const currentYearSpan = document.getElementById('year');
  if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();

  let activeTab = 'tk';
  let searchQuery = '';

  const tabsRoot = document.getElementById('tabsRoot');
  const portalContent = document.getElementById('portalContent');
  const emptyState = document.getElementById('emptyState');
  const globalSearch = document.getElementById('globalSearch');
  const clearSearchBtn = document.getElementById('clearSearch');
  const heroStats = document.getElementById('heroStats');
  const lookerFrame = document.getElementById('lookerFrame');
  const lookerSkeleton = document.getElementById('lookerSkeleton');
  const fullReportLink = document.getElementById('fullReportLink');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  // 2. Setup Looker Studio Analytics Frame
  if (typeof LOOKER_STUDIO_URL !== 'undefined' && lookerFrame) {
    lookerFrame.src = LOOKER_STUDIO_URL;
    if (fullReportLink) fullReportLink.href = LOOKER_STUDIO_URL;
    
    lookerFrame.addEventListener('load', () => {
      if (lookerSkeleton) lookerSkeleton.classList.add('hidden');
    });
  }

  // 3. Render Hero Counter Statistics
  function renderHeroStats() {
    if (!heroStats || typeof PORTAL_DATA === 'undefined') return;
    
    let totalItems = 0;
    Object.keys(PORTAL_DATA).forEach(key => {
      totalItems += PORTAL_DATA[key].items ? PORTAL_DATA[key].items.length : 0;
    });

    heroStats.innerHTML = `
      <div class="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-slate-200">
        <span class="font-extrabold text-white">4</span> Unit Education
      </div>
      <div class="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-slate-200">
        <span class="font-extrabold text-cmBlue-400">${totalItems}</span> Portal Google Site Active
      </div>
    `;
  }

  // 4. Render Segmented Tab Navigation Controls
  function renderTabs() {
    if (!tabsRoot || typeof PORTAL_DATA === 'undefined') return;
    
    tabsRoot.innerHTML = Object.keys(PORTAL_DATA).map(key => {
      const unit = PORTAL_DATA[key];
      const isActive = key === activeTab;
      
      return `
        <button 
          onclick="switchTab('${key}')"
          class="flex-1 min-w-[90px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
            isActive 
              ? 'bg-white text-slate-900 shadow-md scale-[1.02]' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }">
          <i class="${unit.icon} ${isActive ? 'text-cmBlue-600' : 'text-slate-400'}"></i>
          <span>${unit.title}</span>
        </button>
      `;
    }).join('');
  }

  // 5. Global Tab Switching Handler (SPA Route Change)
  window.switchTab = async function(key) {
    if (!PORTAL_DATA[key]) return;
    activeTab = key;
    renderTabs();
    await loadViewComponent(key);
  };

  // 6. Asynchronous View Component Loader (Fetch API & Component Injector)
  async function loadViewComponent(key) {
    if (!portalContent) return;
    
    portalContent.innerHTML = `
      <div class="flex flex-col items-center justify-center py-16 gap-3">
        <div class="w-10 h-10 border-4 border-cmBlue-500 border-t-transparent rounded-full animate-spin"></div>
        <span class="text-xs font-bold text-slate-500">Memuat Modul ${PORTAL_DATA[key].title}...</span>
      </div>
    `;

    try {
      const response = await fetch(`components/${key}.html`);
      if (!response.ok) throw new Error('Failed to load component view');
      const htmlText = await response.text();
      portalContent.innerHTML = htmlText;
      
      // Inject cards based on active unit data and search query
      renderUnitCards(key);
    } catch (error) {
      console.warn('Fallback dynamic view rendering:', error);
      // Fallback component layout if fetch is constrained by local file protocol
      portalContent.innerHTML = `<div id="${key}Grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>`;
      renderUnitCards(key);
    }
  }

  // 7. Dynamic Card Rendering Engine
  function renderUnitCards(key) {
    const targetGrid = document.getElementById(`${key}Grid`);
    if (!targetGrid || typeof PORTAL_DATA === 'undefined') return;

    const unit = PORTAL_DATA[key];
    const filteredItems = unit.items.filter(item => {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        (item.tags && item.tags.some(t => t.toLowerCase().includes(q)))
      );
    });

    if (filteredItems.length === 0) {
      targetGrid.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    } else {
      if (emptyState) emptyState.classList.add('hidden');
    }

    if (key === 'tk') {
      // Playful Modern Fruit Cards Rendering
      targetGrid.innerHTML = filteredItems.map(item => `
        <div class="group bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
          <div class="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl ${item.color || 'from-amber-100'} to-transparent rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
          
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <span class="text-4xl filter drop-shadow-md group-hover:scale-110 transition-transform">${item.emoji || '🍎'}</span>
              <span class="px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-slate-100 text-slate-700 border border-slate-200">
                ${item.badge || 'Sentra'}
              </span>
            </div>
            
            <h3 class="text-lg font-black text-slate-900 mb-2 group-hover:text-cmBlue-600 transition-colors">${item.title}</h3>
            <p class="text-xs text-slate-500 leading-relaxed mb-6">${item.desc}</p>
          </div>

          <a href="${item.url}" target="_blank" onclick="handleCardClick('${item.title}')" 
            class="relative z-10 w-full py-3 rounded-2xl bg-slate-900 hover:bg-cmBlue-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95">
            <span>Buka Google Site</span>
            <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </a>
        </div>
      `).join('');
    } else {
      // Bento & Modern Academic Grid Rendering (SD, SMP, SMA)
      targetGrid.innerHTML = filteredItems.map(item => `
        <div class="group bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-cmBlue-600 text-xl font-black group-hover:bg-cmBlue-600 group-hover:text-white transition-all shadow-inner">
                <i class="${item.icon || 'fa-solid fa-book'}"></i>
              </div>
              <span class="px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-cmBlue-50 text-cmBlue-700 border border-cmBlue-100">
                ${item.badge || unit.title}
              </span>
            </div>

            <h3 class="text-lg font-black text-slate-900 mb-2 group-hover:text-cmBlue-600 transition-colors">${item.title}</h3>
            <p class="text-xs text-slate-500 leading-relaxed mb-4">${item.desc}</p>

            ${item.tags ? `
              <div class="flex flex-wrap gap-1.5 mb-6">
                ${item.tags.map(t => `<span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">#${t}</span>`).join('')}
              </div>
            ` : '<div class="mb-6"></div>'}
          </div>

          <a href="${item.url}" target="_blank" onclick="handleCardClick('${item.title}')" 
            class="w-full py-3 rounded-2xl bg-slate-900 hover:bg-cmBlue-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95">
            <span>Akses Google Site</span>
            <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
          </a>
        </div>
      `).join('');
    }
  }

  // 8. Omni-Search Engine Handler
  if (globalSearch) {
    globalSearch.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      
      if (searchQuery.length > 0) {
        if (clearSearchBtn) clearSearchBtn.classList.remove('hidden');
      } else {
        if (clearSearchBtn) clearSearchBtn.classList.add('hidden');
      }

      // Re-render active view cards with search filter
      renderUnitCards(activeTab);
    });
  }

  // Clear Search Action
  window.clearSearchInput = function() {
    if (globalSearch) {
      globalSearch.value = '';
      searchQuery = '';
      if (clearSearchBtn) clearSearchBtn.classList.add('hidden');
      renderUnitCards(activeTab);
    }
  };

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', window.clearSearchInput);
  }

  // 9. Toast Notification Handler
  window.handleCardClick = function(title) {
    const toast = document.getElementById('redirectToast');
    const toastText = document.getElementById('redirectToastText');
    
    if (toast && toastText) {
      toastText.textContent = `Membuka Google Site: ${title}...`;
      toast.classList.remove('opacity-0', 'translate-y-10', 'pointer-events-none');
      
      setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none');
      }, 3000);
    }
  };

  // 10. Scroll To Top Button Handler
  window.addEventListener('scroll', () => {
    if (!scrollTopBtn) return;
    if (window.scrollY > 400) {
      scrollTopBtn.classList.remove('opacity-0', 'translate-y-10');
    } else {
      scrollTopBtn.classList.add('opacity-0', 'translate-y-10');
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // INITIALIZATION RUN
  renderHeroStats();
  renderTabs();
  loadViewComponent(activeTab);
});