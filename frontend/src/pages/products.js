import { getUserFirstName, api, isAuthenticated, isTokenValid } from '../api/auth.js'
import { Login } from './login.js';
import { DashboardView } from './dashboard.js';
const token = () => localStorage.getItem('auth_token');

let state = {
  products: [],
  categories: [],
  totalPages: 0,
  totalElements: 0,
  page: 0,
  limit: 20,
  categoryId: '',
  q: '',
  sort: 'name',
  order: 'asc',
  view: 'grid',
  loading: false,
  selectedProduct: null,
  cart: [],
};

function applyCart(cartResponse) {
  state.cart = cartResponse?.items || [];
  updateCartBadge();
}

async function loadCart() {
  try {
    const cartResponse = await api('/cart');
    applyCart(cartResponse);
  } catch (_) {
    state.cart = [];
    updateCartBadge();
  }
}

export async function ProductsView() {
  const nav  = document.getElementById('nav-slot');
  const foot = document.getElementById('footer-slot');

  if (nav && nav.innerHTML.trim() === '') {
    const { renderLayout } = await import('../layout.js');

    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn && isAuthenticated() && isTokenValid()) 
    {
        loginBtn.className = "cart-btn group flex items-center justify-center w-12 h-12 rounded-full border border-line-bright text-line-bright transition-all hover:bg-secondary/10 hover:shadow-[0_0_20px_var(--color-pulse-glow1)]";
        loginBtn.textContent = getUserFirstName()[0].toUpperCase();
        
        loginBtn.addEventListener("click", () => {
            DashboardView();
        });
    }
    else if (loginBtn)
    {
        loginBtn.addEventListener('click', Login);
    }   
  }

  const app = document.getElementById('app');
  app.innerHTML = productsShell();

  await Promise.all([fetchCategories(), fetchProducts(), loadCart()]);

  // Make the hero visible using IntersectionObserver
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis') })
  }, { threshold: 0.1 })
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el))

  bindEvents();
}

