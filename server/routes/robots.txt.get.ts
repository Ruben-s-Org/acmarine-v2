// Serve our custom robots.txt via Nitro so it takes precedence over both the
// static public/robots.txt AND Cloudflare's managed robots.txt transform. Sets
// Content-Signal directives (Cloudflare spec) and explicitly allows the major
// AI / search crawlers. Sitemap referenced at the bottom per the RFC.

const BODY = `# Aldridge & Charles Marine
#
# We welcome crawling and AI agent access for indexing, retrieval-augmented
# generation, and search. AI model training is restricted, per the
# Content-Signal directives below.

# Cloudflare Content Signals (matches the managed zone-level directive)
# search:   yes — building a search index and providing search results
# ai-input: yes — inputting content into AI models for grounding or RAG
# ai-train: no  — training or fine-tuning AI models (reserved)

User-agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=no
Allow: /

# Explicit allows for major AI / search crawlers (read, retrieve, summarize OK)
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Applebot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: meta-externalagent
Allow: /

Sitemap: https://acmarine.co/sitemap.xml
`

export default defineEventHandler((event) => {
  setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600')
  return BODY
})
