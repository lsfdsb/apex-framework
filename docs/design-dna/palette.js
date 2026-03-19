// APEX Design DNA — Global Palette Switcher
// Include this script in any page: <script src="palette.js"></script>
// Handles: palette selection, dark/light mode, scroll reveals, persistence

const PALETTES = {
  saas: {
    name: 'SaaS',
    dark: { bg:'#09090b', elevated:'#18181b', surface:'#27272a', border:'#27272a', borderHover:'#3f3f46',
      text:'#fafafa', secondary:'#a1a1aa', muted:'#71717a', accent:'#3b82f6', accentHover:'#2563eb',
      accentGlow:'rgba(59,130,246,0.12)', success:'#22c55e', warning:'#eab308', destructive:'#ef4444', info:'#60a5fa' },
    light: { bg:'#fafafa', elevated:'#ffffff', surface:'#f4f4f5', border:'#e4e4e7', borderHover:'#d4d4d8',
      text:'#18181b', secondary:'#52525b', muted:'#a1a1aa', accent:'#2563eb', accentHover:'#1d4ed8',
      accentGlow:'rgba(37,99,235,0.08)', success:'#16a34a', warning:'#ca8a04', destructive:'#dc2626', info:'#2563eb' }
  },
  editorial: {
    name: 'Editorial',
    dark: { bg:'#0f0d0b', elevated:'#1a1714', surface:'#24201b', border:'#2e2820', borderHover:'#3d3428',
      text:'#f5ebe0', secondary:'#b8a898', muted:'#7a6e60', accent:'#c45d3e', accentHover:'#a8492d',
      accentGlow:'rgba(196,93,62,0.12)', success:'#6bc46b', warning:'#d4a843', destructive:'#c45d3e', info:'#7cacbe' },
    light: { bg:'#faf9f6', elevated:'#ffffff', surface:'#f5f0eb', border:'#e8e0d8', borderHover:'#d4c8bc',
      text:'#1a1a1a', secondary:'#6b6560', muted:'#9c9590', accent:'#c45d3e', accentHover:'#a8492d',
      accentGlow:'rgba(196,93,62,0.06)', success:'#2d8659', warning:'#b8860b', destructive:'#c42b2b', info:'#3a7ca5' }
  },
  fintech: {
    name: 'Fintech',
    dark: { bg:'#0c1222', elevated:'#131c31', surface:'#1a2540', border:'#1e2d4a', borderHover:'#2a3f66',
      text:'#e8edf5', secondary:'#8899b8', muted:'#5c6e8f', accent:'#00d4aa', accentHover:'#00b892',
      accentGlow:'rgba(0,212,170,0.12)', success:'#00d4aa', warning:'#ffb547', destructive:'#ff5c5c', info:'#60a5fa' },
    light: { bg:'#f8fafc', elevated:'#ffffff', surface:'#f1f5f9', border:'#e2e8f0', borderHover:'#cbd5e1',
      text:'#0f172a', secondary:'#475569', muted:'#94a3b8', accent:'#0d9488', accentHover:'#0f766e',
      accentGlow:'rgba(13,148,136,0.08)', success:'#0d9488', warning:'#d97706', destructive:'#dc2626', info:'#2563eb' }
  },
  startup: {
    name: 'Startup',
    dark: { bg:'#0a0a0a', elevated:'#141414', surface:'#1e1e1e', border:'#282828', borderHover:'#383838',
      text:'#fafafa', secondary:'#a3a3a3', muted:'#666666', accent:'#fafafa', accentHover:'#e0e0e0',
      accentGlow:'rgba(250,250,250,0.08)', success:'#22c55e', warning:'#eab308', destructive:'#ef4444', info:'#60a5fa' },
    light: { bg:'#ffffff', elevated:'#f8f8f8', surface:'#f0f0f0', border:'#e5e5e5', borderHover:'#d4d4d4',
      text:'#0a0a0a', secondary:'#525252', muted:'#a3a3a3', accent:'#0a0a0a', accentHover:'#262626',
      accentGlow:'rgba(10,10,10,0.05)', success:'#16a34a', warning:'#ca8a04', destructive:'#dc2626', info:'#2563eb' }
  },
  creative: {
    name: 'Creative',
    dark: { bg:'#1a1614', elevated:'#242018', surface:'#2e2820', border:'#3d3428', borderHover:'#524638',
      text:'#f5ebe0', secondary:'#b8a898', muted:'#7a6e60', accent:'#e07850', accentHover:'#c8603a',
      accentGlow:'rgba(224,120,80,0.12)', success:'#6bc46b', warning:'#d4a843', destructive:'#e05454', info:'#7cacbe' },
    light: { bg:'#fdf8f4', elevated:'#ffffff', surface:'#f5ede5', border:'#e8ddd2', borderHover:'#d4c5b5',
      text:'#2c1e10', secondary:'#785840', muted:'#a08870', accent:'#d4603a', accentHover:'#b84a28',
      accentGlow:'rgba(212,96,58,0.08)', success:'#2d8659', warning:'#b8860b', destructive:'#c42b2b', info:'#3a7ca5' }
  }
};

