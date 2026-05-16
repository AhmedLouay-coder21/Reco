// this file should contain data only
export const NAV_LINKS = [
  { href: '#products', label: 'Objects' },
  { href: '#about',    label: 'Ritual'  },
  { href: '#testi',    label: 'Voices'  },
  { href: '#newsletter', label: 'Channel' },
]

export const MARQUEE_ITEMS = [
  'Free transmission over $200',
  'New frequency drops weekly',
  'Handcrafted in the main',
  '12,000+ channels open',
  'Limited objects · No restock',
]

export const FEATURES = [
  { icon: '◈', title: 'Materialised Thought',  desc: 'Every object begins as a frequency. We make it physical.' },
  { icon: '⬡', title: 'Ritual Packaging',       desc: 'Wrapped in blackout paper, sealed with violet wax.'      },
  { icon: '◉', title: 'Limited Transmissions',  desc: 'Each drop is closed once the field is cleared.'          },
  { icon: '◆', title: 'Open Channel Returns',   desc: '30 days. No signal lost. No questions.'                  },
]

export const PRODUCTS = [
  {
    shape:    'ps-cube',
    shapeClass: 'w-24 h-24 bg-gradient-to-br from-line-bright to-violet rounded-lg shadow-[0_0_40px_--color-pulse-glow1]',
    bg:       'radial-gradient(circle at 30% 70%, var(--color-line-dim) 0%, var(--color-product-card-bg) 60%)',
    badge:    '↑ New Drop',
    wishlist: true,
    category: 'Ritual Object',
    categoryIcon: '◈',
    name:     'Sphere of Silent Resonance',
    price:    '$389',
    original: '$490',
    tag:      'ritual',
  },
  {
    shape:    'ps-cube',
    shapeClass: 'w-24 h-24 bg-gradient-to-br from-line-bright to-violet rounded-lg shadow-[0_0_40px_--color-pulse-glow1]',
    bg:       'radial-gradient(circle at 70% 30%, var(--color-line-dim) 0%, var(--color-product-card-bg) 60%)',
    badge:    '⬡ Limited',
    category: 'Form Object',
    categoryIcon: '◉',
    name:     'Monolith I Obsidian Resin',
    price:    '$540',
    tag:      'form',
  },
  {
    shape:    'ps-ring',
    shapeClass: 'w-28 h-28 border-[8px] border-line-bright rounded-full shadow-[0_0_30px_--color-pulse-glow1,inset_0_0_20px_rgba(155,89,247,0.1)]',
    bg:       'radial-gradient(circle at 50% 50%, var(--color-line-dim) 0%, var(--color-product-card-bg) 60%)',
    badge:    '◆ Signal',
    category: 'Signal Object',
    categoryIcon: '◆',
    name:     'Portal Ring main Cast',
    price:    '$225',
    original: '$290',
    tag:      'signal',
  },
  {
    shape:    'ps-diamond',
    shapeClass: 'w-20 h-20 bg-gradient-to-br from-lavender to-secondary [clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)] shadow-[0_0_40px_--color-pulse-glow1]',
    bg:       'radial-gradient(circle at 20% 80%, var(--color-line-dim) 0%, var(--color-product-card-bg) 60%)',
    category: 'Ritual Object',
    categoryIcon: '◈',
    name:     'Frequency Stone Series II',
    price:    '$178',
    tag:      'ritual',
  },
  {
    shape:    'ps-tri',
    shapeClass: 'relative w-0 h-0 border-l-[55px] border-r-[55px] border-b-[100px] border-b-transparent after:content-[\'\'] after:absolute after:top-[10px] after:left-[-45px] after:w-0 after:h-0 after:border-l-[45px] after:border-r-[45px] after:border-b-[80px] after:border-b-line-bright',
    bg:       'radial-gradient(circle at 80% 20%, var(--color-line-dim) 0%, var(--color-product-card-bg) 60%)',
    badge:    '↑ Bestseller',
    category: 'Signal Object',
    categoryIcon: '◆',
    name:     'Apex Channeller Raw Violet',
    price:    '$310',
    original: '$380',
    tag:      'signal',
  },
  {
    shape:    'ps-hex',
    shapeClass: 'w-28 h-28 bg-gradient-to-br from-secondary to-line-dim [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)] shadow-[0_0_40px_--color-pulse-glow1]',
    bg:       'radial-gradient(circle at 60% 60%, var(--color-line-dim) 0%, var(--color-product-card-bg) 60%)',
    badge:    '⬡ Archive',
    category: 'Form Object',
    categoryIcon: '◉',
    name:     'Hexfield Dark Matter',
    price:    '$460',
    tag:      'form',
  },
]

export const STATS = [
  { value: '12K+', label: 'Channels Open'       },
  { value: '840',  label: 'Objects Transmitted'  },
  { value: '99%',  label: 'Signal Clarity'       },
  { value: '04',   label: 'Active Seasons'       },
]

export const TESTIMONIALS = [
  {
    featured: true,
    quote: "I placed it on my desk and something shifted. Not metaphorically. The room changed. The light changed. I don't know how to explain it except that The Field made it real.",
    initials: 'SR',
    name: 'Selin Ramirez',
    role: 'Artist & Collector · Istanbul',
  },
  {
    quote: 'The Sphere of Silent Resonance arrived in a box so beautiful I hesitated to open it. Then I did. Nothing has been the same since.',
    initials: 'KP',
    name: 'Kai Petrov',
    role: 'Designer · Berlin',
  },
  {
    quote: "I've bought design objects my entire life. This is the first time I felt like one was made specifically for me.",
    initials: 'NA',
    name: 'Nora Allawi',
    role: 'Architect · Cairo',
  },
  {
    quote: 'Monolith I sits on my studio shelf and every client asks about it. Some things can only be experienced.',
    initials: 'TZ',
    name: 'Tariq Zaman',
    role: 'Photographer · Dubai',
  },
]

export const FOOTER_LINKS = {
  Objects: ['New Transmission', 'Ritual Objects', 'Form Objects', 'Signal Objects'],
  Studio:  ['Our Ritual', 'The Process', 'Makers', 'Contact'],
  Channel: ['Shipping', 'Returns', 'Signal Policy', 'FAQ'],
}