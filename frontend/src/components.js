// ─── REUSABLE COMPONENT FUNCTIONS ─────────────────────────
//
// Each function takes data and returns an HTML string.
// These are the vanilla JS equivalent of React components.
//
// RULE: Components don't attach event listeners.
//       They only return HTML strings.
//       Event listeners are attached in views/ or main.js
//       after the HTML is inserted into the DOM.
//
// WHY: innerHTML wipes all listeners. Keeping logic separate
//      from markup makes this predictable and debuggable.

const navLinkClass = 'text-[0.72rem] font-semibold tracking-[0.2em] uppercase text-muted hover:text-purple-bright transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(155,89,247,0.5)]'

// ── Nav ──────────────────────────────────────────────────
// Used on EVERY page — rendered once in main.js, never re-rendered.
// Links use href="/shop" etc. — the router intercepts these clicks.
export function Nav(links, currentPath = '/') {
  const linkItems = links.map(({ href, label }) => {
    const isActive = href === currentPath
    const activeClass = isActive ? 'text-purple-bright' : ''
    return `<li><a href="${href}" class="${navLinkClass} ${activeClass}">${label}</a></li>`
  }).join('')

  return `
    <nav class="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-4 lg:px-14 bg-void/70 backdrop-blur-xl border-b border-border">
      <a href="/" class="logo font-bebas text-3xl tracking-[0.15em] text-purple-bright relative drop-shadow-[0_0_20px_rgba(155,89,247,0.4)]">THE FIELD</a>
      <ul class="nav-links hidden md:flex gap-10">${linkItems}</ul>
      <div class="nav-right flex items-center gap-4">
        <button class="cart-btn group flex items-center gap-2 px-5 py-2 border border-purple/50 rounded-sm text-[0.72rem] font-semibold tracking-widest uppercase text-purple-bright transition-all hover:bg-purple/10 hover:shadow-[0_0_20px_rgba(155,89,247,0.3)]">
          ⬡ Cart <span class="cart-count bg-purple text-white w-4 h-4 rounded-full text-[0.65rem] flex items-center justify-center">3</span>
        </button>
      </div>
    </nav>`
}

// ── Marquee ───────────────────────────────────────────────
export function Marquee(items) {
  const all  = [...items, ...items]
  const spans = all.map(text =>
    `<span class="flex items-center gap-4 font-space text-[0.65rem] tracking-[0.2em] uppercase text-purple">
      <span class="w-1 h-1 rounded-full bg-purple shadow-[0_0_8px_#9b59f7]"></span>${text}
    </span>`
  ).join('')

  return `
    <div class="marquee-wrap relative z-10 border-y border-border py-4 overflow-hidden bg-gradient-to-r from-void via-purple/5 to-void">
      <div class="marquee-track flex gap-16 whitespace-nowrap">${spans}</div>
    </div>`
}

// ── FeatureCard ───────────────────────────────────────────
export function FeatureCard({ icon, title, desc }, isLast = false) {
  const border = isLast ? '' : 'border-r border-border'
  return `
    <div class="feat-item p-10 ${border} hover:bg-purple/5 transition-all relative overflow-hidden group">
      <div class="text-2xl mb-4 drop-shadow-[0_0_8px_#9b59f7]">${icon}</div>
      <h4 class="font-bebas text-lg tracking-widest mb-2">${title}</h4>
      <p class="text-[0.75rem] font-light text-muted leading-relaxed">${desc}</p>
      <div class="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
    </div>`
}

// ── ProductCard ───────────────────────────────────────────
// Used in HomeView AND ShopView — one component, two places.
export function ProductCard({ id, shape, shapeClass, bg, badge, wishlist, category, categoryIcon, name, price, original }) {
  const badgeHtml = badge
    ? `<div class="absolute top-3 left-3 border border-purple/40 bg-void/80 px-2 py-1 font-space text-[0.58rem] tracking-widest text-purple-bright uppercase">${badge}</div>`
    : ''
  const wishlistHtml = wishlist
    ? `<div class="absolute top-3 right-3 w-8 h-8 border border-border bg-void/70 flex items-center justify-center text-muted transition-all hover:text-purple-bright hover:border-purple cursor-pointer">♡</div>`
    : ''
  const originalHtml = original
    ? `<span class="text-xs text-muted line-through ml-2 font-light">${original}</span>`
    : ''

  return `
    <div class="bg-void p-0 group overflow-hidden transition-colors duration-500 hover:bg-surface" data-product-id="${id}">
      <div class="h-80 overflow-hidden relative flex items-center justify-center" style="background: ${bg}">
        <div class="${shape} ${shapeClass} transition-transform duration-700 group-hover:scale-105"></div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(155,89,247,0.15)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
        ${badgeHtml}
        ${wishlistHtml}
      </div>
      <div class="p-8">
        <div class="font-space text-[0.58rem] tracking-[0.2em] text-purple uppercase mb-2">${categoryIcon} ${category}</div>
        <h3 class="font-bebas text-2xl tracking-wider mb-5">${name}</h3>
        <div class="flex justify-between items-center">
          <span class="text-xl font-semibold text-lavender">${price} ${originalHtml}</span>
          <button class="add-to-cart px-5 py-2 border border-purple text-purple-bright text-[0.65rem] font-semibold uppercase tracking-widest transition-all hover:bg-purple/15 hover:shadow-[0_0_20px_rgba(155,89,247,0.3)]" data-id="${id}">+ Add</button>
        </div>
      </div>
    </div>`
}

