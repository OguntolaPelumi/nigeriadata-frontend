<template>
  <NuxtLayout name="dashboard" title="Overview" subtitle="Your NigeriaData dashboard">
    <div v-if="loading" class="loading-state">
      <Icon name="ph:spinner-gap-bold" style="font-size:1.5rem;color:var(--primary);animation:spin 1s linear infinite" />
      <span>Loading dashboard...</span>
    </div>
    <div v-else>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card" v-for="stat in statCards" :key="stat.label">
          <div class="stat-icon" :style="`background:${stat.bg}`">
            <Icon :name="stat.icon" :style="`font-size:1.1rem;color:${stat.color}`" />
          </div>
          <div class="stat-body">
            <p class="stat-label">{{ stat.label }}</p>
            <p class="stat-value">{{ stat.value }}</p>
          </div>
        </div>
      </div>

      <!-- Plan + actions row -->
      <div class="dash-row">

        <!-- Plan card -->
        <div class="plan-status-card">
          <div class="plan-status-top">
            <div>
              <p class="plan-status-label">Current Plan</p>
              <p class="plan-status-name">{{ stats.plan?.toUpperCase() }}</p>
            </div>
            <span class="badge" :class="`badge-${stats.plan}`">{{ stats.plan }}</span>
          </div>
          <div class="plan-progress-section">
            <div class="plan-progress-labels">
              <span>Leads used this month</span>
              <span>{{ stats.leads_used }} / {{ stats.leads_limit }}</span>
            </div>
            <div class="plan-progress-track">
              <div class="plan-progress-fill"
                :style="`width:${Math.min(((stats.leads_used||0)/(stats.leads_limit||1))*100,100)}%;background:${progressColor}`" />
            </div>
          </div>
          <NuxtLink v-if="stats.plan !== 'enterprise'" to="/dashboard/billing" class="btn btn-primary btn-sm" style="width:100%;justify-content:center">
            Upgrade Plan →
          </NuxtLink>
        </div>

        <!-- Quick actions -->
        <div class="quick-actions-card">
          <p class="quick-title">Quick Actions</p>
          <div class="quick-grid">
            <NuxtLink v-for="action in quickActions" :key="action.to" :to="action.to" class="quick-item">
              <div class="quick-item-icon" :style="`background:${action.bg}`">
                <Icon :name="action.icon" :style="`font-size:1rem;color:${action.color}`" />
              </div>
              <div>
                <p class="quick-item-label">{{ action.label }}</p>
                <p class="quick-item-sub">{{ action.sub }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>

      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const { api } = useAuth()
const loading = ref(true)
const stats = ref<any>({})

const statCards = computed(() => [
  { label: 'Total Businesses', value: stats.value.total_businesses?.toLocaleString() || '0', icon: 'ph:buildings-fill', bg: '#eff6ff', color: '#1d4ed8' },
  { label: 'Leads Remaining', value: stats.value.leads_remaining?.toLocaleString() || '0', icon: 'ph:check-circle-fill', bg: '#f0fdf4', color: '#15803d' },
  { label: 'Leads Used', value: `${stats.value.leads_used || 0} / ${stats.value.leads_limit || 0}`, icon: 'ph:database-fill', bg: '#fffbeb', color: '#b45309' },
  { label: 'Total Exports', value: stats.value.total_exports || '0', icon: 'ph:export-fill', bg: '#faf5ff', color: '#7c3aed' },
])

const progressColor = computed(() => {
  const pct = ((stats.value.leads_used||0)/(stats.value.leads_limit||1))*100
  if (pct >= 90) return '#dc2626'
  if (pct >= 70) return '#d97706'
  return 'var(--primary)'
})

const quickActions = [
  { to: '/dashboard/leads', label: 'Search Leads', sub: 'Find businesses by industry', icon: 'ph:magnifying-glass-fill', bg: '#eff6ff', color: '#1d4ed8' },
  { to: '/dashboard/leads', label: 'Export CSV', sub: 'Download filtered leads', icon: 'ph:export-fill', bg: '#f0fdf4', color: '#15803d' },
  { to: '/dashboard/reports', label: 'Market Reports', sub: 'Latest Nigerian insights', icon: 'ph:chart-bar-fill', bg: '#fff7ed', color: '#c2410c' },
  { to: '/dashboard/billing', label: 'Manage Billing', sub: 'View plan and payments', icon: 'ph:credit-card-fill', bg: '#faf5ff', color: '#7c3aed' },
]

onMounted(async () => {
  try { stats.value = await api('/businesses/stats/') }
  finally { loading.value = false }
})
</script>

<style scoped>
@keyframes spin { to { transform: rotate(360deg); } }
.loading-state { display: flex; align-items: center; gap: 0.75rem; color: var(--text-muted); padding: 3rem; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px,1fr)); gap: 1rem; margin-bottom: 1.25rem; }
.stat-card { background: white; border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.25rem; display: flex; align-items: center; gap: 1rem; box-shadow: var(--shadow-sm); transition: all 0.15s; }
.stat-card:hover { box-shadow: var(--shadow-md); border-color: var(--primary-border); }
.stat-icon { width: 44px; height: 44px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-label { font-size: 0.75rem; color: var(--text-muted); font-weight: 500; margin-bottom: 0.25rem; }
.stat-value { font-size: 1.375rem; font-weight: 700; color: var(--gray-900); }
.dash-row { display: grid; grid-template-columns: 300px 1fr; gap: 1.25rem; }
.plan-status-card { background: white; border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.25rem; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; gap: 1.25rem; }
.plan-status-top { display: flex; justify-content: space-between; align-items: flex-start; }
.plan-status-label { font-size: 0.75rem; color: var(--text-muted); font-weight: 500; margin-bottom: 0.25rem; }
.plan-status-name { font-size: 1.25rem; font-weight: 700; color: var(--gray-900); }
.plan-progress-labels { display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.5rem; }
.plan-progress-track { background: var(--gray-100); border-radius: 999px; height: 6px; overflow: hidden; }
.plan-progress-fill { height: 100%; border-radius: 999px; transition: width 0.5s ease; }
.quick-actions-card { background: white; border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.25rem; box-shadow: var(--shadow-sm); }
.quick-title { font-size: 0.875rem; font-weight: 600; color: var(--gray-700); margin-bottom: 1rem; }
.quick-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
.quick-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.875rem; border: 1px solid var(--border); border-radius: var(--radius-md); text-decoration: none; transition: all 0.15s; }
.quick-item:hover { border-color: var(--primary-border); background: var(--primary-light); }
.quick-item-icon { width: 36px; height: 36px; border-radius: var(--radius); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.quick-item-label { font-size: 0.825rem; font-weight: 600; color: var(--gray-800); }
.quick-item-sub { font-size: 0.75rem; color: var(--text-muted); }
@media (max-width: 900px) { .dash-row { grid-template-columns: 1fr; } }
</style>