function productsShell() {
  return `
    <!-- PAGE HERO STRIP -->
    <section class="products-hero relative pt-32 pb-16 px-6 lg:px-20 overflow-hidden">
      <!-- ambient orb -->
      <div class="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full"
           style="background:radial-gradient(circle,rgba(155,89,247,.18) 0%,transparent 70%);filter:blur(40px)"></div>

      <div class="reveal relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <p class="font-space text-[0.62rem] tracking-[0.35em] uppercase text-secondary mb-3">
            <span class="w-8 h-[1px] inline-block align-middle bg-gradient-to-r from-transparent to-secondary mr-3"></span>All Transmissions
          </p>
          <h1 class="font-bebas text-[clamp(3.5rem,10vw,8rem)] leading-none tracking-wider">
            THE <span class="text-line-bright drop-shadow-[0_0_40px_rgba(155,89,247,.5)]">CATALOG</span>
          </h1>
          <p id="product-count" class="font-space text-[0.68rem] tracking-[0.2em] uppercase text-muted mt-3">Loading objects…</p>
        </div>

        <!-- search -->
        <div class="relative group">
          <input id="search-input" type="text" value="${state.q}"
            placeholder="Search RECO…"
            class="products-search w-full md:w-[320px] bg-surface border border-border text-[0.8rem] text-(--color-white) placeholder:text-muted px-4 py-3 pr-12 font-josefin outline-none
                   focus:border-secondary focus:shadow-[0_0_20px_rgba(155,89,247,.2)] transition-all" />
          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-secondary transition-colors">⌕</span>
        </div>
      </div>
    </section>

    <!-- FILTERS + SORT BAR -->
    <div class="sticky top-[64px] z-40 bg-main/80 backdrop-blur-lg border-y border-border px-6 lg:px-20 py-3 flex flex-wrap items-center gap-3">
      <!-- category pills (populated by JS) -->
      <div id="cat-filters" class="flex flex-wrap gap-2 flex-1 min-w-0">
        <div class="text-[0.6rem] tracking-widest uppercase text-muted animate-pulse">Loading filters…</div>
      </div>

      <!-- sort -->
      <div class="flex items-center gap-2 ml-auto shrink-0">
        <span class="font-space text-[0.6rem] tracking-[0.25em] uppercase text-muted hidden sm:block">Sort</span>
        <select id="sort-select" class="bg-surface border border-border text-[0.68rem] tracking-[0.12em] uppercase text-(--color-white) px-3 py-1.5 font-josefin outline-none focus:border-secondary cursor-pointer">
          <option value="popularityScore|desc" ${state.sort === 'popularityScore' && state.order === 'desc' ? 'selected' : ''}>Popular</option>
          <option value="createdAt|desc"       ${state.sort === 'createdAt'       && state.order === 'desc' ? 'selected' : ''}>Newest</option>
          <option value="price|asc"            ${state.sort === 'price'           && state.order === 'asc'  ? 'selected' : ''}>Price ↑</option>
          <option value="price|desc"           ${state.sort === 'price'           && state.order === 'desc' ? 'selected' : ''}>Price ↓</option>
          <option value="avgRating|desc"       ${state.sort === 'avgRating'       && state.order === 'desc' ? 'selected' : ''}>Top Rated</option>
          <option value="name|asc"             ${state.sort === 'name'            && state.order === 'asc'  ? 'selected' : ''}>A → Z</option>
        </select>

        <!-- view toggle -->
        <button id="view-grid" title="Grid view"
          class="view-btn p-2 border ${state.view === 'grid' ? 'border-secondary text-line-bright bg-secondary/10' : 'border-border text-muted hover:border-secondary/50 hover:text-line-bright'} transition-all">
          ⊞
        </button>
        <button id="view-list" title="List view"
          class="view-btn p-2 border ${state.view === 'list' ? 'border-secondary text-line-bright bg-secondary/10' : 'border-border text-muted hover:border-secondary/50 hover:text-line-bright'} transition-all">
          ☰
        </button>
      </div>
    </div>

    <!-- PRODUCTS AREA -->
    <section class="px-6 lg:px-20 py-10 relative z-10">
      <div id="products-container">
        ${skeletonGrid()}
      </div>
      <!-- pagination -->
      <div id="pagination" class="mt-14 flex justify-center items-center gap-2"></div>
    </section>

    <!-- PRODUCT DETAIL DRAWER -->
    <div id="detail-overlay" class="fixed inset-0 z-[200] pointer-events-none">
      <!-- backdrop -->
      <div id="detail-backdrop" class="absolute inset-0 bg-main/0 backdrop-blur-none transition-all duration-500"></div>
      <!-- drawer -->
      <div id="detail-drawer"
           class="absolute top-0 right-0 h-full w-full max-w-[520px] bg-surface border-l border-border
                  translate-x-full transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)]
                  flex flex-col overflow-hidden">
        <div id="detail-content" class="flex flex-col h-full overflow-y-auto"></div>
      </div>
    </div>

    <!-- CART TOAST -->
    <div id="cart-toast" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] pointer-events-none opacity-0 transition-all duration-300 translate-y-4">
      <div class="flex items-center gap-3 bg-surface border border-secondary/60 px-5 py-3 shadow-[0_0_30px_rgba(155,89,247,.25)]">
        <span class="text-secondary">⬡</span>
        <span id="cart-toast-msg" class="font-josefin text-[0.72rem] tracking-[0.15em] uppercase text-(--color-white)"></span>
      </div>
    </div>

    <!-- floating cart button -->
    <button id="cart-fab"
      class="fixed bottom-8 right-8 z-[150] w-14 h-14 rounded-full border-2 border-secondary bg-main/80 backdrop-blur-lg
             flex items-center justify-center text-xl text-line-bright
             shadow-[0_0_20px_rgba(155,89,247,.3)] hover:shadow-[0_0_40px_rgba(155,89,247,.5)] hover:scale-110
             transition-all duration-300 group">
      ⬡
      <span id="cart-badge"
        class="absolute -top-1 -right-1 min-w-[20px] h-5 rounded-full bg-secondary text-white font-bold text-[0.6rem] flex items-center justify-center px-1 hidden">
        0
      </span>
    </button>

    <!-- CART SIDEBAR -->
    <div id="cart-overlay" class="fixed inset-0 z-[200] pointer-events-none">
      <div id="cart-backdrop" class="absolute inset-0 bg-main/0 backdrop-blur-none transition-all duration-500"></div>
      <div id="cart-drawer"
           class="absolute top-0 right-0 h-full w-full max-w-[400px] bg-surface border-l border-border
                  translate-x-full transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)]
                  flex flex-col overflow-hidden">
        <div id="cart-content" class="flex flex-col h-full"></div>
      </div>
    </div>
  `;
}

