import { api, getUserFirstName, isAuthenticated, isTokenValid } from '../api/auth.js';
import { Login } from './login.js';
import { DashboardView } from './dashboard.js';

const state = {
  productId: null,
  product: null,
  reviews: [],
  reviewPage: 0,
  reviewTotalPages: 0,
  reviewTotal: 0,
  frequentlyBought: [], // Track recommended cross-sells
};

export async function ProductView() {
  await ensureLayout();

  const app = document.getElementById('app');
  app.innerHTML = productShell();

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id'));
  if (!Number.isFinite(id)) {
    renderHeroError('Missing product id');
    return;
  }

  state.productId = id;
  await loadProduct();
}

async function ensureLayout() {
  const nav  = document.getElementById('nav-slot');
  const foot = document.getElementById('footer-slot');

  if (nav && nav.innerHTML.trim() === '') {
    const { renderLayout } = await import('../layout.js');
    renderLayout();
  }

  if (foot && foot.innerHTML.trim() === '') {
    const { renderLayout } = await import('../layout.js');
    renderLayout();
  }

  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn && isAuthenticated() && isTokenValid()) {
    loginBtn.className = 'cart-btn group flex items-center justify-center w-12 h-12 rounded-full border border-line-bright text-line-bright transition-all hover:bg-secondary/10 hover:shadow-[0_0_20px_var(--color-pulse-glow1)]';
    loginBtn.textContent = getUserFirstName()[0].toUpperCase();
    loginBtn.addEventListener('click', () => {
      DashboardView();
    });
  } else if (loginBtn) {
    loginBtn.addEventListener('click', Login);
  }
}

function productShell() {
  return `
    <section class="relative pt-28 pb-12 px-6 lg:px-20 overflow-hidden">
      <div class="pointer-events-none absolute -top-40 right-[-120px] w-[420px] h-[420px] rounded-full" style="background:radial-gradient(circle,rgba(155,89,247,.16) 0%,transparent 70%);filter:blur(25px)"></div>
      <div class="pointer-events-none absolute -bottom-20 left-[-120px] w-[360px] h-[360px] rounded-full" style="background:radial-gradient(circle,rgba(120,238,200,.12) 0%,transparent 70%);filter:blur(35px)"></div>

      <div class="relative z-10 flex flex-col gap-6">
        <div class="flex items-center justify-between text-[0.6rem] tracking-[0.3em] uppercase text-muted">
          <a href="/products" class="text-line-bright hover:text-secondary transition-colors">← Back to Catalog</a>
          <span>Field / Product</span>
        </div>
        <div id="product-hero" class="grid gap-3">
          ${loadingTitle('Tuning product signal')}
        </div>
      </div>
    </section>

    <section class="px-6 lg:px-20 pb-16">
      <div id="product-body" class="min-h-[320px]">
        ${loadingBlock()}
      </div>
    </section>

    <section class="px-6 lg:px-20 pb-24">
      <div id="product-alert"></div>
      <div class="grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
        <div class="border border-border bg-surface2/60 p-6" id="reviews-panel">
          ${loadingBlock('Loading reviews')}
        </div>
        <div class="border border-border bg-surface p-6" id="review-form-panel">
          ${loadingBlock('Preparing review channel')}
        </div>
      </div>
    </section>

    <section class="px-6 lg:px-20 pb-24 border-t border-border/20 pt-16">
      <div id="frequently-bought-panel">
        ${loadingBlock('Scanning related product clusters')}
      </div>
    </section>
  `;
}

function loadingTitle(label) {
  return `
    <div class="flex items-center gap-3 text-[0.65rem] tracking-[0.3em] uppercase text-muted">
      <span>${label}</span>
      <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-border border-t-secondary"></span>
    </div>`;
}

function loadingBlock(label = 'Loading') {
  return `
    <div class="flex items-center gap-3 text-[0.7rem] tracking-[0.2em] uppercase text-muted">
      <span>${label}</span>
      <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-border border-t-secondary"></span>
    </div>`;
}

