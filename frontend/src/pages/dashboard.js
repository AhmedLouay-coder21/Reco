import { api, getUserRole, getUserFirstName, isAuthenticated, isTokenValid } from '../api/auth.js';


const token = () => localStorage.getItem('auth_token');

const navItemBaseClass = 'flex items-center gap-2 px-5 py-2 text-[0.72rem] tracking-[0.18em] uppercase transition-all cursor-pointer border-l-2 max-md:justify-center max-md:px-3';
const navItemInactiveClass = 'text-muted border-transparent hover:text-line-bright hover:bg-secondary/10';
const navItemActiveClass = 'text-line-bright border-secondary bg-secondary/10';
const navSectionClass = 'px-5 pt-4 pb-1 text-[0.58rem] tracking-[0.3em] uppercase text-secondary/50 max-md:hidden';

const btnBaseClass = 'inline-flex items-center justify-center gap-2 border border-secondary/60 bg-secondary/10 text-line-bright text-[0.65rem] tracking-[0.18em] uppercase transition-all hover:bg-secondary/20 hover:shadow-[0_0_16px_var(--color-glow)]';
const btnMdClass = 'px-4 py-2';
const btnSmClass = 'px-2.5 py-1 text-[0.58rem]';
const btnDangerClass = 'border-red-400/70 text-red-300 bg-red-500/10 hover:bg-red-500/20';
const btnSuccessClass = 'border-emerald-400/70 text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20';
const btnGhostClass = 'w-full px-3 py-2 border border-border text-[0.65rem] tracking-[0.15em] uppercase text-muted transition-all hover:border-red-400/70 hover:text-red-300';

const formClass = 'grid gap-3.5';
const formRowClass = 'grid grid-cols-2 gap-3.5 max-md:grid-cols-1';
const labelClass = 'block text-[0.62rem] tracking-[0.18em] uppercase text-muted mb-1.5';
const inputClass = 'w-full bg-surface border border-border text-[0.8rem] text-(--color-white) px-3 py-2 font-josefin outline-none focus:border-secondary focus:shadow-[0_0_12px_var(--color-glow)]';
const selectClass = `${inputClass} pr-8`;
const selectSmClass = 'bg-surface border border-border text-[0.65rem] text-(--color-white) px-2 py-1 font-josefin outline-none focus:border-secondary focus:shadow-[0_0_12px_var(--color-glow)]';
const textareaClass = `${inputClass} min-h-[80px] resize-y`;

const tableWrapClass = 'border border-border overflow-x-auto';
const tableClass = 'w-full border-collapse';
const thClass = 'text-[0.62rem] tracking-[0.2em] uppercase text-muted px-4 py-3 border-b border-border text-left bg-surface';
const tdClass = 'text-[0.78rem] px-4 py-3 border-b border-border/60';

function loadingMarkup(label) {
  return `
    <div class="flex items-center justify-center gap-2 py-10 text-[0.72rem] tracking-[0.2em] uppercase text-muted">
      <span>${label}</span>
      <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-border border-t-secondary"></span>
    </div>`;
}

function emptyMarkup(message) {
  return `<div class="text-center py-10 text-[0.72rem] tracking-[0.2em] uppercase text-muted">${message}</div>`;
}

//entry
export function DashboardView() {
  if (!isAuthenticated() || !isTokenValid()) { window.location.href = '/login'; return; }

  const role = getUserRole();
  const main = document.querySelector('#app');
  const nav  = document.getElementById('nav-slot');
  const foot = document.getElementById('footer-slot');
  if (nav)  nav.innerHTML  = '';
  if (foot) foot.innerHTML = '';

  main.innerHTML = role === 'ADMIN' ? AdminShell() : CustomerShell();
  role === 'ADMIN' ? bootAdmin() : bootCustomer();
}

//shells
function AdminShell() {
  const name = getUserFirstName();
  const initial = name[0].toUpperCase();
  return `
  <div id="dash-root" class="min-h-screen flex bg-main text-(--color-white) font-josefin">
    <aside class="w-[220px] min-h-screen flex-shrink-0 bg-surface border-r border-border flex flex-col sticky top-0 h-screen overflow-y-auto max-md:w-16">
      <div class="font-bebas text-[1.6rem] tracking-[0.15em] text-line-bright drop-shadow-[0_0_20px_var(--color-glow)] px-5 pt-7 pb-5 border-b border-border">
        THE FIELD<span class="block text-[0.65rem] tracking-[0.25em] text-muted mt-0.5 max-md:hidden">Admin Control</span>
      </div>
      <nav class="flex-1 py-4">
        <div class="${navSectionClass}">Overview</div>
        <div class="${navItemBaseClass} ${navItemActiveClass}" data-panel="overview"><span class="text-[1rem] w-4 text-center">◎</span><span class="max-md:hidden">Overview</span></div>
        <div class="${navSectionClass}">Manage</div>
        <div class="${navItemBaseClass} ${navItemInactiveClass}" data-panel="products"><span class="text-[1rem] w-4 text-center">⬡</span><span class="max-md:hidden">Products</span></div>
        <div class="${navItemBaseClass} ${navItemInactiveClass}" data-panel="categories"><span class="text-[1rem] w-4 text-center">◈</span><span class="max-md:hidden">Categories</span></div>
        <div class="${navItemBaseClass} ${navItemInactiveClass}" data-panel="orders"><span class="text-[1rem] w-4 text-center">▣</span><span class="max-md:hidden">Orders</span></div>
        <div class="${navItemBaseClass} ${navItemInactiveClass}" data-panel="users"><span class="text-[1rem] w-4 text-center">◑</span><span class="max-md:hidden">Users</span></div>
        <div class="${navSectionClass}">Intelligence</div>
        <div class="${navItemBaseClass} ${navItemInactiveClass}" data-panel="cache"><span class="text-[1rem] w-4 text-center">⟳</span><span class="max-md:hidden">Rec. Cache</span></div>
      </nav>
      <div class="px-5 py-4 border-t border-border">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-line-dim to-secondary flex items-center justify-center font-bebas text-[0.9rem] text-white flex-shrink-0">${initial}</div>
          <div class="max-md:hidden">
            <div class="text-[0.72rem] tracking-[0.1em] text-(--color-white)">${name}</div>
            <div class="text-[0.6rem] tracking-[0.15em] uppercase text-muted">Admin</div>
          </div>
        </div>
        <button class="${btnGhostClass} mt-3 max-md:hidden" id="dashLogout">⏻ Logout</button>
      </div>
    </aside>
    <div class="flex-1 flex flex-col min-w-0">
      <div class="h-[60px] border-b border-border bg-surface px-7 flex items-center justify-between sticky top-0 z-50">
        <div class="font-bebas text-[1.2rem] tracking-[0.2em] text-line-bright" id="topbar-title">Overview</div>
        <div class="flex items-center gap-3">
          <span class="text-[0.62rem] tracking-[0.15em] uppercase px-2.5 py-1 border border-secondary text-line-bright bg-secondary/10">Admin</span>
        </div>
      </div>
      <div class="flex-1 p-7 max-md:p-4 overflow-y-auto">
        <div id="alert-zone"></div>
        <div id="panel-overview" class="dash-panel"></div>
        <div id="panel-products" class="dash-panel hidden"></div>
        <div id="panel-categories" class="dash-panel hidden"></div>
        <div id="panel-orders" class="dash-panel hidden"></div>
        <div id="panel-users" class="dash-panel hidden"></div>
        <div id="panel-cache" class="dash-panel hidden"></div>
      </div>
    </div>
  </div>
  <div id="modal-zone"></div>`;
}

