// Aldridge & Charles Marine — Nuxt 4 + shadcn-vue + Tailwind
// Deploys to Cloudflare Pages. R2 + KV bindings live in wrangler.toml.

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,

  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@nuxtjs/google-fonts',
  ],

  shadcn: {
    prefix: '',
    componentDir: './app/components/ui',
  },

  googleFonts: {
    families: {
      'Cormorant+Garamond': [400, 500, '400i'],
      Inter: [300, 400, 500],
    },
    display: 'swap',
    preconnect: true,
    download: false,
  },

  css: ['~~/assets/css/main.css'],
  tailwindcss: {
    cssPath: '~~/assets/css/main.css',
    configPath: '~~/tailwind.config.ts',
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'UTF-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' },
        { name: 'theme-color', content: '#0a1e3a' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/img/favicon.png' },
        { rel: 'apple-touch-icon', href: '/img/favicon.png' },
      ],
    },
  },

  nitro: {
    preset: 'cloudflare-pages',
  },
})
