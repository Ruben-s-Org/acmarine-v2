import type { RouterConfig } from '@nuxt/schema'

// Smooth scroll for hash links across route changes, top-on-nav otherwise.
// Honours user's reduced-motion preference.
export default <RouterConfig>{
  scrollBehavior(to, _from, savedPosition) {
    const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const behavior: ScrollBehavior = reduce ? 'auto' : 'smooth'
    if (savedPosition) return savedPosition
    if (to.hash) {
      return { el: to.hash, top: 72, behavior }
    }
    return { left: 0, top: 0, behavior: 'auto' }
  },
}
