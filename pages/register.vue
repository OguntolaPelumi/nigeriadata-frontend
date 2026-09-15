<template>
  <div class="auth-wrap">
    <div class="auth-left">
      <div class="auth-left-content">
        <div class="auth-brand">
          <div class="auth-brand-mark">
            <Icon name="ph:database-fill" style="font-size:1.25rem;color:white" />
          </div>
          <span class="auth-brand-name">Nigeria<span>Data</span></span>
        </div>
        <h2 class="auth-left-title">Start accessing Nigerian business intelligence today</h2>
        <ul class="auth-left-list">
          <li v-for="item in benefits" :key="item">
            <Icon name="ph:check-circle-fill" style="color:#60a5fa;font-size:1rem;flex-shrink:0" />
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="auth-right">
      <div class="auth-card">
        <NuxtLink to="/" class="auth-back">← Back to home</NuxtLink>
        <h1 class="auth-title">Create your account</h1>
        <p class="auth-sub">Free forever no debit card required</p>
        <div class="auth-form">
          <div class="auth-row">
            <div class="auth-field">
              <label class="auth-label">Full Name *</label>
              <input v-model="form.full_name" type="text" class="input" placeholder="Enter full name" />
            </div>
            <div class="auth-field">
              <label class="auth-label">Username *</label>
              <input v-model="form.username" type="text" class="input" placeholder="Enter username" />
            </div>
          </div>
          <div class="auth-field">
            <label class="auth-label">Email Address *</label>
            <input v-model="form.email" type="email" class="input" placeholder="you@company.com" />
          </div>
          <div class="auth-row">
            <div class="auth-field">
              <label class="auth-label">Company Name</label>
              <input v-model="form.company_name" type="text" class="input" placeholder="Your company" />
            </div>
            <div class="auth-field">
              <label class="auth-label">Phone</label>
              <input v-model="form.phone" type="tel" class="input" placeholder="+234 xxx" />
            </div>
          </div>
          <div class="auth-row">
            <div class="auth-field">
              <label class="auth-label">Password *</label>
              <input v-model="form.password" type="password" class="input" placeholder="Min 8 chars" />
            </div>
            <div class="auth-field">
              <label class="auth-label">Confirm Password *</label>
              <input v-model="form.password2" type="password" class="input" placeholder="Repeat" />
            </div>
          </div>
          <div v-if="error" class="alert alert-warning" style="margin:0">
            <Icon name="ph:warning-fill" />{{ error }}
          </div>
          <button class="btn btn-primary btn-lg auth-submit" :disabled="loading" @click="handleRegister">
            {{ loading ? 'Creating account...' : 'Create Free Account' }}
          </button>
        </div>
        <p class="auth-switch">
          Already have an account? <NuxtLink to="/login">Sign in</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'guest' })
const { register } = useAuth()
const router = useRouter()
const form = reactive({ full_name: '', email: '', company_name: '', phone: '', username: '', password: '', password2: '' })
const loading = ref(false)
const error = ref('')
const benefits = ['20 free leads every month', 'No credit card required', 'Instant access to dashboard', 'Upgrade anytime']

const handleRegister = async () => {
  if (!form.full_name || !form.email || !form.username || !form.password) { error.value = 'Please fill in all required fields.'; return }
  if (form.password !== form.password2) { error.value = 'Passwords do not match.'; return }
  loading.value = true; error.value = ''
  try { await register(form); router.push('/dashboard') }
  catch (err: any) {
    const data = err?.data || {}
    error.value = Object.values(data).flat().join(' ') || 'Registration failed. Please try again.'
  } finally { loading.value = false }
}
</script>

<style scoped>
.auth-wrap { display: flex; min-height: 100vh; }
.auth-left { width: 380px; background: var(--primary); padding: 3rem; display: flex; align-items: center; flex-shrink: 0; }
.auth-left-content { width: 100%; }
.auth-brand { display: flex; align-items: center; gap: 0.625rem; margin-bottom: 2.5rem; }
.auth-brand-mark { width: 36px; height: 36px; background: rgba(255,255,255,0.2); border-radius: var(--radius); display: flex; align-items: center; justify-content: center; }
.auth-brand-name { font-size: 1.2rem; font-weight: 800; color: white; }
.auth-brand-name span { color: #93c5fd; }
.auth-left-title { font-size: 1.4rem; font-weight: 700; color: white; line-height: 1.3; margin-bottom: 2rem; }
.auth-left-list { list-style: none; display: flex; flex-direction: column; gap: 0.875rem; }
.auth-left-list li { display: flex; align-items: center; gap: 0.75rem; color: rgba(255,255,255,0.85); font-size: 0.9rem; }
.auth-right { flex: 1; display: flex; align-items: center; justify-content: center; padding: 2rem; background: var(--gray-50); overflow-y: auto; }
.auth-card { background: white; border: 1px solid var(--border); border-radius: var(--radius-2xl); padding: 2.25rem; width: 100%; max-width: 480px; box-shadow: var(--shadow-lg); }
.auth-back { display: inline-block; font-size: 0.8rem; color: var(--text-muted); text-decoration: none; margin-bottom: 1.5rem; transition: color 0.15s; }
.auth-back:hover { color: var(--primary); }
.auth-title { font-size: 1.4rem; font-weight: 700; color: var(--gray-900); margin-bottom: 0.25rem; }
.auth-sub { font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1.5rem; }
.auth-form { display: flex; flex-direction: column; gap: 0.875rem; }
.auth-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
.auth-field { display: flex; flex-direction: column; gap: 0.375rem; }
.auth-label { font-size: 0.8rem; font-weight: 600; color: var(--gray-700); }
.auth-submit { width: 100%; justify-content: center; margin-top: 0.25rem; }
.auth-switch { text-align: center; margin-top: 1.25rem; font-size: 0.85rem; color: var(--text-muted); }
.auth-switch a { color: var(--primary); font-weight: 600; text-decoration: none; }
@media (max-width: 768px) { .auth-left { display: none; } .auth-row { grid-template-columns: 1fr; } }
</style>
