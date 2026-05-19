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
        { rel: 'alternate', type: 'text/markdown', href: '/llms-full.txt', title: 'llms-full' },
        { rel: 'alternate', type: 'text/plain', href: '/llms.txt', title: 'llms.txt' },
        { rel: 'describedby', type: 'application/json', href: '/.well-known/agent-card.json' },
        { rel: 'api-catalog', href: '/.well-known/api-catalog' },
        { rel: 'service-desc', type: 'application/vnd.oai.openapi+json', href: '/.well-known/openapi.json' },
      ],
      script: [
        {
          // WebMCP tool registration. Runs on every page load and registers
          // four read tools (articles + listings) plus the inquiry submit
          // tool with navigator.modelContext. A small polyfill installs the
          // registry on browsers that don't ship WebMCP natively so the
          // tools are visible to scanners.
          innerHTML: "(function(){if(typeof navigator==='undefined')return;if(!navigator.modelContext){var t=[];Object.defineProperty(navigator,'modelContext',{value:{registerTool:function(x){t.push(x)},unregisterTool:function(n){var i=t.findIndex(function(x){return x.name===n});if(i>=0)t.splice(i,1)},getTools:function(){return t.slice()},tools:t},configurable:true})}try{var BASE='https://acmarine.co';function reg(d,fn){try{navigator.modelContext.registerTool(Object.assign({},d,{execute:fn}))}catch(e){}}reg({name:'list_articles',description:'List published articles and guides on buying, selling, managing, detailing, and crewing yachts at Aldridge & Charles Marine.',inputSchema:{type:'object',properties:{}}},async function(){var r=await fetch(BASE+'/api/articles');var j=await r.json();return(j.articles||[]).map(function(a){return{slug:a.slug,title:a.title,description:a.description,category:a.category,url:BASE+'/articles/'+a.slug}})});reg({name:'get_article',description:'Fetch a single Aldridge & Charles Marine article by slug.',inputSchema:{type:'object',required:['slug'],properties:{slug:{type:'string'}}}},async function(p){var r=await fetch(BASE+'/api/articles/'+encodeURIComponent(p.slug));return await r.json()});reg({name:'list_yachts_for_sale',description:'List yachts currently for sale by Aldridge & Charles Marine across South Florida and the Caribbean.',inputSchema:{type:'object',properties:{}}},async function(){var r=await fetch(BASE+'/api/listings');return await r.json()});reg({name:'submit_inquiry',description:'Submit an inquiry to Aldridge & Charles Marine. We reply personally.',inputSchema:{type:'object',required:['name','message'],properties:{name:{type:'string'},email:{type:'string',format:'email'},phone:{type:'string'},message:{type:'string'},service:{type:'string'},listing_slug:{type:'string'},listing_name:{type:'string'}}}},async function(p){var r=await fetch(BASE+'/api/inquire',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(p)});return await r.json()})}catch(e){}})();",
          type: 'text/javascript',
          tagPosition: 'head',
        },
      ],
    },
  },

  nitro: {
    preset: 'cloudflare_module',
    routeRules: {
      // Agent-readiness: serve llms-full.txt as markdown, llms.txt as plain.
      // Add Link headers + cacheable for one hour.
      '/llms.txt': {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
          'Link': '<https://acmarine.co/sitemap.xml>; rel="sitemap", <https://acmarine.co/.well-known/agent.json>; rel="describedby"',
        },
      },
      '/llms-full.txt': {
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      },
      '/.well-known/agent.json': {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*',
        },
      },
      '/.well-known/agent-card.json': {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*',
        },
      },
      '/.well-known/agent-skills/**': {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*',
        },
      },
      '/.well-known/mcp/**': {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*',
        },
      },
      '/.well-known/oauth-authorization-server': {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*',
        },
      },
      '/.well-known/oauth-protected-resource': {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*',
        },
      },
      '/robots.txt': {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      },
      '/sitemap.xml': {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      },
    },
  },
})
