import './style.css'
import {
  NAV_LINKS, MARQUEE_ITEMS, FEATURES,
  PRODUCTS, STATS, TESTIMONIALS, FOOTER_LINKS
} from './data.js'
import {
  Nav, Marquee, FeatureCard, ProductCard,
  StatCard, TestimonialFeatured, TestimonialCard,
  Footer, GlowLine
} from './components.js'
import { Login } from './login.js'
// ─── GLOBAL LAYOUT (rendered once, never changes) ─────────
document.getElementById('nav-slot').innerHTML    = Nav(NAV_LINKS)
document.getElementById('loginBtn').addEventListener('click', Login)
document.getElementById('footer-slot').innerHTML = Footer(FOOTER_LINKS)

// ─── PAGE CONTENT (goes into #app) ────────────────────────
const [featured, ...rest] = TESTIMONIALS

document.getElementById('app').innerHTML = `

  <!-- HERO -->
  <section class="hero min-h-screen flex flex-col items-center justify-center text-center px-6 relative z-10 pt-20">
    <p class="font-space text-[0.7rem] tracking-[0.3em] uppercase text-secondary mb-8 hero-anim-1">
      — Frequency 001 · Drop Season IV —
    </p>
    <h1 class="hero-title font-bebas text-[clamp(4rem,14vw,12rem)] mb-4 hero-anim-2">
      <span class="glow-word">THE</span><br>FIELD
    </h1>
    <p class="text-[0.85rem] font-light tracking-[0.25em] uppercase text-muted mb-12 max-w-[500px] leading-relaxed hero-anim-3">
      Objects channeled from the space between thought and form.<br>For those who feel the frequency.
    </p>
    <div class="flex gap-5 hero-anim-4">
      <a href="#products" class="relative overflow-hidden px-10 py-4 border border-secondary bg-secondary/10 text-line-bright text-[0.72rem] font-semibold tracking-[0.2em] uppercase rounded-sm transition-all hover:shadow-[0_0_30px_rgba(155,89,247,0.3)] hover:text-white">
        Enter the Field →
      </a>
      <a href="#about" class="px-9 py-4 border border-secondary/20 text-muted text-[0.72rem] font-semibold tracking-[0.2em] uppercase rounded-sm transition-all hover:text-lavender hover:border-secondary/40">
        Our Ritual
      </a>
    </div>
    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 font-space text-[0.6rem] tracking-widest text-muted uppercase hero-anim-5">
      <div class="scroll-line-anim w-[1px] h-12 bg-gradient-to-b from-secondary to-transparent"></div>
      <span>scroll</span>
    </div>
  </section>

  <!-- MARQUEE -->
  ${Marquee(MARQUEE_ITEMS)}

  <!-- FEATURES -->
  <div class="reveal max-w-[90%] mx-auto mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-border relative z-10">
    ${FEATURES.map((f, i) => FeatureCard(f, i === FEATURES.length - 1)).join('')}
  </div>
  <hr>
  <!-- PRODUCTS -->
  <section id="products" class="px-6 lg:px-20 py-28 relative z-10 bg-linear-to-t from-main to-test-color">
    <div class="reveal flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
      <div>
        <div class="flex items-center gap-4 font-space text-[0.62rem] tracking-[0.3em] uppercase text-secondary mb-3">
          <span class="w-8 h-[1px] bg-gradient-to-r from-transparent to-secondary"></span> Current Transmission
        </div>
        <h2 class="font-bebas text-5xl lg:text-7xl tracking-wider leading-none">
          OBJECTS <span class="text-line-bright drop-shadow-[0_0_30px_rgba(155,89,247,0.4)]">FROM</span><br>THE FIELD
        </h2>
      </div>
      <div id = "categories" class="flex gap-2">
        <button class="ftab px-4 py-1.5 border border-secondary text-[0.7rem] uppercase tracking-widest text-line-bright bg-secondary/10" data-filter="all">All</button>
        <button class="ftab px-4 py-1.5 border border-border text-[0.7rem] uppercase tracking-widest text-muted" data-filter="ritual">Ritual</button>
        <button class="ftab px-4 py-1.5 border border-border text-[0.7rem] uppercase tracking-widest text-muted" data-filter="form">Form</button>
        <button class="ftab px-4 py-1.5 border border-border text-[0.7rem] uppercase tracking-widest text-muted" data-filter="signal">Signal</button>
      </div>
    </div>

  </section>

  ${GlowLine()}

  <!-- STATS -->
  <div class="reveal max-w-[90%] mx-auto my-20 grid grid-cols-2 lg:grid-cols-4 border border-border relative z-10">
    ${STATS.map((s, i) => StatCard(s, i === STATS.length - 1)).join('')}
  </div>

  <!-- TESTIMONIALS -->
  <section class="bg-test-color px-6 lg:px-20 py-28 relative z-10" id="testi">
    <div class="reveal mb-12">
      <div class="font-space text-[0.62rem] tracking-[0.3em] uppercase text-secondary mb-3">Transmissions Received</div>
      <h2 class="font-bebas text-5xl lg:text-7xl tracking-wider">
        VOICES FROM <span class="text-line-bright drop-shadow-[0_0_30px_rgba(155,89,247,0.4)]">THE</span><br>OTHER SIDE
      </h2>
    </div>
    <div class="testi-grid reveal grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] border border-border overflow-hidden">
      ${TestimonialFeatured(featured)}
      <div class="testi-stack flex flex-col gap-[1px] bg-border">
        ${rest.map(t => TestimonialCard(t)).join('')}
      </div>
    </div>
  </section>

  <!-- NEWSLETTER -->
  <section class="text-center px-6 py-32 relative z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(155,89,247,0.1)_0%,transparent_60%)]" id="newsletter">
    <p class="font-space text-[0.7rem] tracking-[0.3em] uppercase text-secondary mb-6">— Open Your Channel —</p>
    <h2 class="font-bebas text-5xl lg:text-7xl tracking-[0.08em] mb-4">
      TUNE INTO <span class="text-line-bright drop-shadow-[0_0_30px_rgba(155,89,247,0.4)]">THE</span><br>FREQUENCY
    </h2>
    <p class="text-[0.78rem] font-light tracking-widest text-muted mb-10">First access to drops · Transmissions from the studio · Objects before the field opens</p>
    <div class="flex max-w-[500px] mx-auto border border-border">
      <input type="email" placeholder="your signal address"
             class="flex-1 bg-transparent px-6 py-4 outline-none font-josefin text-sm tracking-widest text-white placeholder:text-muted"/>
      <button class="px-8 py-4 bg-secondary/15 border-l border-border font-semibold text-[0.72rem] uppercase tracking-[0.2em] text-line-bright hover:bg-secondary/25 transition-all">Tune In →</button>
    </div>
  </section>

  ${GlowLine()}
`

// ─── FILTER TABS ──────────────────────────────────────────
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

// ─── CURSOR ───────────────────────────────────────────────
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

// ─── STARS ────────────────────────────────────────────────
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

// ─── SCROLL REVEAL ────────────────────────────────────────
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis') })
}, { threshold: 0.1 })
document.querySelectorAll('.reveal').forEach(el => obs.observe(el))