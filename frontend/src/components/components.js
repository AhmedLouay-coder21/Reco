import { Login } from '../pages/login.js';


const localStorageTheme = localStorage.getItem("theme");
const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");

//Theme toggle through looking at the local storage
function calculateSettingAsThemeString({ localStorageTheme, systemSettingDark }) {
  if (localStorageTheme !== null) {
    return localStorageTheme;
  }

  if (systemSettingDark.matches) {
    return "dark";
  }

  return "light";
}


let currentThemeSetting = calculateSettingAsThemeString({ localStorageTheme, systemSettingDark });


const navLinkClass = 'text-[0.72rem] font-semibold tracking-[0.2em] uppercase text-muted hover:text-line-bright transition-all duration-300 hover:drop-shadow-[0_0_12px_var(--color-cursor-ring)]'

export function Nav(links, currentPath = '/' , Login) {
  const linkItems = links.map(({ href, label }) => {
    const isActive = href === currentPath
    const activeClass = isActive ? 'text-line-bright' : ''
    return `<li><a href="${href}" class="${navLinkClass} ${activeClass}">${label}</a></li>`
  }).join('')

  return `
    <nav class="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-4 lg:px-14 bg-main/70 backdrop-blur-lg border-b border-border">
      <a href="/" class="logo font-bebas text-3xl tracking-[0.15em] text-line-bright relative drop-shadow-[0_0_20px_var(--color-line-bright)] text-title">THE FIELD</a>
      <ul class="nav-links hidden md:flex gap-10">${linkItems}</ul>
      <div class="nav-right flex items-center gap-4">
        <button id="loginBtn" class="cart-btn group flex items-center gap-2 px-5 py-2 border border-secondary/50 rounded-sm text-[0.72rem] font-semibold tracking-widest uppercase text-line-bright transition-all hover:bg-secondary/10 hover:shadow-[0_0_20px_var(--color-pulse-glow1)]">
          ⬡ Login
        </button>
        <button onclick="document.documentElement.classList.toggle('dark')"
            class="h-12 w-12 rounded-lg p-2 hover:bg-secondary/10 transition-all flex items-center justify-center">
          
          <svg class="fill-violet-700 block dark:hidden w-6 h-6" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
          </svg>

          <svg class="fill-yellow-500 hidden dark:block w-6 h-6" viewBox="0 0 20 20">
              <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill-rule="evenodd" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    </nav>
    `
}

export function Marquee(items) {
  const all  = [...items, ...items]
  const spans = all.map(text =>
    `<span class="flex items-center gap-4 font-space text-[0.65rem] tracking-[0.2em] uppercase text-secondary">
      <span class="w-1 h-1 rounded-full bg-secondary shadow-[0_0_8px_#9b59f7]"></span>${text}
    </span>`
  ).join('')

  return `
    <div class="marquee-wrap relative z-10 border-y border-border py-4 overflow-hidden bg-gradient-to-r from-main via-secondary/5 to-main">
      <div class="marquee-track flex gap-16 whitespace-nowrap">${spans}</div>
    </div>`
}

export function FeatureCard({ icon, title, desc }, isLast = false) {
  const border = isLast ? '' : 'border-r border-border'
  return `
    <div class="feat-item p-10 ${border} hover:bg-secondary/5 transition-all relative overflow-hidden group">
      <div class="text-2xl mb-4 drop-shadow-[0_0px_8px_var(--color-secondary)]">${icon}</div>
      <h4 class="font-bebas text-lg tracking-widest mb-2">${title}</h4>
      <p class="text-[0.75rem] font-light text-muted leading-relaxed">${desc}</p>
      <div class="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-secondary to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
    </div>`
}


export function ProductCard({ id, shape, shapeClass, bg, badge, wishlist, category, categoryIcon, name, price, original }) {
  const badgeHtml = badge
    ? `<div class="absolute top-3 left-3 border border-secondary/40 bg-main/80 px-2 py-1 font-space text-[0.58rem] tracking-widest text-line-bright uppercase">${badge}</div>`
    : ''
  const wishlistHtml = wishlist
    ? `<div class="absolute top-3 right-3 w-8 h-8 border border-border bg-main/70 flex items-center justify-center text-muted transition-all hover:text-line-bright hover:border-secondary cursor-pointer">♡</div>`
    : ''
  const originalHtml = original
    ? `<span class="text-xs text-muted line-through ml-2 font-light">${original}</span>`
    : ''

  return `
    <div class="bg-main p-0 group overflow-hidden transition-colors duration-500 hover:bg-surface" data-product-id="${id}">
      <div class="h-80 overflow-hidden relative flex items-center justify-center" style="background: ${bg}">
        <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="No image here">
        ${badgeHtml}
        ${wishlistHtml}
      </div>
      <div class="p-8">
        <div class="font-space text-[0.58rem] tracking-[0.2em] text-secondary uppercase mb-2">${categoryIcon} ${category}</div>
        <h3 class="font-bebas text-2xl tracking-wider mb-5">${name}</h3>
        <div class="flex justify-between items-center">
          <span class="text-xl font-semibold text-lavender">${price} ${originalHtml}</span>
          <button class="add-to-cart px-5 py-2 border border-secondary text-line-bright text-[0.65rem] font-semibold uppercase tracking-widest transition-all hover:bg-secondary/15 hover:shadow-[0_0_20px_var(--color-pulse-glow3)]" data-id="${id}">+ Add</button>
        </div>
      </div>
    </div>`
}


