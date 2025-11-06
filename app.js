// app.js (новая версия)
(function(){
  // --- utils ---
  function qs(sel){ return document.querySelector(sel); }
  function qsa(sel){ return Array.from(document.querySelectorAll(sel)); }

  // --- Default state ---
  const THEME_KEY = 'saqsy_theme'; // 'dark' | 'light'
  const LANG_KEY = 'saqsy_lang';   // 'en'|'ru'|'kz'

  // --- Create topbar HTML if not present ---
  function ensureTopbar(){
    if (qs('#topbar')) return;

    const topbar = document.createElement('div');
    topbar.id = 'topbar';
    topbar.innerHTML = `
      <button id="themeBtn" aria-label="Toggle theme">Dark Mode</button>
      <div class="lang-dropdown" id="langWrapper">
        <button class="lang-toggle" id="langToggle">
          <span id="langLabel">English</span>
          <span class="chev">▾</span>
        </button>
        <div class="lang-list" id="langList">
          <div class="lang-item" data-lang="en">English</div>
          <div class="lang-item" data-lang="ru">Русский</div>
          <div class="lang-item" data-lang="kz">Қазақша</div>
        </div>
      </div>
    `;
    document.body.prepend(topbar);
  }

  // --- Theme handling ---
  function currentTheme(){ return localStorage.getItem(THEME_KEY) || 'dark'; }
  function applyTheme(t){
    const html = document.documentElement;
    if (t === 'light') html.classList.add('light-theme');
    else html.classList.remove('light-theme');

    // update button text
    const btn = qs('#themeBtn');
    if (btn) btn.textContent = (t === 'light') ? 'Light Mode' : 'Dark Mode';
    localStorage.setItem(THEME_KEY, t);
  }
  function toggleTheme(){
    const t = (currentTheme() === 'light') ? 'dark' : 'light';
    applyTheme(t);
  }

  // --- Language handling ---
  function currentLang(){ return localStorage.getItem(LANG_KEY) || 'en'; }
  function applyLang(lang){
    localStorage.setItem(LANG_KEY, lang);
    // update topbar label
    const label = qs('#langLabel');
    if (label){
      if (lang === 'en') label.textContent = 'English';
      else if (lang === 'ru') label.textContent = 'Русский';
      else if (lang === 'kz') label.textContent = 'Қазақша';
    }
    // if page has updateLang() function (our pages do), call it
    try { if (typeof window.updateLang === 'function') window.updateLang(); } catch(e){ console.warn(e); }
  }

  // --- Wire events for dropdown and theme ---
  function wireTopbar(){
    const themeBtn = qs('#themeBtn');
    if (themeBtn) themeBtn.onclick = toggleTheme;

    const langToggle = qs('#langToggle');
    const langList = qs('#langList');

    if (langToggle && langList){
      langToggle.onclick = (e) => {
        langList.classList.toggle('show');
      };
      // clicking outside closes the list
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.lang-dropdown')) langList.classList.remove('show');
      });
      // click on item
      qsa('.lang-item').forEach(it => {
        it.onclick = () => {
          const L = it.getAttribute('data-lang');
          applyLang(L);
          langList.classList.remove('show');
        };
      });
    }
  }

  // --- Init ---
  document.addEventListener('DOMContentLoaded', () => {
    ensureTopbar();
    applyTheme(currentTheme());
    applyLang(currentLang());
    wireTopbar();

    // expose helpers globally for backward compatibility if needed
    window.saqsy = window.saqsy || {};
    window.saqsy.toggleTheme = toggleTheme;
    window.saqsy.setLang = applyLang;
  });

})();