function CustomerShell() {
  const name = getUserFirstName();
  const initial = name[0].toUpperCase();
  return `
  <div id="dash-root" class="min-h-screen flex bg-main text-(--color-white) font-josefin">
    <aside class="w-[220px] min-h-screen flex-shrink-0 bg-surface border-r border-border flex flex-col sticky top-0 h-screen overflow-y-auto max-md:w-16">
      <div class="font-bebas text-[1.6rem] tracking-[0.15em] text-line-bright drop-shadow-[0_0_20px_var(--color-glow)] px-5 pt-7 pb-5 border-b border-border">
        THE FIELD<span class="block text-[0.65rem] tracking-[0.25em] text-muted mt-0.5 max-md:hidden">My Channel</span>
      </div>
      <nav class="flex-1 py-4">
        <div class="${navSectionClass}">Discover</div>
        <div class="${navItemBaseClass} ${navItemActiveClass}" data-panel="browse"><span class="text-[1rem] w-4 text-center">⬡</span><span class="max-md:hidden">Browse</span></div>
        <div class="${navItemBaseClass} ${navItemInactiveClass}" data-panel="recs"><span class="text-[1rem] w-4 text-center">◎</span><span class="max-md:hidden">For You</span></div>
        <div class="${navSectionClass}">My Account</div>
        <div class="${navItemBaseClass} ${navItemInactiveClass}" data-panel="cart"><span class="text-[1rem] w-4 text-center">▣</span><span class="max-md:hidden">Cart</span></div>
        <div class="${navItemBaseClass} ${navItemInactiveClass}" data-panel="orders"><span class="text-[1rem] w-4 text-center">◈</span><span class="max-md:hidden">My Orders</span></div>
        <div class="${navItemBaseClass} ${navItemInactiveClass}" data-panel="reviews"><span class="text-[1rem] w-4 text-center">★</span><span class="max-md:hidden">My Reviews</span></div>
        <div class="${navItemBaseClass} ${navItemInactiveClass}" data-panel="profile"><span class="text-[1rem] w-4 text-center">◑</span><span class="max-md:hidden">Profile</span></div>
      </nav>
      <div class="px-5 py-4 border-t border-border">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-line-dim to-secondary flex items-center justify-center font-bebas text-[0.9rem] text-white flex-shrink-0">${initial}</div>
          <div class="max-md:hidden">
            <div class="text-[0.72rem] tracking-[0.1em] text-(--color-white)">${name}</div>
            <div class="text-[0.6rem] tracking-[0.15em] uppercase text-muted">Customer</div>
          </div>
        </div>
        <button class="${btnGhostClass} mt-3 max-md:hidden" id="dashLogout">⏻ Logout</button>
      </div>
    </aside>
    <div class="flex-1 flex flex-col min-w-0">
      <div class="h-[60px] border-b border-border bg-surface px-7 flex items-center justify-between sticky top-0 z-50">
        <div class="font-bebas text-[1.2rem] tracking-[0.2em] text-line-bright" id="topbar-title">Browse</div>
        <div class="flex items-center gap-3">
          <span class="text-[0.62rem] tracking-[0.15em] uppercase px-2.5 py-1 border border-secondary text-line-bright bg-secondary/10">Customer</span>
        </div>
      </div>
      <div class="flex-1 p-7 max-md:p-4 overflow-y-auto">
        <div id="alert-zone"></div>
        <div id="panel-browse" class="dash-panel"></div>
        <div id="panel-recs" class="dash-panel hidden"></div>
        <div id="panel-cart" class="dash-panel hidden"></div>
        <div id="panel-orders" class="dash-panel hidden"></div>
        <div id="panel-reviews" class="dash-panel hidden"></div>
        <div id="panel-profile" class="dash-panel hidden"></div>
      </div>
    </div>
  </div>
  <div id="modal-zone"></div>`;
}

//shared utils
function showAlert(msg, type = 'success') {
  const zone = document.getElementById('alert-zone');
  if (!zone) return;
  const typeClass = type === 'error'
    ? 'border-red-400/70 bg-red-500/10 text-red-300'
    : 'border-emerald-400/70 bg-emerald-500/10 text-emerald-300';
  zone.innerHTML = `<div class="mb-4 border-l-4 px-3 py-2 text-[0.72rem] tracking-[0.1em] ${typeClass}">${msg}</div>`;
  setTimeout(() => { zone.innerHTML = ''; }, 3500);
}

function openModal(html) {
  const zone = document.getElementById('modal-zone');
  zone.innerHTML = `<div class="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 backdrop-blur-sm" id="modal-bg">${html}</div>`;
  document.getElementById('modal-bg').addEventListener('click', e => {
    if (e.target.id === 'modal-bg') closeModal();
  });
}
function closeModal() {
  const zone = document.getElementById('modal-zone');
  if (zone) zone.innerHTML = '';
}

function statusPill(s) {
  const base = 'inline-block px-2 py-0.5 text-[0.6rem] tracking-[0.12em] uppercase border';
  const map = {
    Pending: 'text-yellow-300 border-yellow-300/80 bg-yellow-400/10',
    Completed: 'text-emerald-300 border-emerald-300/80 bg-emerald-400/10',
    Cancelled: 'text-red-300 border-red-300/80 bg-red-400/10',
    ADMIN: 'text-line-bright border-secondary/70 bg-secondary/10',
    CUSTOMER: 'text-muted border-border/70 bg-surface',
  };
  return `<span class="${base} ${map[s] || 'text-muted border-border/70 bg-surface'}">${s}</span>`;
}

