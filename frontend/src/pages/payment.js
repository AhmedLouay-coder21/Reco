import { api, getUserFirstName, isAuthenticated, isTokenValid } from '../api/auth.js';
import { renderLayout } from '../layout.js';
import { Login } from './login.js';
import { DashboardView } from './dashboard.js';

const paymentState = {
  cart: null,
  loading: false,
};

function setupNav() {
  const nav = document.getElementById('nav-slot');
  if (nav && nav.innerHTML.trim() === '') {
    renderLayout();
  }

  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn && isAuthenticated() && isTokenValid()) {
    loginBtn.className = 'cart-btn group flex items-center justify-center w-12 h-12 rounded-full border border-line-bright text-line-bright transition-all hover:bg-secondary/10 hover:shadow-[0_0_20px_var(--color-pulse-glow1)]';
    loginBtn.textContent = getUserFirstName()[0].toUpperCase();
    loginBtn.addEventListener('click', () => {
      DashboardView();
    });
    return;
  }

  if (loginBtn) {
    loginBtn.addEventListener('click', Login);
  }
}

function fmtMoney(v) {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n.toFixed(2) : '0.00';
}

function paymentShell() {
  return `
    <section class="relative pt-28 pb-10 px-6 lg:px-20 overflow-hidden">
      <div class="absolute -top-32 right-0 w-[420px] h-[420px] bg-secondary/10 blur-3xl rounded-full"></div>
      <div class="absolute -bottom-32 left-10 w-[320px] h-[320px] bg-line-dim/40 blur-3xl rounded-full"></div>

      <div class="relative z-10 flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <p class="font-space text-[0.6rem] tracking-[0.35em] uppercase text-secondary">Secure transfer</p>
          <h1 class="font-bebas text-[clamp(2.8rem,8vw,5rem)] tracking-[0.15em] leading-none text-line-bright">PAYMENT NODE</h1>
          <p class="text-[0.8rem] text-muted max-w-[520px]">Complete your order and send the signal through. This page uses the backend checkout flow to create the order and process payment.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8">
          <form id="payment-form" class="border border-border bg-surface2 p-6 lg:p-8">
            <div class="flex items-center justify-between mb-6">
              <div>
                <div class="font-bebas text-2xl tracking-[0.2em] text-line-bright">Transfer Details</div>
                <div class="text-[0.62rem] tracking-[0.2em] uppercase text-muted">Step 2 of 2</div>
              </div>
              <div class="px-3 py-1 border border-secondary/40 text-[0.6rem] tracking-[0.2em] uppercase text-secondary">LIVE</div>
            </div>

            <div class="grid gap-4">
              <label class="block">
                <span class="text-[0.62rem] tracking-[0.2em] uppercase text-muted">Payment Method</span>
                <select id="payment-method" class="mt-2 w-full bg-surface border border-border text-[0.75rem] text-(--color-white) px-3 py-2 font-josefin outline-none focus:border-secondary">
                  <option value="MOCK_GATEWAY">Mock Gateway</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                </select>
              </label>

              <div id="card-fields" class="grid gap-3 hidden">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label class="block">
                    <span class="text-[0.6rem] tracking-[0.2em] uppercase text-muted">Cardholder</span>
                    <input id="card-name" class="mt-2 w-full bg-surface border border-border text-[0.75rem] text-(--color-white) px-3 py-2 font-josefin outline-none focus:border-secondary" placeholder="Name on card" />
                  </label>
                  <label class="block">
                    <span class="text-[0.6rem] tracking-[0.2em] uppercase text-muted">Card Number</span>
                    <input id="card-number" class="mt-2 w-full bg-surface border border-border text-[0.75rem] text-(--color-white) px-3 py-2 font-josefin outline-none focus:border-secondary" placeholder="1111 2222 3333 4444" />
                  </label>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <label class="block">
                    <span class="text-[0.6rem] tracking-[0.2em] uppercase text-muted">Expiry</span>
                    <input id="card-exp" class="mt-2 w-full bg-surface border border-border text-[0.75rem] text-(--color-white) px-3 py-2 font-josefin outline-none focus:border-secondary" placeholder="MM/YY" />
                  </label>
                  <label class="block">
                    <span class="text-[0.6rem] tracking-[0.2em] uppercase text-muted">CVC</span>
                    <input id="card-cvc" class="mt-2 w-full bg-surface border border-border text-[0.75rem] text-(--color-white) px-3 py-2 font-josefin outline-none focus:border-secondary" placeholder="123" />
                  </label>
                </div>
              </div>

              <div id="payment-status" class="text-[0.7rem] tracking-[0.15em] uppercase text-muted"></div>

              <button id="payment-submit" type="submit" class="mt-2 px-6 py-3 border border-secondary bg-secondary/10 text-line-bright text-[0.7rem] tracking-[0.2em] uppercase font-semibold hover:bg-secondary/20 hover:shadow-[0_0_24px_rgba(155,89,247,.35)] transition-all">
                Place Order and Pay
              </button>
            </div>
          </form>

          <aside class="border border-border bg-surface2 p-6 lg:p-8">
            <div class="font-bebas text-2xl tracking-[0.2em] text-line-bright mb-4">Cart Summary</div>
            <div id="payment-summary" class="text-[0.72rem] tracking-[0.2em] uppercase text-muted">Loading cart...</div>
            <div id="payment-items" class="mt-4 flex flex-col gap-3"></div>
            <div class="mt-6 border-t border-border pt-4 flex items-center justify-between">
              <span class="text-[0.65rem] tracking-[0.2em] uppercase text-muted">Total</span>
              <span id="payment-total" class="font-bebas text-3xl text-line-bright">$0.00</span>
            </div>
            <div class="mt-6 text-[0.62rem] tracking-[0.18em] uppercase text-muted">Orders are created from the active cart in the backend.</div>
          </aside>
        </div>
      </div>
    </section>
  `;
}