// ── StatCard ──────────────────────────────────────────────
export function StatCard({ value, label }, isLast = false) {
  const border = isLast ? '' : 'border-r border-border'
  return `
    <div class="stat p-12 text-center ${border} bg-[radial-gradient(ellipse_at_50%_100%,rgba(155,89,247,0.05)_0%,transparent_70%)]">
      <div class="font-bebas text-6xl text-purple-bright drop-shadow-[0_0_30px_rgba(155,89,247,0.35)] mb-2">${value}</div>
      <div class="text-[0.7rem] tracking-[0.2em] text-muted uppercase">${label}</div>
    </div>`
}

// ── Stars ─────────────────────────────────────────────────
export function Stars(size = 'xs') {
  return '★★★★★'.split('').map(s =>
    `<span class="text-purple text-${size} drop-shadow-[0_0_8px_#9b59f7]">${s}</span>`
  ).join('')
}

// ── Testimonials ──────────────────────────────────────────
export function TestimonialFeatured({ quote, initials, name, role }) {
  return `
    <div class="testi-featured p-14 border-b lg:border-b-0 lg:border-r border-border bg-[radial-gradient(ellipse_at_0%_0%,rgba(155,89,247,0.08)_0%,transparent_70%)] flex flex-col justify-between">
      <div>
        <div class="font-bebas text-9xl text-purple opacity-25 leading-none -ml-4 mb-4">"</div>
        <p class="text-xl font-light italic leading-relaxed text-lavender mb-8">${quote}</p>
        <div class="flex items-center gap-4">
          <div class="w-11 h-11 rounded-full border border-purple bg-[radial-gradient(circle,rgba(90,47,160,1),#04010a)] flex items-center justify-center font-bebas text-purple-bright text-sm tracking-widest">${initials}</div>
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
    <div class="testi-card p-10 bg-deep hover:bg-purple/5 transition-all relative group overflow-hidden">
      <div class="flex gap-1 mb-4">${Stars('[0.75rem]')}</div>
      <p class="text-[0.82rem] font-light italic leading-relaxed text-muted mb-6">${quote}</p>
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full border border-purple/30 bg-purple-dim flex items-center justify-center font-bold text-purple-bright text-[0.65rem]">${initials}</div>
        <div>
          <div class="text-[0.72rem] font-semibold tracking-widest uppercase">${name}</div>
          <div class="text-[0.65rem] text-muted">${role}</div>
        </div>
      </div>
      <div class="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-purple to-transparent scale-y-0 group-hover:scale-y-100 transition-transform duration-500"></div>
    </div>`
}

// ── Footer ────────────────────────────────────────────────
// Used on EVERY page — rendered once in main.js.
export function Footer(links) {
  const columns = Object.entries(links).map(([heading, items]) => {
    const listItems = items.map(label =>
      `<li><a href="#" class="text-[0.75rem] tracking-widest text-muted hover:text-purple-bright transition-all">${label}</a></li>`
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
        <a href="/" class="font-bebas text-4xl tracking-widest text-purple-bright drop-shadow-[0_0_20px_rgba(155,89,247,0.4)] mb-4 block">THE FIELD</a>
        <p class="text-[0.78rem] font-light tracking-widest text-muted leading-relaxed max-w-[260px] mb-6">Objects channeled from the space between thought and form. Transmitting from the void since 2021.</p>
        <div class="flex gap-2">
          <a href="#" class="w-9 h-9 border border-border flex items-center justify-center text-muted hover:border-purple hover:text-purple-bright transition-all">𝕏</a>
          <a href="#" class="w-9 h-9 border border-border flex items-center justify-center text-muted hover:border-purple hover:text-purple-bright transition-all">◎</a>
          <a href="#" class="w-9 h-9 border border-border flex items-center justify-center text-muted hover:border-purple hover:text-purple-bright transition-all">⬡</a>
        </div>
      </div>
      ${columns}
    </footer>
    <div class="border-t border-border px-6 lg:px-20 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[0.65rem] tracking-widest uppercase text-muted relative z-10">
      <span>© 2026 The Field Studio. All frequencies reserved.</span>
      <div class="flex gap-6"><span>Privacy</span><span>Terms</span><span>Signal Policy</span></div>
    </div>`
}

// ── GlowLine ──────────────────────────────────────────────
export function GlowLine() {
  return `<div class="glow-line h-[1px] w-full bg-gradient-to-r from-transparent via-purple-dim via-purple-bright via-purple-dim to-transparent shadow-[0_0_10px_1px_rgba(155,89,247,0.35)] relative z-10"></div>`
}