function renderHeroError(message) {
  const hero = document.getElementById('product-hero');
  if (hero) {
    hero.innerHTML = `
      <div class="font-bebas text-5xl tracking-[0.2em] text-line-bright">SIGNAL LOST</div>
      <div class="text-[0.75rem] tracking-[0.2em] uppercase text-muted">${message}</div>`;
  }

  const body = document.getElementById('product-body');
  if (body) body.innerHTML = '';
}

async function loadProduct() {
  try {
    const product = await api(`/products/${state.productId}`);
    state.product = product;

    renderHero(product);
    renderProduct(product);

    await loadReviews(true);
    renderReviewForm();
    
    // Fire recommendation scanning alongside product assembly
    await loadFrequentlyBought();
  } catch (err) {
    renderHeroError(err?.message || 'Product not found');
  }
}

function renderHero(product) {
  const hero = document.getElementById('product-hero');
  if (!hero) return;

  hero.innerHTML = `
    <div class="font-bebas text-[clamp(2.8rem,7vw,5rem)] tracking-[0.15em] text-line-bright">
      ${product.name}
    </div>
    <div class="flex flex-wrap items-center gap-4">
      <div class="text-[0.7rem] tracking-[0.25em] uppercase text-secondary">Cat #${product.categoryId}</div>
      <div class="text-[0.7rem] tracking-[0.2em] uppercase text-muted">${product.stockQuantity} in stock</div>
      <div class="flex items-center gap-2 text-[0.7rem] tracking-[0.2em] uppercase text-muted">
        <span class="text-secondary">${renderStars(product.avgRating)}</span>
        ${(Number(product.avgRating) || 0).toFixed(1)} avg
      </div>
    </div>
  `;
}

function renderProduct(product) {
  const body = document.getElementById('product-body');
  if (!body) return;

  const mainImg = product.mainImageUrl
    ? `<img src="${product.mainImageUrl}" alt="${product.name}" class="w-full h-full object-cover" loading="lazy">`
    : `<div class="flex items-center justify-center h-full font-bebas text-7xl text-border">⬡</div>`;

  const gallery = (product.additionalImages || []).map(url => `
    <button class="border border-border hover:border-secondary transition-colors overflow-hidden" data-gallery-img="${url}">
      <img src="${url}" class="h-16 w-20 object-cover" loading="lazy">
    </button>`).join('');

  body.innerHTML = `
    <div class="grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
      <div class="border border-border bg-surface2/60 overflow-hidden">
        <div class="relative h-[420px] bg-surface2" id="product-main-img">
          ${mainImg}
          <div class="absolute inset-0 bg-gradient-to-t from-main/70 via-transparent to-transparent pointer-events-none"></div>
        </div>
        <div class="p-5 flex flex-wrap gap-3 bg-main/40">
          ${gallery || '<span class="text-[0.65rem] tracking-[0.2em] uppercase text-muted">No additional frames</span>'}
        </div>
      </div>

      <div class="border border-border bg-surface p-6 flex flex-col gap-5">
        <div class="flex items-center justify-between">
          <div class="text-[0.65rem] tracking-[0.3em] uppercase text-secondary">Signal Pricing</div>
          <div class="text-[0.65rem] tracking-[0.3em] uppercase text-muted">${new Date(product.createdAt).toLocaleDateString()}</div>
        </div>

        <div class="font-bebas text-5xl text-line-bright">$${fmtMoney(product.price)}</div>
        <p class="text-[0.82rem] text-muted leading-relaxed">${product.description || 'No description supplied for this object yet.'}</p>

        <div class="grid grid-cols-2 gap-3">
          <div class="border border-border bg-main p-4">
            <div class="text-[0.55rem] tracking-[0.2em] uppercase text-muted mb-2">Popularity</div>
            <div class="font-bebas text-2xl text-secondary">${Number(product.popularityScore || 0).toFixed(1)}</div>
          </div>
          <div class="border border-border bg-main p-4">
            <div class="text-[0.55rem] tracking-[0.2em] uppercase text-muted mb-2">Cart Adds</div>
            <div class="font-bebas text-2xl text-line-bright">${product.totalCartAdds || 0}</div>
          </div>
        </div>

        ${product.tags
          ? `<div class="flex flex-wrap gap-2">${product.tags.split(',').map(t => `<span class="px-3 py-1 border border-border text-[0.6rem] tracking-[0.18em] uppercase text-muted">${t.trim()}</span>`).join('')}</div>`
          : ''}

        <div class="flex flex-col gap-2">
          <button id="product-add-cart" class="w-full px-6 py-4 border border-secondary bg-secondary/10 text-line-bright text-[0.72rem] tracking-[0.2em] uppercase font-semibold hover:bg-secondary/20 hover:shadow-[0_0_25px_rgba(155,89,247,.35)] transition-all">
            Add to Cart
          </button>
          <button id="product-buy-now" class="w-full px-6 py-4 border border-line-bright bg-line-bright/10 text-line-bright text-[0.72rem] tracking-[0.2em] uppercase font-semibold hover:bg-line-bright/20 hover:shadow-[0_0_25px_rgba(120,238,200,.35)] transition-all">
            Buy Now → Payment
          </button>
        </div>
      </div>
    </div>
  `;

  body.querySelectorAll('[data-gallery-img]').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.dataset.galleryImg;
      const container = document.getElementById('product-main-img');
      if (container && url) {
        container.innerHTML = `<img src="${url}" alt="${product.name}" class="w-full h-full object-cover">`;
      }
    });
  });

  document.getElementById('product-add-cart')?.addEventListener('click', () => addToCart(product));
  document.getElementById('product-buy-now')?.addEventListener('click', () => {
    window.location.href = '/payment';
  });
}