export function StatCard({ value, label }, isLast = false) {
  const border = isLast ? '' : 'border-r border-border'
  return `
    <div class="stat p-12 text-center ${border} bg-[radial-gradient(ellipse_at_50%_100%,rgba(155,89,247,0.05)_0%,transparent_70%)]">
      <div class="font-bebas text-6xl text-line-bright drop-shadow-[0_0_30px_--color-pulse-glow1] mb-2">${value}</div>
      <div class="text-[0.7rem] tracking-[0.2em] text-muted uppercase">${label}</div>
    </div>`
}


export function Stars(size = 'xs') {
  return '★★★★★'.split('').map(s =>
    `<span class="text-secondary text-${size} drop-shadow-[0_0_8px_#9b59f7]">${s}</span>`
  ).join('')
}

export function TestimonialFeatured({ quote, initials, name, role }) {
  return `
    <div class="testi-featured p-14 border-b lg:border-b-0 lg:border-r border-border bg-[radial-gradient(ellipse_at_0%_0%,rgba(155,89,247,0.08)_0%,transparent_70%)] flex flex-col justify-between">
      <div>
        <div class="font-bebas text-9xl text-secondary opacity-25 leading-none -ml-4 mb-4">"</div>
        <p class="text-xl font-light italic leading-relaxed text-lavender mb-8">${quote}</p>
        <div class="flex items-center gap-4">
          <div class="w-11 h-11 rounded-full border border-secondary bg-[radial-gradient(circle,rgba(90,47,160,1),#04010a)] flex items-center justify-center font-bebas text-line-bright text-sm tracking-widest">${initials}</div>
          <div>
            <div class="text-sm font-semibold tracking-widest uppercase">${name}</div>
            <div class="text-[0.7rem] text-muted tracking-widest uppercase">${role}</div>
          </div>
        </div>
      </div>
      <div class="flex gap-1 mt-8">${Stars('xs')}</div>
    </div>`
}

export function TestimonialCard({ quote, initials, name, role }) {
  return `
    <div class="testi-card p-10 bg-deep hover:bg-secondary/5 transition-all relative group overflow-hidden" style="
    background-color: var(--color-main);
">
      <div class="flex gap-1 mb-4">${Stars('[0.75rem]')}</div>
      <p class="text-[0.82rem] font-light italic leading-relaxed text-muted mb-6">${quote}</p>
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full border border-secondary/30 bg-line-dim flex items-center justify-center font-bold text-line-bright text-[0.65rem]">${initials}</div>
        <div>
          <div class="text-[0.72rem] font-semibold tracking-widest uppercase">${name}</div>
          <div class="text-[0.65rem] text-muted">${role}</div>
        </div>
      </div>
      <div class="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-secondary to-transparent scale-y-0 group-hover:scale-y-100 transition-transform duration-500"></div>
    </div>`
}

export function Footer(links) {
  const columns = Object.entries(links).map(([heading, items]) => {
    const listItems = items.map(label =>
      `<li><a href="#" class="text-[0.75rem] tracking-widest text-muted hover:text-line-bright transition-all">${label}</a></li>`
    ).join('')
    return `
      <div>
        <h4 class="font-bebas text-lg tracking-[0.2em] mb-6 uppercase">${heading}</h4>
        <ul class="flex flex-col gap-2.5">${listItems}</ul>
      </div>`
  }).join('')

  return `
    <footer class="border-t border-border px-6 lg:px-20 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
      <div>
        <a href="/" class="font-bebas text-4xl tracking-widest text-line-bright drop-shadow-[0_0_20px_var(--color-pulse-glow2)] mb-4 block">THE FIELD</a>
        <p class="text-[0.78rem] font-light tracking-widest text-muted leading-relaxed max-w-[260px] mb-6">Objects channeled from the space between thought and form. Transmitting from the main since 2021.</p>
        <div class="flex gap-2">
          <a href="#" class="w-9 h-9 border border-border flex items-center justify-center text-muted hover:border-secondary hover:text-line-bright transition-all">𝕏</a>
          <a href="#" class="w-9 h-9 border border-border flex items-center justify-center text-muted hover:border-secondary hover:text-line-bright transition-all">◎</a>
          <a href="#" class="w-9 h-9 border border-border flex items-center justify-center text-muted hover:border-secondary hover:text-line-bright transition-all">⬡</a>
        </div>
      </div>
      ${columns}
    </footer>
    <div class="border-t border-border px-6 lg:px-20 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[0.65rem] tracking-widest uppercase text-muted relative z-10">
      <span>© 2026 The Field Studio. All frequencies reserved.</span>
      <div class="flex gap-6"><span>Privacy</span><span>Terms</span><span>Signal Policy</span></div>
    </div>`
}

export function GlowLine() 
{
  return `<div class="glow-line h-[1px] w-full bg-gradient-to-r from-transparent via-line-dim via-line-bright via-line-dim to-transparent shadow-[0_0_10px_1px_--color-pulse-glow1] relative z-10"></div>`
}