function stars(avg) {
  const full = Math.round(avg || 0);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

function navRouter(panels) {
  const navActiveClasses = ['text-line-bright', 'border-secondary', 'bg-secondary/10'];
  const navInactiveClasses = ['text-muted', 'border-transparent'];

  document.querySelectorAll('[data-panel]').forEach(el => {
    el.addEventListener('click', () => {
      const target = el.dataset.panel;
      document.querySelectorAll('[data-panel]').forEach(i => {
        i.classList.remove(...navActiveClasses);
        i.classList.add(...navInactiveClasses);
      });
      el.classList.add(...navActiveClasses);
      el.classList.remove(...navInactiveClasses);
      document.querySelectorAll('.dash-panel').forEach(p => p.classList.add('hidden'));
      const panel = document.getElementById(`panel-${target}`);
      if (panel) panel.classList.remove('hidden');
      document.getElementById('topbar-title').textContent = el.querySelector('span:last-child')?.textContent || target;
      if (panels[target]) panels[target]();
    });
  });

  document.getElementById('dashLogout')?.addEventListener('click', () => {
    ['auth_token','firstName','lastName','role','user_id'].forEach(k => localStorage.removeItem(k));
    window.location.href = '/';
  });
}

//admin boot

function bootAdmin() {
  loadAdminOverview();
  navRouter({
    overview:   loadAdminOverview,
    products:   loadAdminProducts,
    categories: loadAdminCategories,
    orders:     loadAdminOrders,
    users:      loadAdminUsers,
    cache:      loadAdminCache,
  });
}

//admin overview
async function loadAdminOverview() {
  const el = document.getElementById('panel-overview');
  el.innerHTML = loadingMarkup('Tuning in');
  try {
    const [prods, cats, usersData] = await Promise.allSettled([
      api(`/products`),
      api("/categories"),
      api(`/users`),
    ]);
    const totalProducts = prods.status === 'fulfilled' ? (prods == 'undefined' ? "0" : prods.value.content.length) : '—' ;
    const totalCats     = cats.status  === 'fulfilled' ? (cats == 'undefined' ? "0" : cats.value.length) : '—';
    const totalUsers    = usersData.status === 'fulfilled' ? (usersData == 'undefined' ? "0" : usersData.value.length - 1) : '—';

    el.innerHTML = `
      <div class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 mb-7">
        <div class="relative overflow-hidden border border-border bg-surface2 p-5">
          <div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent opacity-60"></div>
          <div class="absolute top-4 right-4 text-xl opacity-25">⬡</div>
          <div class="font-bebas text-[2.4rem] text-line-bright leading-none">${totalProducts}</div>
          <div class="text-[0.62rem] tracking-[0.2em] uppercase text-muted mt-1">Products</div>
        </div>
        <div class="relative overflow-hidden border border-border bg-surface2 p-5">
          <div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent opacity-60"></div>
          <div class="absolute top-4 right-4 text-xl opacity-25">◈</div>
          <div class="font-bebas text-[2.4rem] text-line-bright leading-none">${totalCats}</div>
          <div class="text-[0.62rem] tracking-[0.2em] uppercase text-muted mt-1">Categories</div>
        </div>
        <div class="relative overflow-hidden border border-border bg-surface2 p-5">
          <div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent opacity-60"></div>
          <div class="absolute top-4 right-4 text-xl opacity-25">◑</div>
          <div class="font-bebas text-[2.4rem] text-line-bright leading-none">${totalUsers}</div>
          <div class="text-[0.62rem] tracking-[0.2em] uppercase text-muted mt-1">Users</div>
        </div>
        <div class="relative overflow-hidden border border-border bg-surface2 p-5">
          <div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent opacity-60"></div>
          <div class="absolute top-4 right-4 text-xl opacity-25">◎</div>
          <div class="font-bebas text-[2.4rem] text-line-bright leading-none">—</div>
          <div class="text-[0.62rem] tracking-[0.2em] uppercase text-muted mt-1">Orders Today</div>
        </div>
      </div>
      <div class="flex items-center justify-between mb-4">
        <div class="font-bebas text-[1.1rem] tracking-[0.2em] text-line-bright">Recent Orders</div>
      </div>
      <div id="admin-recent-orders">${loadingMarkup('Loading')}</div>
    `;
    loadRecentOrders();
  } catch {
    el.innerHTML = emptyMarkup('Could not load overview — is the backend running?');
  }
}

async function loadRecentOrders() {
  const el = document.getElementById('admin-recent-orders');
  if (!el) return;
  try {
    // admin doesn't have a global orders list endpoint in the spec, so we show a placeholder
    el.innerHTML = emptyMarkup('Select Orders panel to manage all orders.');
  } catch { el.innerHTML = emptyMarkup('—'); }
}

function openProductModal(product) {
  const isEdit = !!product;
  openModal(`
    <div class="relative w-[min(520px,95vw)] max-h-[90vh] overflow-y-auto border border-border bg-surface2 p-7">
      <button class="absolute top-3.5 right-3.5 text-muted text-xl hover:text-line-bright" onclick="document.getElementById('modal-bg').remove()">✕</button>
      <div class="font-bebas text-[1.3rem] tracking-[0.2em] text-line-bright mb-5">${isEdit ? 'Edit Product' : 'New Product'}</div>
      <div class="${formClass}">
        <div><label class="${labelClass}">Name</label><input class="${inputClass}" id="mp-name" value="${isEdit ? product.name : ''}"></div>
        <div class="${formRowClass}">
          <div><label class="${labelClass}">Price ($)</label><input class="${inputClass}" id="mp-price" type="number" step="0.01" value="${isEdit ? product.price : ''}"></div>
          <div><label class="${labelClass}">Stock</label><input class="${inputClass}" id="mp-stock" type="number" value="${isEdit ? product.stock_quantity : ''}"></div>
        </div>
        <div><label class="${labelClass}">Category ID</label><input class="${inputClass}" id="mp-cat" type="number" value="${isEdit ? product.category_id : ''}"></div>
        <div><label class="${labelClass}">Tags (comma-separated)</label><input class="${inputClass}" id="mp-tags" value="${isEdit ? (product.tags||'') : ''}"></div>
        <div><label class="${labelClass}">Description</label><textarea class="${textareaClass}" id="mp-desc">${isEdit ? (product.description||'') : ''}</textarea></div>
      </div>
      <div class="mt-5 flex justify-end gap-2.5">
        <button class="${btnBaseClass} ${btnMdClass}" id="mp-save">${isEdit ? 'Update' : 'Create'}</button>
      </div>
    </div>`);

  document.getElementById('mp-save').addEventListener('click', async () => {
    const body = {
      name: document.getElementById('mp-name').value,
      price: parseFloat(document.getElementById('mp-price').value),
      stock_quantity: parseInt(document.getElementById('mp-stock').value),
      category_id: parseInt(document.getElementById('mp-cat').value),
      tags: document.getElementById('mp-tags').value,
      description: document.getElementById('mp-desc').value,
    };
    try {
      if (isEdit) await api(`/products/${product.id}`, { method:'PUT', body: JSON.stringify(body) });
      else await api('/products', { method:'POST', body: JSON.stringify(body) });
      closeModal(); showAlert(isEdit ? 'Product updated' : 'Product created'); loadAdminProducts();
    } catch(e) { showAlert(e.message, 'error'); }
  });
}

//admin categories
async function loadAdminCategories() {
  const el = document.getElementById('panel-categories');
  el.innerHTML = loadingMarkup('Loading');
  try {
    const categories = await api('/categories');
    el.innerHTML = `
      <div class="flex items-center justify-between mb-4">
        <div class="font-bebas text-[1.1rem] tracking-[0.2em] text-line-bright">Categories (${categories.length})</div>
        <button class="${btnBaseClass} ${btnMdClass}" id="newCatBtn">+ New Category</button>
      </div>
      <div class="${tableWrapClass}">
        <table class="${tableClass}">
          <thead><tr><th class="${thClass}">ID</th><th class="${thClass}">Name</th><th class="${thClass}">Description</th><th class="${thClass}">Actions</th></tr></thead>
          <tbody>
            ${categories.map(c => `
              <tr>
                <td class="${tdClass}">#${c.id}</td>
                <td class="${tdClass}">${c.name}</td>
                <td class="${tdClass}">${c.description || '—'}</td>
                <td class="${tdClass}">
                  <button class="${btnBaseClass} ${btnSmClass}" data-edit-cat="${c.id}" data-cat='${JSON.stringify(c)}'>Edit</button>
                  <button class="${btnBaseClass} ${btnSmClass} ${btnDangerClass}" data-del-cat="${c.id}">Del</button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`;

    document.getElementById('newCatBtn').addEventListener('click', () => openCatModal(null));
    el.querySelectorAll('[data-edit-cat]').forEach(btn => btn.addEventListener('click', () => openCatModal(JSON.parse(btn.dataset.cat))));
    el.querySelectorAll('[data-del-cat]').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Delete category?')) return;
        try { await api(`/categories/${btn.dataset.delCat}`, { method:'DELETE' }); showAlert('Category deleted'); loadAdminCategories(); }
        catch(e) { showAlert(e.message, 'error'); }
      });
    });
  } catch(e) { el.innerHTML = emptyMarkup(e.message); }
}

function openCatModal(cat) {
  const isEdit = !!cat;
  openModal(`
    <div class="relative w-[min(520px,95vw)] max-h-[90vh] overflow-y-auto border border-border bg-surface2 p-7">
      <button class="absolute top-3.5 right-3.5 text-muted text-xl hover:text-line-bright" onclick="document.getElementById('modal-bg').remove()">✕</button>
      <div class="font-bebas text-[1.3rem] tracking-[0.2em] text-line-bright mb-5">${isEdit ? 'Edit Category' : 'New Category'}</div>
      <div class="${formClass}">
        <div><label class="${labelClass}">Name</label><input class="${inputClass}" id="mc-name" value="${isEdit ? cat.name : ''}"></div>
        <div><label class="${labelClass}">Description</label><textarea class="${textareaClass}" id="mc-desc">${isEdit ? (cat.description||'') : ''}</textarea></div>
      </div>
      <div class="mt-5 flex justify-end gap-2.5">
        <button class="${btnBaseClass} ${btnMdClass}" id="mc-save">${isEdit ? 'Update' : 'Create'}</button>
      </div>
    </div>`);
  document.getElementById('mc-save').addEventListener('click', async () => {
    const body = { name: document.getElementById('mc-name').value, description: document.getElementById('mc-desc').value };
    try {
      if (isEdit) await api(`/categories/${cat.id}`, { method:'PUT', body: JSON.stringify(body) });
      else await api('/categories', { method:'POST', body: JSON.stringify(body) });
      closeModal(); showAlert(isEdit ? 'Category updated' : 'Category created'); loadAdminCategories();
    } catch(e) { showAlert(e.message, 'error'); }
  });
}

//admin users
async function loadAdminUsers() {
  const el = document.getElementById('panel-users');
  el.innerHTML = loadingMarkup('Loading users');
  try {
    const users = await api('/users');
    el.innerHTML = `
      <div class="flex items-center justify-between mb-4"><div class="font-bebas text-[1.1rem] tracking-[0.2em] text-line-bright">Users (${users.total})</div></div>
      <div class="${tableWrapClass}">
        <table class="${tableClass}">
          <thead><tr><th class="${thClass}">ID</th><th class="${thClass}">Username</th><th class="${thClass}">Email</th><th class="${thClass}">Role</th><th class="${thClass}">Joined</th><th class="${thClass}">Actions</th></tr></thead>
          <tbody>
            ${users.map(u => `
              <tr>
                <td class="${tdClass}">#${u.id}</td>
                <td class="${tdClass}">${u.username}</td>
                <td class="${tdClass}">${u.email}</td>
                <td class="${tdClass}">${statusPill(u.role)}</td>
                <td class="${tdClass}">${new Date(u.created_at).toLocaleDateString()}</td>
                <td class="${tdClass}">
                  <button class="${btnBaseClass} ${btnSmClass} ${btnDangerClass}" data-del-user="${u.id}">Delete</button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`;
    el.querySelectorAll('[data-del-user]').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Delete this user? This cascades to all their data.')) return;
        try { await api(`/users/${btn.dataset.delUser}`, { method:'DELETE' }); showAlert('User deleted'); loadAdminUsers(); }
        catch(e) { showAlert(e.message, 'error'); }
      });
    });
  } catch(e) { el.innerHTML = emptyMarkup(e.message); }
}

//admin cache
async function loadAdminCache() {
  const el = document.getElementById('panel-cache');
  el.innerHTML = loadingMarkup('Scanning cache');
  try {
    const data = await api('/recommendations/cache');
    el.innerHTML = `
      <div class="flex items-center justify-between mb-4">
        <div class="font-bebas text-[1.1rem] tracking-[0.2em] text-line-bright">Recommendation Cache (${data.total})</div>
        <button class="${btnBaseClass} ${btnMdClass} ${btnSuccessClass}" id="refreshAllBtn">↺ Refresh All</button>
      </div>
      <div class="${tableWrapClass}">
        <table class="${tableClass}">
          <thead><tr><th class="${thClass}">Cache ID</th><th class="${thClass}">User ID</th><th class="${thClass}">Products</th><th class="${thClass}">Cached At</th><th class="${thClass}">Expires</th><th class="${thClass}">Actions</th></tr></thead>
          <tbody>
            ${data.cache_entries.map(c => `
              <tr>
                <td class="${tdClass}">#${c.cache_id}</td>
                <td class="${tdClass}">${c.user_id}</td>
                <td class="${tdClass}">${c.product_count}</td>
                <td class="${tdClass}">${new Date(c.cached_at).toLocaleString()}</td>
                <td class="${tdClass}">${new Date(c.expires_at).toLocaleString()}</td>
                <td class="${tdClass}"><button class="${btnBaseClass} ${btnSmClass} ${btnDangerClass}" data-del-cache="${c.cache_id}">Delete</button></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`;

    document.getElementById('refreshAllBtn').addEventListener('click', async () => {
      try {
        const r = await api('/recommendations/refresh', { method:'POST', body: JSON.stringify({}) });
        showAlert(`Refreshed ${r.users_refreshed} users, ${r.cache_entries_created} entries`);
        loadAdminCache();
      } catch(e) { showAlert(e.message, 'error'); }
    });
    el.querySelectorAll('[data-del-cache]').forEach(btn => {
      btn.addEventListener('click', async () => {
        try { await api(`/recommendations/cache/${btn.dataset.delCache}`, { method:'DELETE' }); showAlert('Cache entry deleted'); loadAdminCache(); }
        catch(e) { showAlert(e.message, 'error'); }
      });
    });
  } catch(e) { el.innerHTML = emptyMarkup(e.message); }
}

//customer boot
function bootCustomer() {
  loadBrowse();
  navRouter({
    browse:  loadBrowse,
    recs:    loadRecs,
    cart:    loadCart,
    orders:  loadCustomerOrders,
    reviews: loadMyReviews,
    profile: loadProfile,
  });
}

//browse products
async function loadBrowse() {
  const el = document.getElementById('panel-browse');
  el.innerHTML = loadingMarkup('Channelling objects');
  try {
    const [prodsData, catsData] = await Promise.all([
      api('/products'),
      api('/categories'),
    ]);
    const catOptions = catsData.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    el.innerHTML = `
      <div class="flex items-center justify-between mb-4">
        <div class="font-bebas text-[1.1rem] tracking-[0.2em] text-line-bright">Objects from the Field</div>
        <div class="flex gap-2 items-center">
          <input class="${inputClass} w-[160px]" id="search-q" placeholder="Search...">
          <select class="${selectClass} w-[120px]" id="cat-filter"><option value="">All Categories</option>${catOptions}</select>
          <button class="${btnBaseClass} ${btnMdClass}" id="search-btn">Search</button>
        </div>
      </div>
      <div id="product-grid" class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4"></div>`;

    renderProductGrid(prodsData.products, el);

    document.getElementById('search-btn').addEventListener('click', async () => {
      const q = document.getElementById('search-q').value.trim();
      const cat = document.getElementById('cat-filter').value;
      let url = q ? `/products/search?q=${encodeURIComponent(q)}&limit=24` : `/products${cat ? '&category_id='+cat : ''}`;
      const grid = document.getElementById('product-grid');
      grid.innerHTML = loadingMarkup('Searching');
      try {
        const r = await api(url);
        renderProductGrid(r.products, el);
      } catch(e) { grid.innerHTML = emptyMarkup(e.message); }
    });
  } catch(e) { el.innerHTML = emptyMarkup(e.message); }
}

