<template>
  <NuxtLayout name="dashboard" title="B2B Leads" subtitle="Search and export verified Nigerian business contacts">

    <!-- Filters -->
    <div class="filters-card">
      <div class="filters-row">
        <div class="filter-search-wrap">
          <Icon name="ph:magnifying-glass-bold" class="filter-search-icon" />
          <input v-model="search" type="text" class="input filter-search" placeholder="Search by name, city, description..." @input="debouncedFetch" />
        </div>
        <select v-model="selectedIndustry" class="input filter-select" @change="fetchLeads">
          <option value="">All Industries</option>
          <option v-for="ind in industries" :key="ind.id" :value="ind.slug">{{ ind.name }}</option>
        </select>
        <select v-model="selectedState" class="input filter-select" @change="fetchLeads">
          <option value="">All States</option>
          <option v-for="s in states" :key="s.id" :value="s.slug">{{ s.name }}</option>
        </select>
        <select v-model="hasEmail" class="input filter-select" @change="fetchLeads">
          <option value="">Any contact</option>
          <option value="true">Has email</option>
        </select>
        <button class="btn btn-primary" :disabled="exporting" @click="exportLeads">
          <Icon name="ph:export-fill" />
          {{ exporting ? 'Exporting...' : 'Export CSV' }}
        </button>
      </div>
    </div>

    <!-- Free tier alert -->
    <div v-if="user?.subscription_plan === 'free'" class="alert alert-warning">
      <Icon name="ph:lock-fill" style="flex-shrink:0" />
      <span>Free plan shows previews only. Phone, email and website are hidden.</span>
      <NuxtLink to="/dashboard/billing" class="alert-action">Upgrade to unlock →</NuxtLink>
    </div>

    <!-- Table card -->
    <div class="table-card">
      <div v-if="loading" class="table-state">
        <Icon name="ph:spinner-gap-bold" style="font-size:1.5rem;color:var(--primary);animation:spin 1s linear infinite" />
        Loading leads...
      </div>
      <div v-else-if="error" class="table-state table-error">
        <Icon name="ph:warning-circle-fill" style="font-size:1.5rem" />
        {{ error }}
      </div>
      <template v-else>
        <div class="table-toolbar">
          <span class="table-count">{{ count.toLocaleString() }} businesses found</span>
        </div>
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>Business Name</th>
                <th>Industry</th>
                <th>State / City</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Website</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="biz in leads" :key="biz.id">
                <td><span class="td-name">{{ biz.name }}</span></td>
                <td><span class="td-badge">{{ biz.industry_name || '—' }}</span></td>
                <td class="td-location">{{ [biz.state_name, biz.city].filter(Boolean).join(', ') || '—' }}</td>
                <td>
                  <span v-if="biz.phone" class="td-contact">{{ biz.phone }}</span>
                  <span v-else class="td-locked">🔒 Upgrade</span>
                </td>
                <td>
                  <span v-if="biz.email" class="td-contact">{{ biz.email }}</span>
                  <span v-else class="td-locked">🔒 Upgrade</span>
                </td>
                <td>
                  <a v-if="biz.website" :href="biz.website" target="_blank" class="td-link">Visit →</a>
                  <span v-else class="td-muted">—</span>
                </td>
                <td>
                  <span v-if="biz.rating" class="td-rating">⭐ {{ biz.rating }}</span>
                  <span v-else class="td-muted">—</span>
                </td>
              </tr>
              <tr v-if="!leads.length">
                <td colspan="7" class="td-empty">No businesses found. Try adjusting your filters.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-footer">
          <button class="btn btn-secondary btn-sm" :disabled="!prevUrl" @click="fetchPage(prevUrl)">← Previous</button>
          <span class="table-page-info">Page {{ page }} of {{ totalPages || 1 }}</span>
          <button class="btn btn-secondary btn-sm" :disabled="!nextUrl" @click="fetchPage(nextUrl)">Next →</button>
        </div>
      </template>
    </div>

  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const { api, user } = useAuth()
const config = useRuntimeConfig()

const search = ref(''); const selectedIndustry = ref(''); const selectedState = ref(''); const hasEmail = ref('')
const loading = ref(true); const exporting = ref(false); const error = ref('')
const leads = ref<any[]>([]); const industries = ref<any[]>([]); const states = ref<any[]>([])
const count = ref(0); const nextUrl = ref<string|null>(null); const prevUrl = ref<string|null>(null); const page = ref(1)
const totalPages = computed(() => Math.ceil(count.value / 20))