function skeletonGrid() {
  const items = Array(8).fill(null).map(() => `
    <div class="bg-surface border border-border overflow-hidden animate-pulse">
      <div class="h-72 bg-surface2"></div>
      <div class="p-6 space-y-3">
        <div class="h-2 bg-border w-1/3 rounded"></div>
        <div class="h-4 bg-border w-3/4 rounded"></div>
        <div class="h-3 bg-border w-1/2 rounded"></div>
        <div class="flex justify-between pt-2">
          <div class="h-6 bg-border w-16 rounded"></div>
          <div class="h-8 bg-border w-20 rounded"></div>
        </div>
      </div>
    </div>`).join('');
  return `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[1px] bg-border border border-border">${items}</div>`;
}

async function fetchCategories() {
  try {
    const data = await api('/categories');
    state.categories = Array.isArray(data) ? data : (data.content || []);
    renderCategoryFilters();
  } catch (_) {
  }
}

async function fetchProducts() {
  state.loading = true;
  renderProductsLoading();

  const params = new URLSearchParams({
    page:  state.page,
    limit: state.limit,
    categoryId : state.categoryId,
    q : state.q,
    sort:  state.sort,
    order: state.order,
  });
  if (state.categoryId) params.set('categoryId', state.categoryId);
  if (state.q.trim())   params.set('q', state.q.trim());

  try {
    const data = await api(`/products?${params}`);
    state.products      = data.content        || [];
    state.totalPages    = data.totalPages      || 0;
    state.totalElements = data.totalElements   || 0;
    renderProducts();
    renderPagination();
    renderCount();
  } catch (err) {
    renderError(err.message);
  } finally {
    state.loading = false;
  }
}

function renderCategoryFilters() {
  const el = document.getElementById('cat-filters');
  if (!el) return;

  const allActive = state.categoryId === "";
  let html = `
    <button class="cat-pill ${allActive ? 'cat-pill--active' : ''}" data-cat="">
      All Objects
    </button>`;

  state.categories.forEach(cat => {
    const active = state.categoryId === cat.id;
    html += `<button class="cat-pill ${active ? 'cat-pill--active' : ''}" data-cat="${cat.id}">${cat.name}</button>`;
  });

  el.innerHTML = html;
  el.querySelectorAll('.cat-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      state.categoryId = btn.dataset.cat ? Number(btn.dataset.cat) : "";
      state.page = 0;
      fetchProducts();
      el.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('cat-pill--active'));
      btn.classList.add('cat-pill--active');
    });
  });
}

function renderProductsLoading() {
  const el = document.getElementById('products-container');
  if (el) el.innerHTML = skeletonGrid();
}

function renderProducts() {
  const el = document.getElementById('products-container');
  if (!el) return;

  if (!state.products.length) {
    el.innerHTML = emptyState();
    return;
  }

  if (state.view === 'list') {
    el.innerHTML = `<div class="flex flex-col gap-[1px] bg-border border border-border">${state.products.map(productListRow).join('')}</div>`;
  } else {
    el.innerHTML = `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[1px] bg-border border border-border">${state.products.map(productCard).join('')}</div>`;
  }

  el.querySelectorAll('[data-product-id]').forEach(card => {
    const id = Number(card.dataset.productId);
    const product = state.products.find(p => p.id === id);

    card.querySelector('.btn-cart')?.addEventListener('click', e => {
      e.stopPropagation();
      addToCart(product);
    });

    card.querySelector('.card-click-area')?.addEventListener('click', () => goToProduct(id));
  });

  // scroll reveal
  requestAnimationFrame(() => {
    el.querySelectorAll('.product-reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('product-reveal--vis'), i * 40);
    });
  });
}

function renderCount() {
  const el = document.getElementById('product-count');
  if (el) el.textContent = `${state.totalElements} object${state.totalElements !== 1 ? 's' : ''} found`;
}