async function loadReviews(reset = false) {
  if (reset) {
    state.reviewPage = 0;
    state.reviews = [];
  }

  try {
    const data = await api(`/reviews/product/${state.productId}?page=${state.reviewPage}&limit=6&sort=createdAt&order=desc`);
    const incoming = data?.content || [];
    state.reviewTotalPages = data?.totalPages || 0;
    state.reviewTotal = data?.totalElements || incoming.length;
    state.reviews = [...state.reviews, ...incoming];
    renderReviews();
  } catch (err) {
    const panel = document.getElementById('reviews-panel');
    if (panel) panel.innerHTML = `<div class="text-[0.7rem] tracking-[0.2em] uppercase text-muted">${err?.message || 'Could not load reviews'}</div>`;
  }
}

function renderReviews() {
  const panel = document.getElementById('reviews-panel');
  if (!panel) return;

  panel.innerHTML = `
    <div class="flex items-center justify-between mb-4">
      <div class="font-bebas text-2xl tracking-[0.2em] text-line-bright">Reviews</div>
      <div class="text-[0.6rem] tracking-[0.3em] uppercase text-muted">${state.reviewTotal} transmissions</div>
    </div>
    <div class="flex flex-col gap-4" id="reviews-list">
      ${state.reviews.length
        ? state.reviews.map(r => `
            <div class="border border-border bg-main/70 p-4">
              <div class="flex items-center justify-between mb-2">
                <div class="text-[0.65rem] tracking-[0.2em] uppercase text-secondary">${r.username || 'Anonymous'}</div>
                <div class="text-[0.6rem] tracking-[0.2em] uppercase text-muted">${fmtDate(r.createdAt)}</div>
              </div>
              <div class="flex items-center gap-2 mb-2">
                <span class="text-secondary">${renderStars(r.rating)}</span>
                <span class="text-[0.65rem] tracking-[0.2em] uppercase text-muted">${r.rating}/5</span>
              </div>
              <div class="text-[0.78rem] text-muted leading-relaxed">${r.comment || 'No comment provided.'}</div>
            </div>`).join('')
        : `<div class="text-[0.7rem] tracking-[0.2em] uppercase text-muted">No reviews yet</div>`}
    </div>
    ${state.reviewPage + 1 < state.reviewTotalPages
      ? `<button id="reviews-more" class="mt-4 w-full px-4 py-2 border border-secondary text-line-bright text-[0.65rem] tracking-[0.2em] uppercase hover:bg-secondary/10 transition-all">Load more</button>`
      : ''}
  `;

  document.getElementById('reviews-more')?.addEventListener('click', () => {
    state.reviewPage += 1;
    loadReviews();
  });
}