function setStatus(message, type = 'muted') {
  const el = document.getElementById('payment-status');
  if (!el) return;
  const color = type === 'error' ? 'text-red-300' : type === 'success' ? 'text-emerald-300' : 'text-muted';
  el.className = `text-[0.7rem] tracking-[0.15em] uppercase ${color}`;
  el.textContent = message || '';
}

function renderSummary() {
  const summary = document.getElementById('payment-summary');
  const itemsEl = document.getElementById('payment-items');
  const totalEl = document.getElementById('payment-total');
  if (!summary || !itemsEl || !totalEl) return;

  const cart = paymentState.cart;
  if (!cart || !Array.isArray(cart.items)) {
    summary.textContent = 'Cart not available.';
    itemsEl.innerHTML = '';
    totalEl.textContent = '$0.00';
    return;
  }

  if (cart.items.length === 0) {
    summary.textContent = 'Your cart is empty.';
    itemsEl.innerHTML = '<div class="text-[0.7rem] tracking-[0.2em] uppercase text-muted">Add items from the catalog first.</div>';
    totalEl.textContent = '$0.00';
    return;
  }

  summary.textContent = `${cart.totalQuantity} item${cart.totalQuantity !== 1 ? 's' : ''} ready for transfer.`;
  itemsEl.innerHTML = cart.items.map(item => `
    <div class="flex items-center justify-between border border-border bg-surface px-3 py-2">
      <div>
        <div class="font-josefin text-[0.78rem] tracking-[0.1em] uppercase text-line-bright">${item.productName}</div>
        <div class="text-[0.62rem] tracking-[0.2em] uppercase text-muted">Qty ${item.quantity}</div>
      </div>
      <div class="font-bebas text-lg text-lavender">$${fmtMoney(item.lineTotal)}</div>
    </div>
  `).join('');

  totalEl.textContent = `$${fmtMoney(cart.subtotal)}`;
}

async function loadCart() {
  try {
    const cart = await api('/cart');
    paymentState.cart = cart;
    renderSummary();
  } catch (err) {
    paymentState.cart = null;
    renderSummary();
    setStatus(err?.message || 'Unable to load cart', 'error');
  }
}

function bindPaymentForm() {
  const methodSelect = document.getElementById('payment-method');
  const cardFields = document.getElementById('card-fields');
  if (methodSelect && cardFields) {
    methodSelect.addEventListener('change', () => {
      cardFields.classList.toggle('hidden', methodSelect.value !== 'CREDIT_CARD');
    });
  }

  const form = document.getElementById('payment-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (paymentState.loading) return;

    if (!isAuthenticated() || !isTokenValid()) {
      setStatus('Login required to pay', 'error');
      return;
    }

    const cart = paymentState.cart;
    if (!cart || !cart.items || cart.items.length === 0) {
      setStatus('Cart is empty', 'error');
      return;
    }

    paymentState.loading = true;
    const submitBtn = document.getElementById('payment-submit');
    if (submitBtn) submitBtn.textContent = 'Processing...';

    const method = methodSelect?.value || 'MOCK_GATEWAY';
    let details = 'Mock gateway';
    if (method === 'CREDIT_CARD') {
      const name = document.getElementById('card-name')?.value || 'Cardholder';
      const number = document.getElementById('card-number')?.value || '0000';
      const last4 = number.slice(-4).padStart(4, '0');
      details = `${name} - ${last4}`;
    }

    try {
      const order = await api('/orders', { method: 'POST' });
      const payment = await api(`/orders/${order.id}/payment`, {
        method: 'POST',
        body: JSON.stringify({
          amount: Number(cart.subtotal) || 0,
          paymentMethod: method,
          paymentMethodDetails: details,
        }),
      });

      setStatus(`Payment ${payment.status} for order #${order.id}`, 'success');
      await loadCart();
    } catch (err) {
      setStatus(err?.message || 'Payment failed', 'error');
    } finally {
      paymentState.loading = false;
      if (submitBtn) submitBtn.textContent = 'Place Order and Pay';
    }
  });
}

export async function PaymentView() {
  setupNav();
  const app = document.getElementById('app');
  app.innerHTML = paymentShell();
  bindPaymentForm();
  await loadCart();
}
