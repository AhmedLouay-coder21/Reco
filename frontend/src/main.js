import './style.css'
import {
  NAV_LINKS, FOOTER_LINKS, PRODUCTS
} from './data/data.js'
import {
  Nav, Footer, ProductCard
} from './components/components.js'
import { Login } from './pages/login.js'
import { HomeView } from './pages/home.js'
import { isAuthenticated, getUserFirstName } from './api/auth.js'

export function GenerateMain()
{
document.getElementById('nav-slot').innerHTML = Nav(NAV_LINKS)
document.getElementById('footer-slot').innerHTML = Footer(FOOTER_LINKS)
  
  const loginBtn = document.getElementById('loginBtn');
  
  // if the user is logged in then remove the login button and put profile button
  if (loginBtn && isAuthenticated()) 
  {
      loginBtn.className = "cart-btn group flex items-center justify-center w-12 h-12 rounded-full border border-line-bright text-line-bright transition-all hover:bg-secondary/10 hover:shadow-[0_0_20px_var(--color-pulse-glow1)]";
      loginBtn.textContent = getUserFirstName()[0].toUpperCase();
      
      loginBtn.addEventListener("click", () => {
          alert("Profile clicked");
      });
  }

  else if (loginBtn)
  {
      
      loginBtn.addEventListener('click', Login);
  }

document.getElementById('app').innerHTML = HomeView()


// filter tabs
const productsGrid = document.getElementById('products-grid')

document.querySelectorAll('.ftab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.ftab').forEach(b => {
      b.classList.remove('border-secondary', 'text-line-bright', 'bg-secondary/10')
      b.classList.add('border-border', 'text-muted')
    })
    btn.classList.add('border-secondary', 'text-line-bright', 'bg-secondary/10')
    btn.classList.remove('border-border', 'text-muted')

    const filter   = btn.dataset.filter
    const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.tag === filter)
    productsGrid.innerHTML = filtered.map(p => ProductCard(p)).join('')
    productsGrid.querySelectorAll('.group').forEach(el => obs.observe(el))
  })
})

// scroll reveal
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis') })
}, { threshold: 0.1 })
document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
}
// special cursor
const cur  = document.getElementById('cursor')
const ring = document.getElementById('cursor-ring')
let mx = 0, my = 0, rx = 0, ry = 0, lastTime = performance.now()

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY
  cur.style.transform = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`
}, { passive: true })

;(function animRing(now) {
  const dt    = Math.min((now - lastTime) / 16.67, 3)
  lastTime    = now
  const speed = 1 - Math.pow(0.12, dt)
  rx += (mx - rx) * speed
  ry += (my - ry) * speed
  ring.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`
  requestAnimationFrame(animRing)
})(performance.now())

document.addEventListener('mouseover', e => {
  if (e.target.closest('button, a, .ftab')) {
    ring.style.width = '60px'; ring.style.height = '60px'
  }
})
document.addEventListener('mouseout', e => {
  if (e.target.closest('button, a, .ftab')) {
    ring.style.width = '36px'; ring.style.height = '36px'
  }
})

// star generation
const starsEl = document.getElementById('stars')
const frag    = document.createDocumentFragment()
for (let i = 0; i < 40; i++) {
  const s    = document.createElement('div')
  s.className = 'star'
  const size  = Math.random() * 2 + 0.5
  s.style.cssText = `width:${size}px;height:${size}px;top:${Math.random()*100}%;left:${Math.random()*100}%;--d:${2+Math.random()*5}s;--dl:${Math.random()*4}s;--op:${0.1+Math.random()*0.5}`
  frag.appendChild(s)
}
starsEl.appendChild(frag)
GenerateMain();