function renderProductGrid(products, container) {
  const grid = container.querySelector('#product-grid') || document.getElementById('product-grid');
  if (!products.length) { grid.innerHTML = emptyMarkup('No products found'); return; }
  grid.innerHTML = products.map(p => `
    <div class="border border-border bg-surface2 p-4 transition-colors hover:border-secondary/40">
      <div class="font-bebas text-[1rem] tracking-[0.1em] mb-1">${p.name}</div>
      <div class="text-line-bright text-[0.88rem] font-semibold">$${p.price}</div>
      <div class="text-[0.65rem] text-muted tracking-[0.1em] mt-1"><span class="text-secondary text-[0.75rem]">${stars(p.avg_rating)}</span> ${(p.avg_rating||0).toFixed(1)}</div>
      <div class="flex gap-2 mt-3">
        <button class="${btnBaseClass} ${btnSmClass}" data-add-cart="${p.id}">+ Add to Cart</button>
        <button class="${btnBaseClass} ${btnSmClass}" data-view-product="${p.id}">View</button>
      </div>
    </div>`).join('');

  grid.querySelectorAll('[data-add-cart]').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!isAuthenticated() || !isTokenValid()) { showAlert('Please log in with a real account to add to cart', 'error'); return; }
      try {
        await api(`/users/${uid}/cart/items`, { method:'POST', body: JSON.stringify({ product_id: parseInt(btn.dataset.addCart), quantity: 1 }) });
        showAlert('Added to cart');
        // track interaction
        api(`/users/${uid}/interactions`, { method:'POST', body: JSON.stringify({ product_id: parseInt(btn.dataset.addCart), interaction_type: 'cart_add' }) }).catch(()=>{});
      } catch(e) { showAlert(e.message, 'error'); }
    });
  });

  grid.querySelectorAll('[data-view-product]').forEach(btn => {
    btn.addEventListener('click', () => openProductDetailModal(btn.dataset.viewProduct));
  });
}

async function openProductDetailModal(productId) {
  try {
    const [p, reviewData, simData] = await Promise.allSettled([
      api(`/products/${productId}`),
      api(`/products/${productId}/reviews`),
      api(`/products/${productId}/similar`),
    ]);
    const prod = p.value;
    const revs = reviewData.status === 'fulfilled' ? reviewData.value : null;
    const sims = simData.status === 'fulfilled' ? simData.value : null;

    openModal(`
      <div class="relative w-[min(600px,95vw)] max-h-[90vh] overflow-y-auto border border-border bg-surface2 p-7">
        <button class="absolute top-3.5 right-3.5 text-muted text-xl hover:text-line-bright" onclick="document.getElementById('modal-bg').remove()">✕</button>
        <div class="font-bebas text-[1.3rem] tracking-[0.2em] text-line-bright mb-5">${prod.name}</div>
        <div class="flex justify-between items-start mb-4">
          <div>
            <div class="text-[1.4rem] font-semibold text-line-bright">$${prod.price}</div>
            <div class="text-[0.72rem] text-muted tracking-widest mt-1">Stock: ${prod.stock_quantity} · Cat: #${prod.category_id}</div>
            <div class="text-secondary text-[0.75rem] mt-1.5">${stars(prod.avg_rating)} <span class="text-muted text-[0.7rem]">${(prod.avg_rating||0).toFixed(1)} avg</span></div>
          </div>
          <button class="${btnBaseClass} ${btnMdClass}" id="modal-add-cart" data-pid="${prod.id}">+ Add to Cart</button>
        </div>
        <div class="text-[0.78rem] text-muted mb-4 leading-relaxed">${prod.description || ''}</div>
        ${prod.tags ? `<div class="text-[0.65rem] tracking-widest text-secondary mb-4">${prod.tags}</div>` : ''}

        ${revs ? `
          <div class="mb-4">
            <div class="font-bebas text-[1.1rem] tracking-[0.2em] text-line-bright mb-2.5">Reviews (${revs.total})</div>
            ${revs.reviews.slice(0,3).map(r => `
              <div class="border-l-2 border-border py-2 px-3 mb-2">
                <div class="flex justify-between">
                  <span class="text-[0.7rem] tracking-widest">${r.username}</span>
                  <span class="text-secondary text-[0.75rem]">${stars(r.rating)}</span>
                </div>
                <div class="text-[0.75rem] text-muted mt-1">${r.comment || ''}</div>
              </div>`).join('')}
          </div>` : ''}

        <div>
          <div class="font-bebas text-[1.1rem] tracking-[0.2em] text-line-bright mb-2.5">Write a Review</div>
          <div class="${formClass}">
            <div>
              <label class="${labelClass}">Rating</label>
              <div class="flex gap-1.5 mb-1" id="star-picker">
                ${[1,2,3,4,5].map(i => `<span data-val="${i}" class="text-[1.3rem] cursor-pointer text-muted transition-colors">★</span>`).join('')}
              </div>
              <input type="hidden" id="review-rating" value="0">
            </div>
            <div><label class="${labelClass}">Comment</label><textarea class="${textareaClass}" id="review-comment" placeholder="Share your transmission..."></textarea></div>
            <button class="${btnBaseClass} ${btnMdClass}" id="submit-review" data-pid="${prod.id}">Submit Review</button>
          </div>
        </div>

        ${sims && sims.length ? `
          <div class="mt-5">
            <div class="font-bebas text-[1.1rem] tracking-[0.2em] text-line-bright mb-2.5">Similar Objects</div>
            <div class="flex flex-col gap-2">
              ${sims.map(s => `<div class="flex items-center gap-3 border border-border bg-surface2 p-3 transition-colors hover:border-secondary/40"><div class="font-bebas text-[1.6rem] text-secondary w-[52px] text-center leading-none">${(s.similarity_score*100).toFixed(0)}%</div><div class="flex-1"><div class="text-[0.82rem] mb-1">${s.name}</div><div class="text-line-bright text-[0.8rem]">$${s.price}</div></div></div>`).join('')}
            </div>
          </div>` : ''}
      </div>`);

    // star picker
    const picker = document.getElementById('star-picker');
    picker.querySelectorAll('span').forEach(s => {
      s.addEventListener('click', () => {
        const val = parseInt(s.dataset.val);
        document.getElementById('review-rating').value = val;
        picker.querySelectorAll('span').forEach((sp, i) => {
          sp.classList.toggle('text-secondary', i < val);
          sp.classList.toggle('drop-shadow-[0_0_8px_var(--color-secondary)]', i < val);
          sp.classList.toggle('text-muted', i >= val);
        });
      });
    });

    document.getElementById('modal-add-cart').addEventListener('click', async () => {
      if (!isAuthenticated() || !isTokenValid()) { showAlert('Please log in to add to cart', 'error'); return; }
      try {
        await api(`/users/${uid}/cart/items`, { method:'POST', body: JSON.stringify({ product_id: prod.id, quantity: 1 }) });
        showAlert('Added to cart');
      } catch(e) { showAlert(e.message, 'error'); }
    });

    document.getElementById('submit-review').addEventListener('click', async () => {
      const rating = parseInt(document.getElementById('review-rating').value);
      const comment = document.getElementById('review-comment').value;
      if (!rating) { showAlert('Please select a rating', 'error'); return; }
      try {
        await api(`/products/${prod.id}/reviews`, { method:'POST', body: JSON.stringify({ rating, comment }) });
        showAlert('Review submitted'); closeModal();
      } catch(e) { showAlert(e.message, 'error'); }
    });

  } catch(e) { showAlert(e.message, 'error'); }
}