function renderReviewForm() {
  const panel = document.getElementById('review-form-panel');
  if (!panel) return;

  if (!isAuthenticated() || !isTokenValid()) {
    panel.innerHTML = `
      <div class="font-bebas text-2xl tracking-[0.2em] text-line-bright mb-3">Join The Channel</div>
      <p class="text-[0.75rem] tracking-[0.2em] uppercase text-muted mb-6">Log in to transmit your review.</p>
      <button id="review-login" class="w-full px-5 py-3 border border-secondary text-line-bright text-[0.7rem] tracking-[0.2em] uppercase hover:bg-secondary/10 transition-all">Log in</button>
    `;
    document.getElementById('review-login')?.addEventListener('click', Login);
    return;
  }

  panel.innerHTML = `
    <div class="font-bebas text-2xl tracking-[0.2em] text-line-bright mb-3">Transmit Review</div>
    <div class="text-[0.65rem] tracking-[0.25em] uppercase text-muted mb-6">Rate and describe the signal</div>

    <div class="flex gap-2 mb-4" id="review-stars">
      ${[1,2,3,4,5].map(i => `<button class="text-[1.4rem] text-border hover:text-secondary transition-colors" data-rating="${i}">★</button>`).join('')}
    </div>
    <input type="hidden" id="review-rating" value="0">
    <textarea id="review-comment" class="w-full bg-surface border border-border text-[0.8rem] text-(--color-white) px-3 py-2 font-josefin outline-none focus:border-secondary focus:shadow-[0_0_12px_var(--color-glow)] min-h-[120px]" placeholder="Share your transmission..."></textarea>
    <button id="review-submit" class="mt-5 w-full px-5 py-3 border border-secondary bg-secondary/10 text-line-bright text-[0.7rem] tracking-[0.2em] uppercase hover:bg-secondary/20 transition-all">Submit Review</button>
  `;

  const stars = panel.querySelectorAll('[data-rating]');
  const ratingInput = panel.querySelector('#review-rating');

  stars.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = Number(btn.dataset.rating);
      ratingInput.value = val;
      stars.forEach(star => {
        const starVal = Number(star.dataset.rating);
        star.classList.toggle('text-secondary', starVal <= val);
        star.classList.toggle('text-border', starVal > val);
      });
    });
  });

  document.getElementById('review-submit')?.addEventListener('click', submitReview);
}

async function submitReview() {
  const rating = Number(document.getElementById('review-rating')?.value || 0);
  const comment = document.getElementById('review-comment')?.value || '';

  if (!rating) {
    showAlert('Please select a rating first.', 'error');
    return;
  }

  try {
    await api('/reviews', {
      method: 'POST',
      body: JSON.stringify({ productId: state.productId, rating, comment }),
    });

    showAlert('Review sent. Thank you!');
    document.getElementById('review-comment').value = '';
    document.getElementById('review-rating').value = '0';
    state.reviews = [];
    state.reviewPage = 0;
    await loadReviews(true);
  } catch (err) {
    showAlert(err?.message || 'Failed to submit review', 'error');
  }
}

async function loadFrequentlyBought() {
  try {
    // Queries backend for standard structural data tied to this item
    const data = await api(`/recommendations/products/${state.productId}/frequently-bought-together?limit=5`);
    state.frequentlyBought = data?.recommendations || data || [];
    renderFrequentlyBought();
  } catch (err) {
    const panel = document.getElementById('frequently-bought-panel');
    if (panel) {
      panel.innerHTML = `<div class="text-[0.7rem] tracking-[0.2em] uppercase text-muted">No products</div>`;
    }
  }
}