function renderPagination() {
  const el = document.getElementById('pagination');
  if (!el || state.totalPages <= 1) { if (el) el.innerHTML = ''; return; }

  let html = '';

  // prev
  html += `<button class="page-btn ${state.page === 0 ? 'opacity-30 cursor-not-allowed' : ''}" data-page="${state.page - 1}" ${state.page === 0 ? 'disabled' : ''}>← Prev</button>`;

  // page numbers
  const window = 2;
  for (let i = 0; i < state.totalPages; i++) {
    if (i === 0 || i === state.totalPages - 1 || Math.abs(i - state.page) <= window) {
      html += `<button class="page-btn ${i === state.page ? 'page-btn--active' : ''}" data-page="${i}">${i + 1}</button>`;
    } else if (Math.abs(i - state.page) === window + 1) {
      html += `<span class="text-muted text-[0.7rem] px-1">…</span>`;
    }
  }

  html += `<button class="page-btn ${state.page >= state.totalPages - 1 ? 'opacity-30 cursor-not-allowed' : ''}" data-page="${state.page + 1}" ${state.page >= state.totalPages - 1 ? 'disabled' : ''}>Next →</button>`;

  el.innerHTML = html;
  el.querySelectorAll('.page-btn:not([disabled])').forEach(btn => {
    btn.addEventListener('click', () => {
      state.page = Number(btn.dataset.page);
      fetchProducts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

function renderError(msg) {
  const el = document.getElementById('products-container');
  if (el) el.innerHTML = `
    <div class="col-span-4 text-center py-24 border border-red-400/20 bg-red-500/5">
      <div class="text-red-300 font-bebas text-4xl mb-3">SIGNAL LOST</div>
      <div class="text-[0.72rem] tracking-[0.2em] uppercase text-muted">${msg}</div>
    </div>`;
}

function emptyState() {
  return `
    <div class="text-center py-28 border border-border col-span-4">
      <div class="font-bebas text-7xl text-border mb-4">⬡</div>
      <div class="font-bebas text-3xl text-muted tracking-widest mb-2">Nothing In RECO</div>
      <p class="text-[0.72rem] tracking-[0.2em] uppercase text-muted">Try a different filter or search</p>
    </div>`;
}

function productCard(p) {
  const rating     = parseFloat(p.avgRating) || 0;
  const stars      = '★★★★★'.split('').map((s, i) =>
    `<span class="${i < Math.round(rating) ? 'text-secondary' : 'text-border'} text-xs drop-shadow-[0_0_6px_#9b59f7]">${s}</span>`
  ).join('');

  const badgeHtml  = p.stockQuantity < 5
    ? `<div class="absolute top-3 left-3 bg-red-500/80 border border-red-400/50 px-2 py-0.5 font-space text-[0.55rem] tracking-widest uppercase text-white">LOW STOCK</div>`
    : p.totalCartAdds > 20
    ? `<div class="absolute top-3 left-3 border border-secondary/40 bg-main/80 px-2 py-0.5 font-space text-[0.55rem] tracking-widest text-line-bright uppercase">Hot</div>`
    : '';

  return `
    <div class="product-reveal bg-main group overflow-hidden transition-colors duration-500 hover:bg-surface relative"
         data-product-id="${p.id}">

      <!-- image zone -->
      <div class="card-click-area h-72 relative overflow-hidden flex items-center justify-center bg-surface cursor-pointer"
           style="background: radial-gradient(ellipse at 50% 80%, rgba(155,89,247,0.12) 0%, var(--color-surface) 70%)">
        ${p.mainImageUrl
          ? `<img src="${p.mainImageUrl}" alt="${p.name}"
               class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:brightness-110"
               loading="lazy" onerror="this.parentElement.innerHTML='<span class=\\'font-bebas text-6xl text-border\\'>⬡</span>'">`
          : `<span class="font-bebas text-6xl text-border group-hover:text-secondary transition-colors duration-500">⬡</span>`}
        ${badgeHtml}
        <!-- hover overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-main/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"></div>
        <div class="absolute bottom-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none">
          <span class="font-space text-[0.58rem] tracking-[0.3em] uppercase text-line-bright">Click to explore →</span>
        </div>
      </div>

      <!-- info -->
      <div class="p-6">
        <div class="flex items-center gap-2 mb-1.5">
          <div class="font-space text-[0.55rem] tracking-[0.2em] text-secondary uppercase">${categoryName(p.categoryId)}</div>
          ${p.tags ? `<div class="font-space text-[0.5rem] tracking-widest text-muted uppercase">${p.tags}</div>` : ''}
        </div>
        <h3 class="font-bebas text-xl tracking-wider leading-tight mb-1 group-hover:text-line-bright transition-colors">${p.name}</h3>
        <div class="flex gap-0.5 mb-4">${stars}</div>
        <div class="flex justify-between items-center">
          <div>
            <span class="text-lg font-semibold text-lavender">$${parseFloat(p.price).toFixed(2)}</span>
          </div>
          <button class="btn-cart px-4 py-2 border border-secondary text-line-bright text-[0.62rem] font-semibold uppercase tracking-widest
                         transition-all hover:bg-secondary/15 hover:shadow-[0_0_20px_rgba(155,89,247,.3)] active:scale-95">
            + Add
          </button>
        </div>
      </div>

      <!-- top shine on hover -->
      <div class="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-secondary to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 pointer-events-none"></div>
    </div>`;
}

function productListRow(p) {
  const rating     = parseFloat(p.avgRating) || 0;
  const stars      = '★★★★★'.split('').map((s, i) =>
    `<span class="${i < Math.round(rating) ? 'text-secondary' : 'text-border'} text-xs">${s}</span>`
  ).join('');

  return `
    <div class="product-reveal bg-main hover:bg-surface transition-colors duration-400 flex gap-0 group relative"
         data-product-id="${p.id}">
      <!-- thumb -->
      <div class="card-click-area w-40 h-32 shrink-0 overflow-hidden cursor-pointer relative flex items-center justify-center"
           style="background: radial-gradient(ellipse at 50% 80%, rgba(155,89,247,.1) 0%, var(--color-surface) 70%)">
        ${p.mainImageUrl
          ? `<img src="${p.mainImageUrl}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">`
          : `<span class="font-bebas text-4xl text-border">⬡</span>`}
      </div>
      <!-- info -->
      <div class="flex flex-1 items-center gap-4 px-6 py-4">
        <div class="flex-1 min-w-0">
          <div class="font-space text-[0.55rem] tracking-[0.2em] text-secondary uppercase mb-0.5">${categoryName(p.categoryId)}</div>
          <div class="font-bebas text-xl tracking-wider group-hover:text-line-bright transition-colors truncate">${p.name}</div>
          <div class="flex gap-0.5 mt-1">${stars}</div>
          ${p.description ? `<p class="text-[0.7rem] text-muted leading-relaxed mt-1 line-clamp-2">${p.description}</p>` : ''}
        </div>
        <div class="shrink-0 flex items-center gap-4">
          <span class="font-semibold text-lavender text-lg">$${parseFloat(p.price).toFixed(2)}</span>
          <button class="btn-cart px-4 py-2 border border-secondary text-line-bright text-[0.62rem] font-semibold uppercase tracking-widest transition-all hover:bg-secondary/15 hover:shadow-[0_0_20px_rgba(155,89,247,.3)]">
            + Add
          </button>
        </div>
      </div>
      <!-- left accent -->
      <div class="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-secondary to-transparent scale-y-0 group-hover:scale-y-100 transition-transform duration-500 pointer-events-none"></div>
    </div>`;
}

function goToProduct(id) {
  if (!id) return;
  window.location.href = `/product?id=${id}`;
}

function openDetail(product) {
  state.selectedProduct = product;
  const overlay  = document.getElementById('detail-overlay');
  const backdrop = document.getElementById('detail-backdrop');
  const drawer   = document.getElementById('detail-drawer');
  const content  = document.getElementById('detail-content');

  overlay.style.pointerEvents = 'all';
  backdrop.style.background   = 'rgba(4,1,10,0.7)';
  backdrop.style.backdropFilter = 'blur(4px)';
  drawer.classList.remove('translate-x-full');
  drawer.classList.add('translate-x-0');

  const rating     = parseFloat(product.avgRating) || 0;
  const stars      = '★★★★★'.split('').map((s, i) =>
    `<span class="${i < Math.round(rating) ? 'text-secondary drop-shadow-[0_0_8px_#9b59f7]' : 'text-border'} text-xl">${s}</span>`
  ).join('');

  const additionalImgs = product.additionalImages?.length
    ? product.additionalImages.map(url => `<img src="${url}" class="h-16 w-16 object-cover border border-border hover:border-secondary cursor-pointer transition-all" loading="lazy">`).join('')
    : '';

  content.innerHTML = `
    <!-- header -->
    <div class="flex items-center justify-between px-7 py-5 border-b border-border shrink-0 bg-surface">
      <div class="font-space text-[0.6rem] tracking-[0.3em] uppercase text-secondary">${categoryName(product.categoryId)}</div>
      <button id="drawer-close" class="w-8 h-8 border border-border flex items-center justify-center text-muted hover:border-secondary hover:text-line-bright transition-all text-lg">×</button>
    </div>

    <!-- main image -->
    <div class="shrink-0 h-72 bg-surface2 flex items-center justify-center relative overflow-hidden"
         style="background:radial-gradient(ellipse at 50% 80%,rgba(155,89,247,.15) 0%,var(--color-surface2) 70%)">
      ${product.mainImageUrl
        ? `<img id="detail-main-img" src="${product.mainImageUrl}" alt="${product.name}" class="w-full h-full object-cover">`
        : `<span class="font-bebas text-8xl text-border">⬡</span>`}
      <div class="absolute inset-0 bg-gradient-to-t from-surface2/60 via-transparent to-transparent pointer-events-none"></div>
    </div>

    <!-- thumb strip -->
    ${additionalImgs ? `<div class="flex gap-2 px-7 pt-4 shrink-0 overflow-x-auto">${additionalImgs}</div>` : ''}

    <!-- details -->
    <div class="flex-1 overflow-y-auto px-7 py-6 flex flex-col gap-5">
      <div>
        <h2 class="font-bebas text-4xl tracking-wider text-line-bright leading-none mb-2">${product.name}</h2>
        <div class="flex items-center gap-3 mb-3">
          <div class="flex gap-0.5">${stars}</div>
          <span class="font-space text-[0.62rem] text-muted">${rating.toFixed(1)} · ${product.totalClicks || 0} views</span>
        </div>
        ${product.description ? `<p class="text-[0.8rem] font-light text-muted leading-relaxed">${product.description}</p>` : ''}
      </div>

      <!-- meta grid -->
      <div class="grid grid-cols-2 gap-[1px] bg-border border border-border">
        <div class="bg-main p-4">
          <div class="font-space text-[0.55rem] tracking-[0.2em] uppercase text-muted mb-1">Price</div>
          <div class="font-bebas text-3xl text-lavender">$${parseFloat(product.price).toFixed(2)}</div>
        </div>
        <div class="bg-main p-4">
          <div class="font-space text-[0.55rem] tracking-[0.2em] uppercase text-muted mb-1">In Stock</div>
          <div class="font-bebas text-3xl ${product.stockQuantity < 5 ? 'text-red-300' : 'text-emerald-300'}">${product.stockQuantity}</div>
        </div>
        <div class="bg-main p-4">
          <div class="font-space text-[0.55rem] tracking-[0.2em] uppercase text-muted mb-1">Cart Adds</div>
          <div class="font-bebas text-2xl text-secondary">${product.totalCartAdds || 0}</div>
        </div>
        <div class="bg-main p-4">
          <div class="font-space text-[0.55rem] tracking-[0.2em] uppercase text-muted mb-1">Pop. Score</div>
          <div class="font-bebas text-2xl text-line-bright">${parseFloat(product.popularityScore || 0).toFixed(1)}</div>
        </div>
      </div>

      ${product.tags ? `<div class="flex flex-wrap gap-2">${product.tags.split(',').map(t => `<span class="px-3 py-1 border border-border text-[0.62rem] tracking-[0.15em] uppercase text-muted font-space">${t.trim()}</span>`).join('')}</div>` : ''}
    </div>

    <!-- CTA -->
    <div class="shrink-0 px-7 pb-7 pt-4 border-t border-border flex gap-3 bg-surface">
      <button id="drawer-add-cart"
        class="flex-1 relative overflow-hidden px-6 py-4 border border-secondary bg-secondary/10 text-line-bright text-[0.72rem] font-semibold tracking-[0.2em] uppercase
               hover:shadow-[0_0_30px_rgba(155,89,247,.35)] hover:bg-secondary/20 active:scale-95 transition-all duration-300 group">
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-line-bright/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none"></div>
        ⬡ Add to Cart
      </button>
    </div>`;

  content.querySelectorAll('.flex.gap-2 img').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const main = document.getElementById('detail-main-img');
      if (main) main.src = thumb.src;
    });
  });

  document.getElementById('drawer-close').addEventListener('click', closeDetail);
  backdrop.addEventListener('click', closeDetail);
  document.getElementById('drawer-add-cart').addEventListener('click', () => { addToCart(product); });
}

function closeDetail() {
  const overlay  = document.getElementById('detail-overlay');
  const backdrop = document.getElementById('detail-backdrop');
  const drawer   = document.getElementById('detail-drawer');
  overlay.style.pointerEvents = 'none';
  backdrop.style.background   = 'rgba(4,1,10,0)';
  backdrop.style.backdropFilter = 'blur(0px)';
  drawer.classList.remove('translate-x-0');
  drawer.classList.add('translate-x-full');
}

async function addToCart(product) {
  if (!isAuthenticated() || !isTokenValid()) {
    showToast('Please log in to use the cart');
    return;
  }
  if (!product || !product.id) {
    showToast('Product not available');
    return;
  }

  const body = {
    productId: product.id,
    quantity: 1,
  };

  const users = await api('/users/me');
  console.log(users);
  const userId = users.id;
  try {
    api(`/users/${userId}/interactions`, { method:'POST', body: JSON.stringify({ productId: product.id, interactionType: 'CART_ADD' }) }).catch(()=>{});
    const cartResponse = await api('/cart/items', { method: 'POST', body: JSON.stringify(body) });
    applyCart(cartResponse);
    showToast(`${product.name} added to cart`);
  } catch (err) {
    showToast(err?.message || 'Failed to add item');
  }
}

async function removeFromCart(id) {
  if (!isAuthenticated() || !isTokenValid()) {
    showToast('Please log in to use the cart');
    return;
  }

  try {
    await api(`/cart/items/${id}`, { method: 'DELETE' });
    state.cart = state.cart.filter(item => item.productId !== id);
    updateCartBadge();
    renderCartDrawer();
    showToast('Item removed');
  } catch (err) {
    showToast(err?.message || 'Failed to remove item');
  }
}

async function updateCartQty(id, delta) {
  const item = state.cart.find(i => i.productId === id);
  if (!item) return;
  const quantity = Math.max(1, item.quantity + delta);

  if (!isAuthenticated() || !isTokenValid()) {
    showToast('Please log in to use the cart');
    return;
  }

  try {
    const cartResponse = await api(`/cart/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });

    applyCart(cartResponse);
    renderCartDrawer();
  } catch (err) {
    showToast(err?.message || 'Failed to update quantity');
  }
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  const total = state.cart.reduce((s, i) => s + i.quantity, 0);
  badge.textContent = total;
  badge.classList.toggle('hidden', total === 0);
}

function openCart() {
  const overlay  = document.getElementById('cart-overlay');
  const backdrop = document.getElementById('cart-backdrop');
  const drawer   = document.getElementById('cart-drawer');
  overlay.style.pointerEvents = 'all';
  backdrop.style.background   = 'rgba(4,1,10,0.7)';
  backdrop.style.backdropFilter = 'blur(4px)';
  drawer.classList.remove('translate-x-full');
  drawer.classList.add('translate-x-0');
  loadCart().then(() => renderCartDrawer());
}

function closeCart() {
  const overlay  = document.getElementById('cart-overlay');
  const backdrop = document.getElementById('cart-backdrop');
  const drawer   = document.getElementById('cart-drawer');
  overlay.style.pointerEvents = 'none';
  backdrop.style.background   = 'rgba(4,1,10,0)';
  backdrop.style.backdropFilter = 'blur(0px)';
  drawer.classList.remove('translate-x-0');
  drawer.classList.add('translate-x-full');
}

function renderCartDrawer() {
  const content = document.getElementById('cart-content');
  if (!content) return;

  const total = state.cart.reduce((s, i) => s + parseFloat(i.unitPrice) * i.quantity, 0);

  content.innerHTML = `
    <div class="flex items-center justify-between px-7 py-5 border-b border-border shrink-0 bg-surface">
      <div class="font-bebas text-2xl tracking-[0.2em] text-line-bright">YOUR CART</div>
      <button id="cart-close" class="w-8 h-8 border border-border flex items-center justify-center text-muted hover:border-secondary hover:text-line-bright transition-all text-lg">×</button>
    </div>

    <div class="flex-1 overflow-y-auto">
      ${state.cart.length === 0
        ? `<div class="h-full flex flex-col items-center justify-center gap-4 py-20 text-center px-7">
             <div class="font-bebas text-6xl text-border">⬡</div>
             <div class="font-josefin text-[0.72rem] tracking-[0.2em] uppercase text-muted">Your cart is empty</div>
           </div>`
        : state.cart.map(item => `
            <div class="flex gap-4 px-7 py-5 border-b border-border hover:bg-surface2/50 transition-colors">
              <div class="w-16 h-16 shrink-0 bg-surface2 border border-border overflow-hidden flex items-center justify-center">
                <span class="font-bebas text-2xl text-border">⬡</span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-josefin text-[0.78rem] tracking-[0.1em] uppercase mb-1 truncate">${item.productName}</div>
                <div class="text-lavender font-semibold">$${parseFloat(item.lineTotal).toFixed(2)}</div>
                <div class="flex items-center gap-2 mt-2">
                  <button class="cart-qty-btn w-6 h-6 border border-border text-muted hover:border-secondary hover:text-line-bright flex items-center justify-center text-sm transition-all" data-id="${item.productId}" data-delta="-1">−</button>
                  <span class="font-space text-[0.7rem] text-line-bright w-4 text-center">${item.quantity}</span>
                  <button class="cart-qty-btn w-6 h-6 border border-border text-muted hover:border-secondary hover:text-line-bright flex items-center justify-center text-sm transition-all" data-id="${item.productId}" data-delta="1">+</button>
                  <button class="cart-remove-btn ml-auto text-muted hover:text-red-300 transition-colors text-[0.7rem] tracking-widest uppercase" data-id="${item.productId}">Remove</button>
                </div>
              </div>
            </div>`).join('')}
    </div>

    <div class="shrink-0 px-7 py-5 border-t border-border bg-surface">
      <div class="flex justify-between items-center mb-4">
        <span class="font-space text-[0.65rem] tracking-[0.2em] uppercase text-muted">Total</span>
        <span class="font-bebas text-3xl text-lavender">$${total.toFixed(2)}</span>
      </div>
      <button id="cart-checkout-btn" class="w-full py-4 border border-secondary bg-secondary/10 text-line-bright font-semibold text-[0.72rem] tracking-[0.2em] uppercase
                     hover:bg-secondary/20 hover:shadow-[0_0_30px_rgba(155,89,247,.3)] active:scale-[.99] transition-all">
        Proceed to Checkout →
      </button>
    </div>`;

  document.getElementById('cart-close').addEventListener('click', closeCart);
  content.querySelectorAll('.cart-qty-btn').forEach(btn => {
    btn.addEventListener('click', () => updateCartQty(Number(btn.dataset.id), Number(btn.dataset.delta)));
  });
  content.querySelectorAll('.cart-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(Number(btn.dataset.id)));
  });

  document.getElementById('cart-checkout-btn')?.addEventListener('click', () => {
    window.location.href = '/payment';
  });
}

let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('cart-toast');
  const msgEl = document.getElementById('cart-toast-msg');
  if (!toast || !msgEl) return;
  msgEl.textContent = msg;
  toast.style.opacity    = '1';
  toast.style.transform  = 'translateX(-50%) translateY(0)';
  toast.style.pointerEvents = 'none';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.style.opacity   = '0';
    toast.style.transform = 'translateX(-50%) translateY(12px)';
  }, 2200);
}

let searchTimer;
function onSearch(val) {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    state.q    = val;
    state.page = 0;
    fetchProducts();
  }, 420);
}

function categoryName(id) {
  const cat = state.categories.find(c => c.id === id);
  return cat ? cat.name : `Cat #${id}`;
}

function bindEvents() {
  document.getElementById('search-input')?.addEventListener('input', e => onSearch(e.target.value));

  document.getElementById('sort-select')?.addEventListener('change', e => {
    const [sort, order] = e.target.value.split('|');
    state.sort  = sort;
    state.order = order;
    state.page  = 0;
    fetchProducts();
  });

  document.getElementById('view-grid')?.addEventListener('click', () => {
    state.view = 'grid';
    document.getElementById('view-grid').classList.add('border-secondary', 'text-line-bright', 'bg-secondary/10');
    document.getElementById('view-grid').classList.remove('border-border', 'text-muted');
    document.getElementById('view-list').classList.remove('border-secondary', 'text-line-bright', 'bg-secondary/10');
    document.getElementById('view-list').classList.add('border-border', 'text-muted');
    renderProducts();
  });

  document.getElementById('view-list')?.addEventListener('click', () => {
    state.view = 'list';
    document.getElementById('view-list').classList.add('border-secondary', 'text-line-bright', 'bg-secondary/10');
    document.getElementById('view-list').classList.remove('border-border', 'text-muted');
    document.getElementById('view-grid').classList.remove('border-secondary', 'text-line-bright', 'bg-secondary/10');
    document.getElementById('view-grid').classList.add('border-border', 'text-muted');
    renderProducts();
  });

  document.getElementById('cart-fab')?.addEventListener('click', openCart);

  document.getElementById('cart-backdrop')?.addEventListener('click', closeCart);
}