//recommendations
async function loadRecs() {
  const el = document.getElementById('panel-recs');
  el.innerHTML = loadingMarkup('Tuning your frequency');
  try {
    const [personal, popular] = await Promise.allSettled([
      uid ? api(`/users/${uid}/recommendations`) : Promise.reject(),
      api('/recommendations/popular'),
    ]);

    let html = '';
    if (personal.status === 'fulfilled') {
      const d = personal.value;
      html += `
        <div class="flex items-center justify-between mb-4"><div class="font-bebas text-[1.1rem] tracking-[0.2em] text-line-bright">For You (${d.total_count})</div></div>
        <div class="flex flex-col gap-2.5 mb-7">
          ${d.recommendations.map(r => `
            <div class="flex items-center gap-3 border border-border bg-surface2 p-3 transition-colors hover:border-secondary/40">
              <div class="font-bebas text-[1.6rem] text-secondary w-[52px] text-center leading-none">${(r.recommendation_score*100).toFixed(0)}%</div>
              <div class="flex-1">
                <div class="text-[0.82rem] mb-1">${r.name}</div>
                <div class="text-line-bright text-[0.8rem]">$${r.price} · <span class="text-secondary text-[0.7rem]">${stars(r.avg_rating)}</span></div>
              </div>
              <button class="${btnBaseClass} ${btnSmClass}" data-add-cart="${r.product_id}">+ Cart</button>
            </div>`).join('')}
        </div>`;
    }

    if (popular.status === 'fulfilled') {
      html += `
        <div class="flex items-center justify-between mb-4"><div class="font-bebas text-[1.1rem] tracking-[0.2em] text-line-bright">Trending</div></div>
        <div class="flex flex-col gap-2.5">
          ${popular.value.recommendations.map(r => `
            <div class="flex items-center gap-3 border border-border bg-surface2 p-3 transition-colors hover:border-secondary/40">
              <div class="font-bebas text-[1.6rem] text-secondary w-[52px] text-center leading-none">#${r.rank}</div>
              <div class="flex-1">
                <div class="text-[0.82rem] mb-1">${r.name}</div>
                <div class="text-line-bright text-[0.8rem]">$${r.price} · Pop: ${r.popularity_score?.toFixed(1)}</div>
              </div>
              <button class="${btnBaseClass} ${btnSmClass}" data-add-cart="${r.product_id}">+ Cart</button>
            </div>`).join('')}
        </div>`;
    }

    el.innerHTML = html || emptyMarkup('No recommendations available yet');

    el.querySelectorAll('[data-add-cart]').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!uid) { showAlert('Login required', 'error'); return; }
        try {
          await api(`/users/${uid}/cart/items`, { method:'POST', body: JSON.stringify({ product_id: parseInt(btn.dataset.addCart), quantity: 1 }) });
          showAlert('Added to cart');
        } catch(e) { showAlert(e.message, 'error'); }
      });
    });
  } catch(e) { el.innerHTML = emptyMarkup(e.message); }
}

//cart
async function loadCart() {
  const el = document.getElementById('panel-cart');
  el.innerHTML = loadingMarkup('Loading cart');
  if (!isAuthenticated() || !isTokenValid()) { el.innerHTML = emptyMarkup('Log in to view your cart'); return; }
  try {
    const data = await api(`/cart`);
    const items = data.items || [];
    if (!items.length) { el.innerHTML = emptyMarkup('Your cart is empty — browse the Field'); return; }

    el.innerHTML = `
      <div class="flex items-center justify-between mb-4">
        <div class="font-bebas text-[1.1rem] tracking-[0.2em] text-line-bright">Cart (${data.item_count} items)</div>
        <button class="${btnBaseClass} ${btnMdClass} ${btnDangerClass}" id="clear-cart">Clear Cart</button>
      </div>
      <div id="cart-items">
        ${items.map(item => `
          <div class="flex items-center justify-between gap-3 py-3 border-b border-border" data-cart-item="${item.cart_item_id || item.product_id}">
            <div class="text-[0.82rem] flex-1">${item.name}</div>
            <div class="flex items-center gap-2">
              <button class="w-7 h-7 bg-surface border border-border text-(--color-white) text-sm flex items-center justify-center transition-all hover:border-secondary hover:text-line-bright" data-qty-down="${item.cart_item_id}" data-current="${item.quantity}" data-cart="${data.id}">−</button>
              <span class="text-[0.8rem] min-w-[24px] text-center">${item.quantity}</span>
              <button class="w-7 h-7 bg-surface border border-border text-(--color-white) text-sm flex items-center justify-center transition-all hover:border-secondary hover:text-line-bright" data-qty-up="${item.cart_item_id}" data-current="${item.quantity}" data-cart="${data.id}">+</button>
            </div>
            <div class="text-[0.82rem] text-line-bright min-w-[60px] text-right">$${(item.price * item.quantity).toFixed(2)}</div>
            <button class="${btnBaseClass} ${btnSmClass} ${btnDangerClass}" data-remove-item="${item.cart_item_id}" data-cart="${data.id}">✕</button>
          </div>`).join('')}
      </div>
      <div class="border border-border bg-surface2 p-5 mt-5">
        <div class="flex justify-between font-bebas text-[1.1rem] tracking-[0.1em] text-line-bright"><span>Total</span><span>$${data.total_price}</span></div>
        <div class="mt-3.5 flex gap-2.5 justify-end">
          <button class="${btnBaseClass} ${btnMdClass} ${btnSuccessClass}" id="checkout-btn">Checkout →</button>
        </div>
      </div>`;

    document.getElementById('clear-cart').addEventListener('click', async () => {
      if (!confirm('Clear entire cart?')) return;
      try { await api(`/users/${uid}/cart`, { method:'DELETE' }); showAlert('Cart cleared'); loadCart(); }
      catch(e) { showAlert(e.message, 'error'); }
    });

    el.querySelectorAll('[data-remove-item]').forEach(btn => {
      btn.addEventListener('click', async () => {
        try { await api(`/carts/${btn.dataset.cart}/items/${btn.dataset.removeItem}`, { method:'DELETE' }); loadCart(); }
        catch(e) { showAlert(e.message, 'error'); }
      });
    });

    el.querySelectorAll('[data-qty-up],[data-qty-down]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const isUp = btn.hasAttribute('data-qty-up');
        const itemId = btn.dataset.qtyUp || btn.dataset.qtyDown;
        const current = parseInt(btn.dataset.current);
        const newQty = isUp ? current + 1 : Math.max(1, current - 1);
        try { await api(`/carts/${btn.dataset.cart}/items/${itemId}`, { method:'PUT', body: JSON.stringify({ quantity: newQty }) }); loadCart(); }
        catch(e) { showAlert(e.message, 'error'); }
      });
    });

    document.getElementById('checkout-btn').addEventListener('click', () => openCheckout(uid, data.total_price));
  } catch(e) { el.innerHTML = emptyMarkup(e.message); }
}

function openCheckout(uid, total) {
  openModal(`
    <div class="relative w-[min(520px,95vw)] max-h-[90vh] overflow-y-auto border border-border bg-surface2 p-7">
      <button class="absolute top-3.5 right-3.5 text-muted text-xl hover:text-line-bright" onclick="document.getElementById('modal-bg').remove()">✕</button>
      <div class="font-bebas text-[1.3rem] tracking-[0.2em] text-line-bright mb-5">Checkout</div>
      <div class="${formClass}">
        <div>
          <label class="${labelClass}">Payment Method</label>
          <select class="${selectClass}" id="pay-method">
            <option value="MOCK_GATEWAY">Mock Gateway</option>
            <option value="CREDIT_CARD">Credit Card</option>
          </select>
        </div>
        <div class="flex justify-between font-bebas text-[1.1rem] tracking-[0.1em] text-line-bright mt-2"><span>Total</span><span>$${total}</span></div>
      </div>
      <div class="mt-5 flex justify-end gap-2.5">
        <button class="${btnBaseClass} ${btnMdClass} ${btnSuccessClass}" id="place-order-btn">Place Order</button>
      </div>
    </div>`);

  document.getElementById('place-order-btn').addEventListener('click', async () => {
    try {
      const order = await api(`/users/${uid}/orders`, { method:'POST', body: JSON.stringify({}) });
      const payment = await api(`/orders/${order.id}/payment`, { method:'POST', body: JSON.stringify({ amount: total, payment_method: document.getElementById('pay-method').value }) });
      closeModal();
      showAlert(`Order #${order.id} placed! Payment: ${payment.status}`);
      loadCart();
    } catch(e) { showAlert(e.message, 'error'); }
  });
}