function applyPalette(name, mode) {
  const p = PALETTES[name]?.[mode];
  if (!p) return;
  const r = document.documentElement.style;
  r.setProperty('--bg', p.bg); r.setProperty('--bg-elevated', p.elevated);
  r.setProperty('--bg-surface', p.surface); r.setProperty('--border', p.border);
  r.setProperty('--border-hover', p.borderHover); r.setProperty('--text', p.text);
  r.setProperty('--text-secondary', p.secondary); r.setProperty('--text-muted', p.muted);
  r.setProperty('--accent', p.accent); r.setProperty('--accent-hover', p.accentHover);
  r.setProperty('--accent-glow', p.accentGlow); r.setProperty('--success', p.success);
  r.setProperty('--warning', p.warning); r.setProperty('--destructive', p.destructive);
  r.setProperty('--info', p.info);
  // Update nav bg for theme
  const navBg = mode === 'dark' ? `rgba(${hexToRgb(p.bg)},0.7)` : `rgba(${hexToRgb(p.bg)},0.85)`;
  r.setProperty('--nav-bg', navBg);
  // CTA colors
  r.setProperty('--cta-bg', mode === 'dark' ? '#ffffff' : p.text);
  r.setProperty('--cta-text', mode === 'dark' ? p.bg : p.elevated);
  document.documentElement.setAttribute('data-theme', mode);
  localStorage.setItem('apex-palette', name);
  localStorage.setItem('apex-theme', mode);
  // Update active states in switcher
  document.querySelectorAll('.pal-dot').forEach(d => d.classList.toggle('active', d.dataset.palette === name));
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

function toggleTheme() {
  const current = localStorage.getItem('apex-theme') || 'dark';
  const palette = localStorage.getItem('apex-palette') || 'saas';
  applyPalette(palette, current === 'dark' ? 'light' : 'dark');
}

// Inject unified palette + background widget
function injectSwitcher() {
  // Unified widget replaces old separate switcher + bg widget
}

// Inject persistent nav
function injectNav() {
  const pages = [
    { href: 'index.html', label: 'Hub' },
    { href: 'design-system.html', label: 'System' },
    { href: 'landing.html', label: 'Landing' },
    { href: 'crm.html', label: 'CRM' },
    { href: 'ecommerce.html', label: 'Commerce' },
    { href: 'saas.html', label: 'SaaS' },
    { href: 'blog.html', label: 'Blog' },
    { href: 'portfolio.html', label: 'Portfolio' },
    { href: 'social.html', label: 'Social' },
    { href: 'lms.html', label: 'LMS' },
    { href: 'presentation.html', label: 'Slides' },
    { href: 'ebook.html', label: 'E-Book' },
    { href: 'backoffice.html', label: 'Admin' },
    { href: 'email.html', label: 'Email' },
    { href: 'patterns.html', label: 'Patterns' },
  ];
  const current = location.pathname.split('/').pop() || 'index.html';
  const oldNav = document.querySelector('nav');
  if (oldNav) oldNav.remove();

  const nav = document.createElement('nav');
  nav.innerHTML = `<div>
    <a href="index.html" class="apex-nav-logo">APEX <span>DNA</span></a>
    <div class="apex-nav-links">
      ${pages.map(p => `<a href="${p.href}" class="${current === p.href ? 'active' : ''}">${p.label}</a>`).join('')}
    </div>
  </div>`;
  document.body.prepend(nav);
}

// Styles for nav + switcher
const style = document.createElement('style');
style.textContent = `
  nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding: 0 32px;
    background: var(--nav-bg, rgba(8,8,10,0.7)); backdrop-filter: blur(20px) saturate(1.4);
    border-bottom: 1px solid var(--border); transition: background 0.4s, border-color 0.4s; }
  nav > div { max-width: 1200px; margin: 0 auto; display: flex; align-items: center;
    justify-content: space-between; height: 52px; }
  .apex-nav-logo { font-family: 'Inter',-apple-system,sans-serif; font-weight: 600; font-size: 14px;
    text-decoration: none; color: var(--text); letter-spacing: -0.02em; }
  .apex-nav-logo span { color: var(--text-muted); font-weight: 300; margin-left: 4px; font-size: 13px; }
  .apex-nav-links { display: flex; gap: 6px; }
  .apex-nav-links a { font-family: 'Inter',-apple-system,sans-serif; font-size: 13px;
    color: var(--text-muted); text-decoration: none; padding: 5px 12px;
    border-radius: 999px; transition: all 0.25s; }
  .apex-nav-links a:hover { color: var(--text); background: var(--accent-glow); transform: translateY(-1px); }
  .apex-nav-links a:active { transform: scale(0.95); }
  .apex-nav-links a.active { color: var(--accent); background: var(--accent-glow); font-weight: 500; }
  @media (max-width: 640px) {
    .apex-nav-links a { font-size: 11px; padding: 4px 8px; }
  }

  /* Unified widget — one icon, all controls */
  .apex-widget { position: fixed; bottom: 24px; left: 24px; z-index: 200; }
  .apex-widget-toggle { width: 40px; height: 40px; border-radius: 50%;
    background: var(--bg-elevated); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--text-secondary);
    transition: all 0.4s cubic-bezier(0.22,1,0.36,1);
    backdrop-filter: blur(12px); box-shadow: 0 4px 16px rgba(0,0,0,0.15); }
  .apex-widget-toggle:hover { border-color: var(--accent); color: var(--accent);
    transform: scale(1.1) rotate(90deg); box-shadow: 0 0 20px var(--accent-glow); }
  .apex-widget-toggle:active { transform: scale(0.95); }
  .apex-widget.open .apex-widget-toggle { border-color: var(--accent); color: var(--accent);
    transform: rotate(180deg); }
  .apex-widget-panel { position: absolute; bottom: 52px; left: 0;
    background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 16px;
    padding: 16px; min-width: 230px; backdrop-filter: blur(16px);
    box-shadow: 0 12px 48px rgba(0,0,0,0.25);
    opacity: 0; transform: translateY(10px) scale(0.92); pointer-events: none;
    transition: all 0.45s cubic-bezier(0.22,1,0.36,1); }
  .apex-widget.open .apex-widget-panel { opacity: 1; transform: translateY(0) scale(1); pointer-events: all; }
  .apex-widget-section { margin-bottom: 10px; }
  .apex-widget-section:last-child { margin-bottom: 0; }
  .apex-widget-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em;
    color: var(--text-muted); font-weight: 500; margin-bottom: 8px; }
  .apex-widget-divider { height: 1px; background: var(--border); margin: 12px 0; }
  .pal-row { display: flex; gap: 6px; }
  .pal-dot { width: 20px; height: 20px; border-radius: 50%; border: 2px solid transparent;
    cursor: pointer; transition: all 0.3s cubic-bezier(0.22,1,0.36,1); }
  .pal-dot:hover { transform: scale(1.25); box-shadow: 0 0 12px currentColor; }
  .pal-dot:active { transform: scale(0.9); }
  .pal-dot.active { border-color: var(--text); transform: scale(1.15); box-shadow: 0 0 8px currentColor; }
  .mode-row { display: flex; gap: 4px; }
  .mode-btn { background: none; border: 1px solid var(--border); border-radius: 8px;
    width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--text-muted); transition: all 0.3s cubic-bezier(0.22,1,0.36,1); }
  .mode-btn:hover { border-color: var(--text-muted); color: var(--text); transform: translateY(-1px); }
  .mode-btn:active { transform: scale(0.95); }
  .mode-btn.active { border-color: var(--accent); color: var(--accent); background: var(--accent-glow); }
  /* Hide old separate widgets if they exist */
  .palette-switcher { display: none !important; }
`;
document.head.appendChild(style);

// Scroll reveal observer — robust: handles already-visible + dynamically added
const observer = new IntersectionObserver(
  es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),
  { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
);
function observeReveals() {
  document.querySelectorAll('.reveal:not(.visible), .svg-draw:not(.visible)').forEach(el => observer.observe(el));
}
// MutationObserver to catch dynamically added elements
const mutObs = new MutationObserver(() => observeReveals());
mutObs.observe(document.body || document.documentElement, { childList: true, subtree: true });

// Inject unified design widget (palette + mode + backgrounds — one icon)
function injectBgWidget() {
  const patterns = ['none','dots','grid','topo','circuit','constellation','diamonds','diagonals','hexagons','isometric','waves','dna','noise'];
  const animated = [
    { key:'none', label:'&times;' }, { key:'orbs', label:'orb' }, { key:'aurora', label:'aur' },
    { key:'particles', label:'par' }, { key:'gradient', label:'grd' }, { key:'rings', label:'rng' },
    { key:'matrix', label:'mtx' }, { key:'nebula', label:'neb' }, { key:'spotlight', label:'spt' }
  ];
  const el = document.createElement('div');
  el.className = 'apex-widget';
  el.innerHTML = `
    <button class="apex-widget-toggle" onclick="this.parentElement.classList.toggle('open')" aria-label="Design settings">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
    </button>
    <div class="apex-widget-panel">
      <div class="apex-widget-section">
        <div class="apex-widget-label">Palette</div>
        <div class="pal-row">
          ${Object.entries(PALETTES).map(([k,v]) =>
            `<button class="pal-dot" data-palette="${k}" title="${v.name}"
              style="background:${v.dark.accent};" onclick="applyPalette('${k}', localStorage.getItem('apex-theme')||'dark')"></button>`
          ).join('')}
        </div>
      </div>
      <div class="apex-widget-section">
        <div class="apex-widget-label">Mode</div>
        <div class="mode-row">
          <button class="mode-btn" data-mode="dark" onclick="applyPalette(localStorage.getItem('apex-palette')||'saas','dark')" title="Dark">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          </button>
          <button class="mode-btn" data-mode="light" onclick="applyPalette(localStorage.getItem('apex-palette')||'saas','light')" title="Light">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          </button>
        </div>
      </div>
      <div class="apex-widget-divider"></div>
      <div class="apex-widget-section">
        <div class="apex-widget-label">Pattern</div>
        <div class="bg-widget-grid">
          ${patterns.map(p => `<button class="bg-opt${p==='none'?' active':''}" data-pattern="${p}" onclick="setBgPattern('${p}')" title="${p}">${p === 'none' ? '&times;' : p.slice(0,3)}</button>`).join('')}
        </div>
      </div>
      <div class="apex-widget-section">
        <div class="apex-widget-label">Animated</div>
        <div class="bg-widget-grid">
          ${animated.map(a => `<button class="bg-opt" data-abg="${a.key}" onclick="setAnimBg('${a.key}')" title="${a.key === 'none' ? 'None' : a.key}">${a.label}</button>`).join('')}
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(el);
}

function setBgPattern(name) {
  document.querySelectorAll('.bg-opt[data-pattern]').forEach(b => b.classList.toggle('active', b.dataset.pattern === name));
  if (name === 'none') { document.body.style.backgroundImage = 'none'; localStorage.removeItem('apex-bg'); return; }
  if (typeof injectBg === 'function') injectBg(name, document.body);
  localStorage.setItem('apex-bg', name);
}

function setAnimBg(name) {
  document.querySelectorAll('.bg-opt[data-abg]').forEach(b => b.classList.toggle('active', b.dataset.abg === name));
  // Clean up: remove bg layer and any stray children
  const layer = document.getElementById('apex-bg-layer');
  if (layer) layer.innerHTML = '';
  document.querySelectorAll('.apex-animated-bg-child').forEach(e => e.remove());
  // Reset body overflow in case it was set
  document.body.style.overflow = '';
  if (name === 'none') { localStorage.removeItem('apex-abg'); return; }
  if (typeof injectAnimatedBg === 'function') injectAnimatedBg(name, document.body);
  localStorage.setItem('apex-abg', name);
}

// Inject footer
function injectFooter() {
  const old = document.querySelector('footer');
  if (old) old.remove();
  const footer = document.createElement('footer');
  footer.className = 'apex-footer';
  footer.innerHTML = `
    <div class="apex-footer-inner">
      <div>
        <a href="index.html" class="apex-nav-logo" style="display:inline-block;margin-bottom:10px;">APEX <span>DNA</span></a>
        <p style="font-size:13px;color:var(--text-muted);line-height:1.6;max-width:220px;">Premium design patterns.<br>Every pixel earns its place.</p>
      </div>
      <div class="apex-footer-links">
        <div class="apex-footer-col">
          <div class="apex-footer-col-title">Patterns</div>
          <a href="landing.html">Landing</a>
          <a href="crm.html">CRM</a>
          <a href="ecommerce.html">Commerce</a>
          <a href="patterns.html">Backgrounds</a>
        </div>
        <div class="apex-footer-col">
          <div class="apex-footer-col-title">System</div>
          <a href="design-system.html">Tokens</a>
          <a href="design-system.html">Typography</a>
          <a href="design-system.html">Motion</a>
        </div>
      </div>
    </div>
    <div class="apex-footer-bottom">
      <p>&copy; 2026 Lucas Bueno &amp; Claude. All rights reserved.</p>
    </div>
  `;
  document.body.appendChild(footer);
}

// Styles for footer + bg widget
style.textContent += `
  .apex-footer { font-family: 'Inter',-apple-system,sans-serif; padding: 64px 32px 32px;
    border-top: 1px solid var(--border); position: relative; z-index: 1;
    transition: background-color 0.4s, border-color 0.4s; }
  .apex-footer-inner { max-width: 1200px; margin: 0 auto; display: flex;
    justify-content: space-between; gap: 64px; margin-bottom: 40px; }
  .apex-footer-links { display: flex; gap: 56px; }
  .apex-footer-col { display: flex; flex-direction: column; gap: 6px; }
  .apex-footer-col-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em;
    color: var(--text-muted); font-weight: 500; margin-bottom: 6px; }
  .apex-footer-col a { font-size: 13px; color: var(--text-secondary); text-decoration: none;
    transition: color 0.2s; }
  .apex-footer-col a:hover { color: var(--text); }
  .apex-footer-bottom { max-width: 1200px; margin: 0 auto; padding-top: 20px;
    border-top: 1px solid var(--border); }
  .apex-footer-bottom p { font-size: 11px; color: var(--text-muted); }
  @media (max-width: 640px) {
    .apex-footer-inner { flex-direction: column; gap: 32px; }
    .apex-footer-links { gap: 32px; }
  }

  .bg-widget-grid { display: flex; flex-wrap: wrap; gap: 4px; }
  .bg-opt { padding: 3px 7px; font-size: 10px; border: 1px solid var(--border);
    border-radius: 6px; background: none; color: var(--text-muted); cursor: pointer;
    font-family: var(--font-body, Inter, sans-serif);
    transition: all 0.3s cubic-bezier(0.22,1,0.36,1); }
  .bg-opt:hover { border-color: var(--text-muted); color: var(--text); transform: translateY(-1px); }
  .bg-opt:active { transform: scale(0.95); }
  .bg-opt.active { border-color: var(--accent); color: var(--accent); background: var(--accent-glow); }

  /* Widget entrance micro-animation */
  .apex-widget { animation: apex-widget-enter 0.6s cubic-bezier(0.22,1,0.36,1) backwards; animation-delay: 0.3s; }
  @keyframes apex-widget-enter { from { opacity:0; transform:translateY(12px) scale(0.9); } }
`;

// Initialize — run immediately if DOM ready, otherwise wait
function init() {
  // Safety: ensure body is scrollable (animated bg widget bug could lock it)
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
  injectNav();
  injectSwitcher();
  injectBgWidget();
  injectFooter();
  const palette = localStorage.getItem('apex-palette') || 'saas';
  const mode = localStorage.getItem('apex-theme') || 'dark';
  applyPalette(palette, mode);
  const savedBg = localStorage.getItem('apex-bg');
  if (savedBg) setBgPattern(savedBg);
  const savedAbg = localStorage.getItem('apex-abg');
  if (savedAbg) setAnimBg(savedAbg);
  observeReveals();
  setTimeout(observeReveals, 100);
  setTimeout(observeReveals, 500);
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