const buildParams = () => {
  const p = new URLSearchParams()
  if (search.value) p.set('search', search.value)
  if (selectedIndustry.value) p.set('industry', selectedIndustry.value)
  if (selectedState.value) p.set('state', selectedState.value)
  if (hasEmail.value) p.set('has_email', hasEmail.value)
  return p.toString()
}

const fetchLeads = async () => {
  loading.value = true; error.value = ''
  try {
    const data: any = await api(`/businesses/?${buildParams()}`)
    leads.value = data.results; count.value = data.count; nextUrl.value = data.next; prevUrl.value = data.previous; page.value = 1
  } catch (err: any) { error.value = err?.data?.error || 'Failed to load leads.' }
  finally { loading.value = false }
}

const fetchPage = async (url: string|null) => {
  if (!url) return
  loading.value = true
  try {
    const data: any = await $fetch(url, { headers: { Authorization: `Bearer ${useCookie('nd_token').value}` } })
    leads.value = data.results; count.value = data.count; nextUrl.value = data.next; prevUrl.value = data.previous
  } finally { loading.value = false }
}

let timer: any
const debouncedFetch = () => { clearTimeout(timer); timer = setTimeout(fetchLeads, 400) }

const exportLeads = async () => {
  exporting.value = true
  try {
    const response = await fetch(`${config.public.apiBase}/businesses/export/?${buildParams()}`, { headers: { Authorization: `Bearer ${useCookie('nd_token').value}` } })
    if (!response.ok) { const d = await response.json(); alert(d.error || 'Export failed.'); return }
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `nigeria_leads_${Date.now()}.csv`; a.click()
    URL.revokeObjectURL(url)
  } finally { exporting.value = false }
}

onMounted(async () => {
  const [i, s]: any = await Promise.all([api('/businesses/industries/'), api('/businesses/states/')])
  industries.value = i.results || i; states.value = s.results || s
  await fetchLeads()
})
</script>

<style scoped>
@keyframes spin { to { transform: rotate(360deg); } }
.filters-card { background: white; border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1rem; margin-bottom: 1rem; box-shadow: var(--shadow-sm); }
.filters-row { display: flex; gap: 0.625rem; flex-wrap: wrap; align-items: center; }
.filter-search-wrap { position: relative; flex: 1; min-width: 200px; }
.filter-search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 0.875rem; }
.filter-search { padding-left: 2.25rem; }
.filter-select { width: auto; min-width: 140px; }
.alert-action { margin-left: auto; font-weight: 600; color: inherit; text-decoration: underline; white-space: nowrap; }
.table-card { background: white; border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-sm); }
.table-state { display: flex; align-items: center; gap: 0.75rem; padding: 3rem; justify-content: center; color: var(--text-muted); }
.table-error { color: var(--danger); }
.table-toolbar { padding: 0.875rem 1rem; border-bottom: 1px solid var(--border); }
.table-count { font-size: 0.8rem; color: var(--text-muted); font-weight: 500; }
.table-scroll { overflow-x: auto; }
.td-name { font-weight: 600; color: var(--gray-900); }
.td-badge { background: var(--primary-light); color: var(--primary); padding: 2px 8px; border-radius: 999px; font-size: 0.7rem; font-weight: 600; white-space: nowrap; }
.td-location { color: var(--text-secondary); font-size: 0.85rem; }
.td-contact { font-size: 0.825rem; color: var(--gray-700); }
.td-locked { font-size: 0.75rem; color: var(--text-muted); }
.td-link { font-size: 0.8rem; color: var(--primary); text-decoration: none; font-weight: 500; }
.td-link:hover { text-decoration: underline; }
.td-rating { font-size: 0.8rem; color: var(--gray-700); }
.td-muted { color: var(--gray-300); }
.td-empty { text-align: center; color: var(--text-muted); padding: 3rem; }
.table-footer { display: flex; align-items: center; justify-content: space-between; padding: 0.875rem 1rem; border-top: 1px solid var(--border); }
.table-page-info { font-size: 0.8rem; color: var(--text-muted); }
</style>