//customer orders
async function loadCustomerOrders() {
  const el = document.getElementById('panel-orders');
  el.innerHTML = loadingMarkup('Loading orders');
  if (!isAuthenticated() || !isTokenValid()) { el.innerHTML = emptyMarkup('Log in to view orders'); return; }
  try {
    const data = await api(`/users/${uid}/orders`);
    if (!data.orders.length) { el.innerHTML = emptyMarkup('No orders yet'); return; }
    el.innerHTML = `
      <div class="flex items-center justify-between mb-4"><div class="font-bebas text-[1.1rem] tracking-[0.2em] text-line-bright">My Orders (${data.total})</div></div>
      <div class="${tableWrapClass}">
        <table class="${tableClass}">
          <thead><tr><th class="${thClass}">Order ID</th><th class="${thClass}">Total</th><th class="${thClass}">Status</th><th class="${thClass}">Date</th><th class="${thClass}">Details</th></tr></thead>
          <tbody>
            ${data.orders.map(o => `
              <tr>
                <td class="${tdClass}">#${o.id}</td>
                <td class="${tdClass}">$${o.total_amount}</td>
                <td class="${tdClass}">${statusPill(o.status)}</td>
                <td class="${tdClass}">${new Date(o.created_at).toLocaleDateString()}</td>
                <td class="${tdClass}"><button class="${btnBaseClass} ${btnSmClass}" data-view-order="${o.id}">View</button></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`;

    el.querySelectorAll('[data-view-order]').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          const order = await api(`/orders/${btn.dataset.viewOrder}`);
          openModal(`
            <div class="relative w-[min(520px,95vw)] max-h-[90vh] overflow-y-auto border border-border bg-surface2 p-7">
              <button class="absolute top-3.5 right-3.5 text-muted text-xl hover:text-line-bright" onclick="document.getElementById('modal-bg').remove()">✕</button>
              <div class="font-bebas text-[1.3rem] tracking-[0.2em] text-line-bright mb-5">Order #${order.id}</div>
              <div class="mb-4">${statusPill(order.status)} · $${order.total_amount} · ${new Date(order.created_at).toLocaleDateString()}</div>
              <div class="${tableWrapClass}">
                <table class="${tableClass}">
                  <thead><tr><th class="${thClass}">Product</th><th class="${thClass}">Qty</th><th class="${thClass}">Price</th></tr></thead>
                  <tbody>
                    ${(order.items||[]).map(i => `<tr><td class="${tdClass}">${i.name || '#'+i.product_id}</td><td class="${tdClass}">${i.quantity}</td><td class="${tdClass}">$${i.price_at_purchase}</td></tr>`).join('')}
                  </tbody>
                </table>
              </div>
            </div>`);
        } catch(e) { showAlert(e.message, 'error'); }
      });
    });
  } catch(e) { el.innerHTML = emptyMarkup(e.message); }
}

//my reviews section
async function loadMyReviews() {
  const el = document.getElementById('panel-reviews');
  el.innerHTML = loadingMarkup('Loading reviews');
  if (!isAuthenticated() || !isTokenValid) { el.innerHTML = emptyMarkup('Log in to view reviews'); return; }
  try {
    const data = await api(`/users/${uid}/reviews`);
    if (!data.reviews.length) { el.innerHTML = emptyMarkup('No reviews yet — browse products and share your transmission'); return; }
    el.innerHTML = `
      <div class="flex items-center justify-between mb-4"><div class="font-bebas text-[1.1rem] tracking-[0.2em] text-line-bright">My Reviews (${data.total})</div></div>
      <div class="${tableWrapClass}">
        <table class="${tableClass}">
          <thead><tr><th class="${thClass}">Product</th><th class="${thClass}">Rating</th><th class="${thClass}">Comment</th><th class="${thClass}">Date</th><th class="${thClass}">Actions</th></tr></thead>
          <tbody>
            ${data.reviews.map(r => `
              <tr>
                <td class="${tdClass}">${r.product_name || '#'+r.product_id}</td>
                <td class="${tdClass}"><span class="text-secondary text-[0.75rem]">${stars(r.rating)}</span> ${r.rating}/5</td>
                <td class="${tdClass} max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">${r.comment || '—'}</td>
                <td class="${tdClass}">${new Date(r.created_at).toLocaleDateString()}</td>
                <td class="${tdClass}">
                  <button class="${btnBaseClass} ${btnSmClass}" data-edit-review="${r.review_id}" data-review='${JSON.stringify({...r, comment: r.comment||''})}'>Edit</button>
                  <button class="${btnBaseClass} ${btnSmClass} ${btnDangerClass}" data-del-review="${r.review_id}">Delete</button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`;

    el.querySelectorAll('[data-edit-review]').forEach(btn => {
      btn.addEventListener('click', () => {
        const rev = JSON.parse(btn.dataset.review);
        openModal(`
          <div class="relative w-[min(520px,95vw)] max-h-[90vh] overflow-y-auto border border-border bg-surface2 p-7">
            <button class="absolute top-3.5 right-3.5 text-muted text-xl hover:text-line-bright" onclick="document.getElementById('modal-bg').remove()">✕</button>
            <div class="font-bebas text-[1.3rem] tracking-[0.2em] text-line-bright mb-5">Edit Review</div>
            <div class="${formClass}">
              <div>
                <label class="${labelClass}">Rating</label>
                <div class="flex gap-1.5 mb-1" id="edit-star-picker">
                  ${[1,2,3,4,5].map(i => `<span data-val="${i}" class="text-[1.3rem] cursor-pointer transition-colors ${i <= rev.rating ? 'text-secondary drop-shadow-[0_0_8px_var(--color-secondary)]' : 'text-muted'}">★</span>`).join('')}
                </div>
                <input type="hidden" id="edit-review-rating" value="${rev.rating}">
              </div>
              <div><label class="${labelClass}">Comment</label><textarea class="${textareaClass}" id="edit-review-comment">${rev.comment}</textarea></div>
            </div>
            <div class="mt-5 flex justify-end gap-2.5">
              <button class="${btnBaseClass} ${btnMdClass}" id="save-review-btn" data-rid="${rev.review_id}">Save</button>
            </div>
          </div>`);

        const picker = document.getElementById('edit-star-picker');
        picker.querySelectorAll('span').forEach(s => {
          s.addEventListener('click', () => {
            const val = parseInt(s.dataset.val);
            document.getElementById('edit-review-rating').value = val;
            picker.querySelectorAll('span').forEach((sp, i) => {
              sp.classList.toggle('text-secondary', i < val);
              sp.classList.toggle('drop-shadow-[0_0_8px_var(--color-secondary)]', i < val);
              sp.classList.toggle('text-muted', i >= val);
            });
          });
        });

        document.getElementById('save-review-btn').addEventListener('click', async () => {
          const rating = parseInt(document.getElementById('edit-review-rating').value);
          const comment = document.getElementById('edit-review-comment').value;
          try {
            await api(`/reviews/${rev.review_id}`, { method:'PUT', body: JSON.stringify({ rating, comment }) });
            closeModal(); showAlert('Review updated'); loadMyReviews();
          } catch(e) { showAlert(e.message, 'error'); }
        });
      });
    });

    el.querySelectorAll('[data-del-review]').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Delete this review?')) return;
        try { await api(`/reviews/${btn.dataset.delReview}`, { method:'DELETE' }); showAlert('Review deleted'); loadMyReviews(); }
        catch(e) { showAlert(e.message, 'error'); }
      });
    });
  } catch(e) { el.innerHTML = emptyMarkup(e.message); }
}

