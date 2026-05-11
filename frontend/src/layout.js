// layout.js
import { Nav, Footer, GlowLine } from './components/components.js'
import { NAV_LINKS, FOOTER_LINKS } from './data/data.js'

export function renderLayout() {
  document.getElementById('nav-slot').innerHTML = Nav(NAV_LINKS)
  document.getElementById('footer-slot').innerHTML = Footer(FOOTER_LINKS)
}