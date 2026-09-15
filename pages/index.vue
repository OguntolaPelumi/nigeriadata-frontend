<template>
  <div class="landing">

    <!-- Nav -->
    <nav class="nav">
      <div class="nav-inner">
        <div class="nav-logo">
          <div class="nav-logo-mark">
            <Icon name="ph:database-fill" style="font-size:0.875rem;color:white" />
          </div>
          <span class="nav-logo-text">Nigeria<span class="nav-logo-accent">Data</span></span>
        </div>
        <div class="nav-links">
          <a href="#features" class="nav-link">Features</a>
          <a href="#pricing" class="nav-link">Pricing</a>
          <NuxtLink to="/login" class="nav-link">Sign In</NuxtLink>
          <NuxtLink to="/register" class="btn btn-primary btn-sm">Get Started Free</NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-badge">
          <span class="hero-badge-dot" />
          Built for Nigerian Businesses 🇳🇬
        </div>
        <h1 class="hero-title">
          Nigerian Business<br />Intelligence Platform
        </h1>
        <p class="hero-sub">
          Access verified B2B leads, competitor intelligence, and market reports
          for Nigerian businesses updated weekly, exportable instantly.
        </p>
        <div class="hero-actions">
          <NuxtLink to="/register" class="btn btn-primary btn-lg">
            Start Free — No Credit Card
          </NuxtLink>
          <NuxtLink to="/login" class="btn btn-secondary btn-lg">Sign In →</NuxtLink>
        </div>
        <div class="hero-stats">
          <div v-for="stat in stats" :key="stat.label" class="hero-stat">
            <span class="hero-stat-val">{{ stat.val }}</span>
            <span class="hero-stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="section section-alt">
      <div class="section-inner">
        <div class="section-header">
          <p class="section-eyebrow">Features</p>
          <h2 class="section-title">Everything your business needs</h2>
          <p class="section-sub">Four powerful tools in one platform</p>
        </div>
        <div class="features-grid">
          <div v-for="f in features" :key="f.title" class="feature-card">
            <div class="feature-icon">
              <Icon :name="f.icon" style="font-size:1.25rem" />
            </div>
            <h3 class="feature-title">{{ f.title }}</h3>
            <p class="feature-desc">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section id="pricing" class="section">
      <div class="section-inner">
        <div class="section-header">
          <p class="section-eyebrow">Pricing</p>
          <h2 class="section-title">Simple, transparent pricing</h2>
          <p class="section-sub">Start free. Upgrade when you are ready.</p>
        </div>
        <div class="pricing-grid">
          <div v-for="plan in plans" :key="plan.name"
            class="pricing-card"
            :class="plan.featured ? 'pricing-card-featured' : ''">
            <div v-if="plan.featured" class="pricing-popular">Most Popular</div>
            <p class="pricing-name">{{ plan.name }}</p>
            <div class="pricing-price">
              <span class="pricing-amount">{{ plan.price }}</span>
              <span class="pricing-period">{{ plan.period }}</span>
            </div>
            <p class="pricing-desc">{{ plan.desc }}</p>
            <ul class="pricing-features">
              <li v-for="f in plan.features" :key="f">
                <Icon name="ph:check-circle-fill" style="color:#057a55;font-size:0.875rem;flex-shrink:0" />
                <span>{{ f }}</span>
              </li>
            </ul>
            <NuxtLink to="/register"
              class="btn btn-lg"
              :class="plan.featured ? 'btn-primary' : 'btn-outline'"
              style="width:100%;justify-content:center;margin-top:1.5rem">
              {{ plan.cta }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="cta-inner">
        <h2 class="cta-title">Ready to find your next Nigerian client?</h2>
        <p class="cta-sub">Join businesses already using NigeriaData to grow smarter.</p>
        <NuxtLink to="/register" class="btn btn-primary btn-lg">
          Get Started Free Today
        </NuxtLink>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <div class="nav-logo-mark" style="width:24px;height:24px">
            <Icon name="ph:database-fill" style="font-size:0.75rem;color:white" />
          </div>
          <span style="font-weight:700;color:var(--gray-700)">
            Nigeria<span style="color:var(--primary)">Data</span>
          </span>
          <span class="footer-credit">by NewHeaven IT Solutions</span>
        </div>
        <div class="footer-links">
          <a href="https://newheavenitsolutions.com" target="_blank">NewHeaven IT Solutions</a>
          <NuxtLink to="/login">Sign In</NuxtLink>
          <NuxtLink to="/register">Register</NuxtLink>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'guest' })