function renderFrequentlyBought() {
  const panel = document.getElementById('frequently-bought-panel');
  if (!panel) return;

  if (!state.frequentlyBought.length) {
    panel.parentElement?.classList.add('hidden'); // Clear space out if layout empty
    return;
  }

  panel.innerHTML = `
    <div class="font-bebas text-3xl tracking-[0.2em] text-line-bright mb-6">Frequently Bought Together</div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      ${state.frequentlyBought.map(item => {
        const img = item.mainImageUrl 
          ? `<img src="${item.mainImageUrl}" alt="${item.name}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105">`
          : `<div class="flex items-center justify-center h-full font-bebas text-4xl text-border">⬡</div>`;
        
        return `
          <div class="border border-border bg-surface2/40 hover:border-secondary/50 transition-colors flex flex-col justify-between p-4 group">
            <div>
              <div class="relative h-40 w-full bg-surface2 mb-4 overflow-hidden border border-border/40">
                ${img}
                <div class="absolute inset-0 bg-gradient-to-t from-main/60 to-transparent pointer-events-none"></div>
              </div>
              <a href="/product?id=${item.id}" class="block text-[0.82rem] font-semibold text-line-bright hover:text-secondary transition-colors mb-1 truncate">${item.name}</a>
              <div class="flex items-center gap-2 mb-3">
                <span class="text-secondary">${renderStars(item.avgRating || item.avg_rating)}</span>
                <span class="text-[0.65rem] text-muted">${(Number(item.avgRating || item.avg_rating) || 0).toFixed(1)}</span>
              </div>
            </div>
            <div class="flex items-center justify-between mt-2 pt-3 border-t border-border/30">
              <div class="font-bebas text-2xl text-line-bright">$${fmtMoney(item.price)}</div>
              <button data-freq-cart="${item.id}" class="px-3 py-1.5 border border-secondary bg-secondary/10 text-line-bright text-[0.65rem] tracking-[0.15em] uppercase hover:bg-secondary/20 transition-all">
                + Cart
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Bind active listeners to items targeting standard addToCart rules
  panel.querySelectorAll('[data-freq-cart]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = Number(btn.dataset.freqCart);
      const match = state.frequentlyBought.find(p => p.id === id);
      if (match) {
        await addToCart(match);
      }
    });
  });
}

async function addToCart(product) {
  if (!isAuthenticated() || !isTokenValid()) {
    showAlert('Please log in to add items to cart', 'error');
    return;
  }

  try {
    await api('/cart/items', { method: 'POST', body: JSON.stringify({ productId: product.id, quantity: 1 }) });
    showAlert('Added to cart');
  } catch (err) {
    showAlert(err?.message || 'Failed to add item', 'error');
  }
}

function showAlert(message, type = 'success') {
  const zone = document.getElementById('product-alert');
  if (!zone) return;
  const style = type === 'error'
    ? 'border-red-400/70 bg-red-500/10 text-red-300'
    : 'border-emerald-400/70 bg-emerald-500/10 text-emerald-300';

  zone.innerHTML = `<div class="mb-4 border-l-4 px-3 py-2 text-[0.72rem] tracking-[0.1em] ${style}">${message}</div>`;
  setTimeout(() => { zone.innerHTML = ''; }, 3200);
}

function renderStars(avg) {
  const full = Math.round(Number(avg) || 0);
  return '★★★★★'.split('').map((s, i) =>
    `<span class="${i < full ? 'text-secondary' : 'text-border'} text-[0.7rem] drop-shadow-[0_0_6px_#9b59f7]">${s}</span>`
  ).join('');
}

function fmtMoney(value) {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n.toFixed(2) : '—';
}

function fmtDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.valueOf()) ? '—' : d.toLocaleDateString();
}