//profile
async function loadProfile() {
  const el = document.getElementById('panel-profile');
  el.innerHTML = loadingMarkup('Loading profile');
  if (!isAuthenticated() || !isTokenValid()) { el.innerHTML = emptyMarkup('Not logged in'); return; }
  try {
    const user = await api(`/users/me`);
    const uid = user.id;
    el.innerHTML = `
      <div class="flex items-center justify-between mb-4"><div class="font-bebas text-[1.1rem] tracking-[0.2em] text-line-bright">My Profile</div></div>
      <div class="${formClass} max-w-[400px]">
      <div><label class="${labelClass}">First Name</label><input class="${inputClass}" id="p-firstName" value="${user.firstName}"></div>
      <div><label class="${labelClass}">Last Name</label><input class="${inputClass}" id="p-lastName" value="${user.lastName}"></div>
        <div><label class="${labelClass}">Username</label><input class="${inputClass}" id="p-username" value="${user.username}"></div>
        <div><label class="${labelClass}">Email</label><input class="${inputClass}" id="p-email" value="${user.email}"></div>
        <div class="text-[0.65rem] text-muted tracking-widest">Member since: ${new Date(user.created_at).toLocaleDateString()}</div>
        <div><button class="${btnBaseClass} ${btnMdClass}" id="save-profile-btn">Save Changes</button></div>
        <hr class="border-border my-2">
        <div><button class="${btnBaseClass} ${btnMdClass} ${btnDangerClass}" id="delete-account-btn">Delete Account</button></div>
      </div>`;

    document.getElementById('save-profile-btn').addEventListener('click', async () => {
      try {
        await api(`/users/${uid}`, { method:'PUT', body: JSON.stringify({ firstName: document.getElementById('p-firstName').value, lastName: document.getElementById('p-lastName').value, username: document.getElementById('p-username').value, email: document.getElementById('p-email').value })})
        showAlert('Profile updated');
      } catch(e) { showAlert(e.message, 'error'); }
    });

    document.getElementById('delete-account-btn').addEventListener('click', async () => {
      if (!confirm('Permanently delete your account and all data?')) return;
      try {
        await api(`/users/${uid}`, { method:'DELETE' });
        ['auth_token','firstName','lastName','role','user_id'].forEach(k => localStorage.removeItem(k));
        window.location.href = '/';
      } catch(e) { showAlert(e.message, 'error'); }
    });
  } catch(e) { el.innerHTML = emptyMarkup(e.message); }
}
// ─── ADMIN ORDERS DASHBOARD ───────────────────────────────────────────────────
async function loadAdminOrders() {
  const el = document.getElementById('panel-orders');
  el.innerHTML = loadingMarkup('Loading orders');

  el.innerHTML = `
    <div class="mb-6 grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
      <div class="relative overflow-hidden border border-border bg-surface2 p-5">
        <div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent opacity-60"></div>
        <div class="absolute top-4 right-4 text-xl opacity-15">▣</div>
        <div class="font-bebas text-[2.4rem] text-line-bright leading-none" id="od-total">—</div>
        <div class="text-[0.62rem] tracking-[0.2em] uppercase text-muted mt-1">Total Orders</div>
      </div>
      <div class="relative overflow-hidden border border-border bg-surface2 p-5">
        <div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent opacity-60"></div>
        <div class="absolute top-4 right-4 text-xl opacity-15">$</div>
        <div class="font-bebas text-[2.4rem] text-line-bright leading-none" id="od-revenue">—</div>
        <div class="text-[0.62rem] tracking-[0.2em] uppercase text-muted mt-1">Revenue</div>
      </div>
      <div class="relative overflow-hidden border border-border bg-surface2 p-5">
        <div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-40"></div>
        <div class="absolute top-4 right-4 text-xl opacity-15">✓</div>
        <div class="font-bebas text-[2.4rem] text-emerald-300 leading-none" id="od-completed">—</div>
        <div class="text-[0.62rem] tracking-[0.2em] uppercase text-muted mt-1">Completed</div>
      </div>
      <div class="relative overflow-hidden border border-border bg-surface2 p-5">
        <div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-40"></div>
        <div class="absolute top-4 right-4 text-xl opacity-15">◌</div>
        <div class="font-bebas text-[2.4rem] text-yellow-300 leading-none" id="od-pending">—</div>
        <div class="text-[0.62rem] tracking-[0.2em] uppercase text-muted mt-1">Pending</div>
      </div>
      <div class="relative overflow-hidden border border-border bg-surface2 p-5">
        <div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-40"></div>
        <div class="absolute top-4 right-4 text-xl opacity-15">✕</div>
        <div class="font-bebas text-[2.4rem] text-red-300 leading-none" id="od-cancelled">—</div>
        <div class="text-[0.62rem] tracking-[0.2em] uppercase text-muted mt-1">Cancelled</div>
      </div>
    </div>

    <div class="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="border border-border bg-surface2 p-5">
        <div class="font-bebas text-[0.9rem] tracking-[0.22em] text-line-bright mb-4">Status Distribution</div>
        <div id="od-bar-chart" class="flex flex-col gap-2.5"></div>
      </div>
      <div class="border border-border bg-surface2 p-5">
        <div class="font-bebas text-[0.9rem] tracking-[0.22em] text-line-bright mb-4">Revenue by Status</div>
        <div id="od-rev-chart" class="flex flex-col gap-2.5"></div>
      </div>
    </div>

    <div class="border border-border bg-surface2 p-5 mb-5">
      <div class="font-bebas text-[0.9rem] tracking-[0.22em] text-line-bright mb-4">Search Orders by User</div>
      <div class="flex gap-2.5">
        <input class="${inputClass} max-w-[160px]" id="order-uid" placeholder="User ID">
        <button class="${btnBaseClass} ${btnMdClass}" id="order-search-btn">Search</button>
      </div>
    </div>
    <div id="orders-result"></div>`;

  // wire up search
  document.getElementById('order-search-btn').addEventListener('click', async () => {
    const uid = document.getElementById('order-uid').value.trim();
    if (!uid) return;
    const res = document.getElementById('orders-result');
    res.innerHTML = loadingMarkup('Loading');
    try {
      const orders = await api(`/orders/${uid}`);
      if (!orders.length) { res.innerHTML = emptyMarkup('No orders found'); return; }

      // update stat cards from real data
      const total = orders.length;
      const completed = orders.filter(o => o.status === 'Completed').length;
      const pending   = orders.filter(o => o.status === 'Pending').length;
      const cancelled = orders.filter(o => o.status === 'Cancelled').length;
      const revenue   = orders.reduce((s, o) => s + parseFloat(o.total_amount || 0), 0);

      document.getElementById('od-total').textContent = total;
      document.getElementById('od-completed').textContent = completed;
      document.getElementById('od-pending').textContent = pending;
      document.getElementById('od-cancelled').textContent = cancelled;
      document.getElementById('od-revenue').textContent = `$${revenue.toFixed(0)}`;

      // status bar chart
      const statuses = [
        { label: 'Completed', count: completed, color: 'bg-emerald-400', text: 'text-emerald-300' },
        { label: 'Pending',   count: pending,   color: 'bg-yellow-400',  text: 'text-yellow-300' },
        { label: 'Cancelled', count: cancelled, color: 'bg-red-400',     text: 'text-red-300' },
      ];
      document.getElementById('od-bar-chart').innerHTML = statuses.map(s => `
        <div>
          <div class="flex justify-between mb-1">
            <span class="text-[0.62rem] tracking-[0.15em] uppercase text-muted">${s.label}</span>
            <span class="text-[0.62rem] tracking-[0.12em] ${s.text}">${s.count} · ${total ? ((s.count/total)*100).toFixed(0) : 0}%</span>
          </div>
          <div class="h-[5px] bg-border/30 border border-border/40 overflow-hidden">
            <div class="h-full ${s.color} opacity-70 transition-all duration-700" style="width:${total ? (s.count/total*100).toFixed(1) : 0}%"></div>
          </div>
        </div>`).join('');

      // revenue by status bar chart
      const revByStatus = [
        { label: 'Completed', val: orders.filter(o=>o.status==='Completed').reduce((s,o)=>s+parseFloat(o.total_amount||0),0), color: 'bg-secondary', text: 'text-line-bright' },
        { label: 'Pending',   val: orders.filter(o=>o.status==='Pending').reduce((s,o)=>s+parseFloat(o.total_amount||0),0),   color: 'bg-yellow-400',  text: 'text-yellow-300' },
        { label: 'Cancelled', val: orders.filter(o=>o.status==='Cancelled').reduce((s,o)=>s+parseFloat(o.total_amount||0),0), color: 'bg-red-400',     text: 'text-red-300' },
      ];
      const maxRev = Math.max(...revByStatus.map(r => r.val), 1);
      document.getElementById('od-rev-chart').innerHTML = revByStatus.map(r => `
        <div>
          <div class="flex justify-between mb-1">
            <span class="text-[0.62rem] tracking-[0.15em] uppercase text-muted">${r.label}</span>
            <span class="text-[0.62rem] tracking-[0.12em] ${r.text}">$${r.val.toFixed(0)}</span>
          </div>
          <div class="h-[5px] bg-border/30 border border-border/40 overflow-hidden">
            <div class="h-full ${r.color} opacity-70 transition-all duration-700" style="width:${(r.val/maxRev*100).toFixed(1)}%"></div>
          </div>
        </div>`).join('');

      // orders table
      res.innerHTML = `
        <div class="${tableWrapClass}">
          <table class="${tableClass}">
            <thead>
              <tr>
                <th class="${thClass}">Order ID</th>
                <th class="${thClass}">Total</th>
                <th class="${thClass}">Status</th>
                <th class="${thClass}">Date</th>
                <th class="${thClass}">Update Status</th>
              </tr>
            </thead>
            <tbody>
              ${orders.map(o => `
                <tr>
                  <td class="${tdClass} font-bebas text-[0.9rem] tracking-[0.1em] text-line-bright">#${o.id}</td>
                  <td class="${tdClass} text-emerald-300">$${o.total_amount}</td>
                  <td class="${tdClass}">${statusPill(o.status)}</td>
                  <td class="${tdClass} text-muted">${new Date(o.created_at).toLocaleDateString()}</td>
                  <td class="${tdClass}">
                    <div class="flex items-center gap-2">
                      <select class="${selectSmClass} w-auto" data-order-id="${o.id}">
                        <option ${o.status==='Pending'   ? 'selected' : ''}>Pending</option>
                        <option ${o.status==='Completed' ? 'selected' : ''}>Completed</option>
                        <option ${o.status==='Cancelled' ? 'selected' : ''}>Cancelled</option>
                      </select>
                      <button class="${btnBaseClass} ${btnSmClass}" data-update-order="${o.id}">Set</button>
                    </div>
                  </td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>`;

      res.querySelectorAll('[data-update-order]').forEach(btn => {
        btn.addEventListener('click', async () => {
          const sel = res.querySelector(`select[data-order-id="${btn.dataset.updateOrder}"]`);
          try {
            await api(`/orders/${btn.dataset.updateOrder}/status`, { method: 'PUT', body: JSON.stringify({ status: sel.value }) });
            showAlert('Order status updated');
            document.getElementById('order-search-btn').click();
          } catch(e) { showAlert(e.message, 'error'); }
        });
      });
    } catch(e) { res.innerHTML = emptyMarkup(e.message); }
  });
}


// ─── ADMIN PRODUCTS DASHBOARD ─────────────────────────────────────────────────
async function loadAdminProducts() {
  const el = document.getElementById('panel-products');
  el.innerHTML = loadingMarkup('Materialising');
  try {
    const products = await api('/products');
    const list = products.content || [];
    const totalProducts = products.totalElements ?? list.length;

    // compute analytics
    const avgPrice     = list.length ? list.reduce((s, p) => s + parseFloat(p.price || 0), 0) / list.length : 0;
    const lowStock     = list.filter(p => (p.stockQuantity ?? 0) < 5).length;
    const topClicked   = [...list].sort((a, b) => (b.totalClicks || 0) - (a.totalClicks || 0)).slice(0, 5);
    const topCartAdds  = [...list].sort((a, b) => (b.totalCartAdds || 0) - (a.totalCartAdds || 0)).slice(0, 5);
    const maxClicks    = topClicked[0]?.totalClicks || 1;
    const maxCartAdds  = topCartAdds[0]?.totalCartAdds || 1;

    // category breakdown
    const catCounts = list.reduce((acc, p) => {
      const key = p.categoryId || 'Uncategorised';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const catEntries = Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const maxCat = catEntries[0]?.[1] || 1;

    el.innerHTML = `
      <div class="flex items-center justify-between mb-5">
        <div class="font-bebas text-[1.1rem] tracking-[0.2em] text-line-bright">Products (${totalProducts})</div>
        <button class="${btnBaseClass} ${btnMdClass}" id="newProductBtn">+ New Product</button>
      </div>

      <div class="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4 mb-6">
        <div class="relative overflow-hidden border border-border bg-surface2 p-5">
          <div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent opacity-60"></div>
          <div class="absolute top-4 right-4 text-xl opacity-15">⬡</div>
          <div class="font-bebas text-[2.4rem] text-line-bright leading-none">${totalProducts}</div>
          <div class="text-[0.62rem] tracking-[0.2em] uppercase text-muted mt-1">Total Products</div>
        </div>
        <div class="relative overflow-hidden border border-border bg-surface2 p-5">
          <div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent opacity-60"></div>
          <div class="absolute top-4 right-4 text-xl opacity-15">$</div>
          <div class="font-bebas text-[2.4rem] text-line-bright leading-none">$${avgPrice.toFixed(0)}</div>
          <div class="text-[0.62rem] tracking-[0.2em] uppercase text-muted mt-1">Avg Price</div>
        </div>
        <div class="relative overflow-hidden border border-border bg-surface2 p-5">
          <div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-40"></div>
          <div class="absolute top-4 right-4 text-xl opacity-15">⚠</div>
          <div class="font-bebas text-[2.4rem] ${lowStock > 0 ? 'text-red-300' : 'text-emerald-300'} leading-none">${lowStock}</div>
          <div class="text-[0.62rem] tracking-[0.2em] uppercase text-muted mt-1">Low Stock (&lt;5)</div>
        </div>
        <div class="relative overflow-hidden border border-border bg-surface2 p-5">
          <div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent opacity-60"></div>
          <div class="absolute top-4 right-4 text-xl opacity-15">◈</div>
          <div class="font-bebas text-[2.4rem] text-line-bright leading-none">${catEntries.length}</div>
          <div class="text-[0.62rem] tracking-[0.2em] uppercase text-muted mt-1">Categories</div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div class="border border-border bg-surface2 p-5">
          <div class="font-bebas text-[0.9rem] tracking-[0.22em] text-line-bright mb-4">Top Clicked</div>
          <div class="flex flex-col gap-2.5">
            ${topClicked.map((p, i) => `
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-[0.62rem] tracking-[0.12em] uppercase text-muted truncate max-w-[140px]">${p.name}</span>
                  <span class="text-[0.62rem] text-line-bright ml-2 shrink-0">${p.totalClicks || 0}</span>
                </div>
                <div class="h-[4px] bg-border/30 border border-border/40 overflow-hidden">
                  <div class="h-full bg-secondary opacity-70 transition-all duration-700" style="width:${((p.totalClicks||0)/maxClicks*100).toFixed(1)}%"></div>
                </div>
              </div>`).join('')}
          </div>
        </div>

        <div class="border border-border bg-surface2 p-5">
          <div class="font-bebas text-[0.9rem] tracking-[0.22em] text-line-bright mb-4">Top Cart Adds</div>
          <div class="flex flex-col gap-2.5">
            ${topCartAdds.map((p, i) => `
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-[0.62rem] tracking-[0.12em] uppercase text-muted truncate max-w-[140px]">${p.name}</span>
                  <span class="text-[0.62rem] text-emerald-300 ml-2 shrink-0">${p.totalCartAdds || 0}</span>
                </div>
                <div class="h-[4px] bg-border/30 border border-border/40 overflow-hidden">
                  <div class="h-full bg-emerald-400 opacity-60 transition-all duration-700" style="width:${((p.totalCartAdds||0)/maxCartAdds*100).toFixed(1)}%"></div>
                </div>
              </div>`).join('')}
          </div>
        </div>

        <div class="border border-border bg-surface2 p-5">
          <div class="font-bebas text-[0.9rem] tracking-[0.22em] text-line-bright mb-4">By Category ID</div>
          <div class="flex flex-col gap-2.5">
            ${catEntries.map(([cat, count]) => `
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-[0.62rem] tracking-[0.12em] uppercase text-muted">Cat #${cat}</span>
                  <span class="text-[0.62rem] text-line-bright">${count}</span>
                </div>
                <div class="h-[4px] bg-border/30 border border-border/40 overflow-hidden">
                  <div class="h-full bg-violet-400 opacity-60 transition-all duration-700" style="width:${(count/maxCat*100).toFixed(1)}%"></div>
                </div>
              </div>`).join('')}
          </div>
        </div>
      </div>

      ${lowStock > 0 ? `
        <div class="border border-red-400/30 bg-red-500/5 px-4 py-3 mb-5 flex items-center gap-3">
          <span class="text-red-300 text-[0.9rem]">⚠</span>
          <span class="text-[0.68rem] tracking-[0.15em] uppercase text-red-300">
            ${lowStock} product${lowStock > 1 ? 's' : ''} with low stock — review inventory below
          </span>
        </div>` : ''}

      <div class="${tableWrapClass}">
        <table class="${tableClass}">
          <thead>
            <tr>
              <th class="${thClass}">ID</th>
              <th class="${thClass}">Name</th>
              <th class="${thClass}">Cat</th>
              <th class="${thClass}">Price</th>
              <th class="${thClass}">Stock</th>
              <th class="${thClass}">Rating</th>
              <th class="${thClass}">Clicks</th>
              <th class="${thClass}">Cart Adds</th>
              <th class="${thClass}">Pop. Score</th>
              <th class="${thClass}">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(p => {
              const stockClass = (p.stockQuantity ?? 0) < 5
                ? 'text-red-300 font-semibold'
                : (p.stockQuantity ?? 0) < 15 ? 'text-yellow-300' : 'text-emerald-300';
              return `
              <tr>
                <td class="${tdClass} font-bebas text-[0.85rem] tracking-[0.1em] text-line-bright">#${p.id}</td>
                <td class="${tdClass}">${p.name}</td>
                <td class="${tdClass} text-muted">#${p.categoryId}</td>
                <td class="${tdClass} text-line-bright">$${p.price}</td>
                <td class="${tdClass} ${stockClass}">${p.stockQuantity ?? '—'}</td>
                <td class="${tdClass}">
                  <span class="text-secondary text-[0.72rem]">${stars(p.avgRating)}</span>
                  <span class="text-muted text-[0.65rem] ml-1">${(p.avgRating||0).toFixed(1)}</span>
                </td>
                <td class="${tdClass}">${p.totalClicks ?? 0}</td>
                <td class="${tdClass}">${p.totalCartAdds ?? 0}</td>
                <td class="${tdClass}">
                  <span class="font-bebas text-[0.9rem] text-secondary">${(p.popularityScore||0).toFixed(1)}</span>
                </td>
                <td class="${tdClass}">
                  <div class="flex gap-1.5">
                    <button class="${btnBaseClass} ${btnSmClass}" data-edit-product="${p.id}" data-product='${JSON.stringify(p)}'>Edit</button>
                    <button class="${btnBaseClass} ${btnSmClass} ${btnDangerClass}" data-del-product="${p.id}">Del</button>
                  </div>
                </td>
              </tr>`}).join('')}
          </tbody>
        </table>
      </div>`;

    document.getElementById('newProductBtn').addEventListener('click', () => openProductModal(null));
    el.querySelectorAll('[data-edit-product]').forEach(btn => {
      btn.addEventListener('click', () => openProductModal(JSON.parse(btn.dataset.product)));
    });
    el.querySelectorAll('[data-del-product]').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Delete product?')) return;
        try { await api(`/products/${btn.dataset.delProduct}`, { method: 'DELETE' }); showAlert('Product deleted'); loadAdminProducts(); }
        catch(e) { showAlert(e.message, 'error'); }
      });
    });
  } catch(e) { el.innerHTML = emptyMarkup(e.message); }
}