const stats = [
  { val: '10,000+', label: 'Verified Businesses' },
  { val: '36', label: 'Nigerian States' },
  { val: '20+', label: 'Industries' },
  { val: 'Weekly', label: 'Data Updates' },
]

const features = [
  { icon: 'ph:buildings-fill', title: 'B2B Lead Database', desc: 'Thousands of verified Nigerian businesses filtered by industry, state, and city. Export to CSV instantly.' },
  { icon: 'ph:magnifying-glass-fill', title: 'Competitor Intelligence', desc: 'Track competitor pricing and monitor market movements across industries in real time.' },
  { icon: 'ph:chart-bar-fill', title: 'Market Reports', desc: 'Weekly intelligence reports on Nigerian market trends, industry analysis, and growth opportunities.' },
  { icon: 'ph:export-fill', title: 'Instant Export', desc: 'Download filtered leads as CSV or Excel with one click. Ready for your CRM immediately.' },
]

const plans = [
  { name: 'Free', price: '₦0', period: '/month', desc: 'Get started with limited access', featured: false, cta: 'Start Free', features: ['20 lead previews/month', 'Basic search and filter', 'No export', 'Community support'] },
  { name: 'Basic', price: '₦15,000', period: '/month', desc: 'For growing businesses', featured: false, cta: 'Get Basic', features: ['500 full leads/month', 'CSV export', '1 industry filter', 'Email support'] },
  { name: 'Pro', price: '₦35,000', period: '/month', desc: 'For serious lead generation', featured: true, cta: 'Get Pro', features: ['2,000 leads/month', 'Excel + CSV export', 'All industries', 'Competitor tracking', 'Market reports', 'Priority support'] },
  { name: 'Enterprise', price: '₦80,000', period: '/month', desc: 'For agencies and large teams', featured: false, cta: 'Get Enterprise', features: ['Unlimited leads', 'API access', 'Weekly reports', 'All Pro features', 'Dedicated support'] },
]
</script>

<style scoped>
.landing { background: white; color: var(--text); font-family: var(--font); }

/* Nav */
.nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(255,255,255,0.95); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); }
.nav-inner { max-width: 1200px; margin: 0 auto; padding: 0.875rem 2rem; display: flex; align-items: center; justify-content: space-between; }
.nav-logo { display: flex; align-items: center; gap: 0.5rem; }
.nav-logo-mark { width: 28px; height: 28px; border-radius: var(--radius); background: var(--primary); display: flex; align-items: center; justify-content: center; }
.nav-logo-text { font-size: 1.05rem; font-weight: 800; color: var(--gray-900); }
.nav-logo-accent { color: var(--primary); }
.nav-links { display: flex; align-items: center; gap: 0.25rem; }
.nav-link { padding: 0.5rem 0.875rem; color: var(--gray-600); text-decoration: none; font-size: 0.875rem; font-weight: 500; border-radius: var(--radius); transition: all 0.15s; }
.nav-link:hover { background: var(--gray-100); color: var(--gray-900); }

/* Hero */
.hero { padding: 8rem 2rem 5rem; text-align: center; background: linear-gradient(180deg, #f8faff 0%, white 100%); border-bottom: 1px solid var(--border); }
.hero-inner { max-width: 720px; margin: 0 auto; }
.hero-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: var(--primary-light); border: 1px solid var(--primary-border); color: var(--primary); padding: 0.375rem 0.875rem; border-radius: 999px; font-size: 0.8rem; font-weight: 600; margin-bottom: 1.5rem; }
.hero-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--primary); animation: pulse-dot 2s ease infinite; }
@keyframes pulse-dot { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
.hero-title { font-size: clamp(2.25rem, 5vw, 3.75rem); font-weight: 800; color: var(--gray-900); line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 1.25rem; }
.hero-sub { font-size: 1.1rem; color: var(--text-secondary); max-width: 540px; margin: 0 auto 2.5rem; line-height: 1.7; }
.hero-actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; margin-bottom: 3rem; }
.hero-stats { display: flex; justify-content: center; gap: 3rem; flex-wrap: wrap; padding-top: 2.5rem; border-top: 1px solid var(--border); }
.hero-stat { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; }
.hero-stat-val { font-size: 1.5rem; font-weight: 800; color: var(--primary); }
.hero-stat-label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }

/* Sections */
.section { padding: 5rem 2rem; }
.section-alt { background: var(--gray-50); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.section-inner { max-width: 1100px; margin: 0 auto; }
.section-header { text-align: center; margin-bottom: 3rem; }
.section-eyebrow { font-size: 0.8rem; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem; }
.section-title { font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 800; color: var(--gray-900); margin-bottom: 0.75rem; letter-spacing: -0.01em; }
.section-sub { color: var(--text-secondary); font-size: 1rem; }

/* Features */
.features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1.25rem; }
.feature-card { background: white; border: 1px solid var(--border); border-radius: var(--radius-xl); padding: 1.75rem; transition: all 0.2s; }
.feature-card:hover { box-shadow: var(--shadow-md); border-color: var(--primary-border); transform: translateY(-2px); }
.feature-icon { width: 44px; height: 44px; background: var(--primary-light); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: var(--primary); margin-bottom: 1rem; }
.feature-title { font-size: 0.9rem; font-weight: 700; color: var(--gray-900); margin-bottom: 0.5rem; }
.feature-desc { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; }

/* Pricing */
.pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 1.25rem; max-width: 1000px; margin: 0 auto; }
.pricing-card { background: white; border: 1px solid var(--border); border-radius: var(--radius-xl); padding: 1.75rem; position: relative; transition: all 0.2s; }
.pricing-card:hover { box-shadow: var(--shadow-md); }
.pricing-card-featured { border-color: var(--primary); box-shadow: 0 0 0 1px var(--primary), var(--shadow-md); }
.pricing-popular { position: absolute; top: -13px; left: 50%; transform: translateX(-50%); background: var(--primary); color: white; font-size: 0.7rem; font-weight: 700; padding: 3px 14px; border-radius: 999px; white-space: nowrap; letter-spacing: 0.02em; }
.pricing-name { font-size: 0.875rem; font-weight: 700; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.875rem; }
.pricing-price { display: flex; align-items: baseline; gap: 2px; margin-bottom: 0.5rem; }
.pricing-amount { font-size: 1.875rem; font-weight: 800; color: var(--gray-900); }
.pricing-period { font-size: 0.85rem; color: var(--text-muted); }
.pricing-desc { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1.25rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--border); }
.pricing-features { list-style: none; display: flex; flex-direction: column; gap: 0.625rem; }
.pricing-features li { display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.825rem; color: var(--gray-700); }

/* CTA */
.cta-section { padding: 5rem 2rem; background: var(--primary); text-align: center; }
.cta-inner { max-width: 600px; margin: 0 auto; }
.cta-title { font-size: clamp(1.5rem, 4vw, 2.25rem); font-weight: 800; color: white; margin-bottom: 0.75rem; letter-spacing: -0.01em; }
.cta-sub { color: rgba(255,255,255,0.8); margin-bottom: 2rem; font-size: 1rem; }
.cta-section .btn-primary { background: white; color: var(--primary); }
.cta-section .btn-primary:hover { background: var(--gray-100); }

/* Footer */
.footer { padding: 1.5rem 2rem; border-top: 1px solid var(--border); background: white; }
.footer-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; }
.footer-brand { display: flex; align-items: center; gap: 0.5rem; }
.footer-credit { font-size: 0.75rem; color: var(--text-muted); }
.footer-links { display: flex; gap: 1.5rem; }
.footer-links a { font-size: 0.8rem; color: var(--text-muted); text-decoration: none; }
.footer-links a:hover { color: var(--primary); }
</style>
