import {
  MARQUEE_ITEMS, FEATURES,
  STATS, TESTIMONIALS
} from '../data/data.js'
import {
  Marquee, FeatureCard,
  StatCard, TestimonialFeatured, TestimonialCard,
  GlowLine
} from '../components/components.js'

export function HomeView() {
  const [featured, ...rest] = TESTIMONIALS

  return `
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
        <a href="#about" class="px-9 py-4 border border-secondary/20 text-[0.72rem] font-semibold tracking-[0.2em] uppercase rounded-sm transition-all hover:text-lavender hover:border-secondary/40 text-muted">
          Our Ritual
        </a>
      </div>
      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 font-space text-[0.6rem] tracking-widest uppercase hero-anim-5 text-muted">
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
        <div id="categories" class="flex gap-2">
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
  `
}