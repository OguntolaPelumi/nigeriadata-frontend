<template>
  <NuxtLayout name="dashboard" title="Market Reports" subtitle="Nigerian market intelligence and industry analysis">
    <div v-if="user?.subscription_plan === 'free' || user?.subscription_plan === 'basic'" class="alert alert-info">
      <Icon name="ph:info-fill" style="flex-shrink:0" />
      <span>Full reports with insights require <strong>Pro or Enterprise</strong> plan.</span>
      <NuxtLink to="/dashboard/billing" style="margin-left:auto;font-weight:600;color:inherit;text-decoration:underline;white-space:nowrap">Upgrade Now →</NuxtLink>
    </div>
    <div v-if="loading" class="loading-state">
      <Icon name="ph:spinner-gap-bold" style="font-size:1.5rem;color:var(--primary);animation:spin 1s linear infinite" />
      Loading reports...
    </div>
    <div v-else-if="!reports.length" class="empty-state">
      <Icon name="ph:chart-bar-fill" style="font-size:3rem;color:var(--gray-300)" />
      <p>No reports available yet. Check back soon.</p>
    </div>
    <div v-else class="reports-grid">
      <div v-for="report in reports" :key="report.id" class="report-card">
        <div class="report-card-header">
          <span class="report-industry">{{ report.industry }}</span>
          <span class="report-date">{{ new Date(report.published_at).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' }) }}</span>
        </div>
        <h3 class="report-title">{{ report.title }}</h3>
        <p class="report-summary">{{ report.summary }}</p>
        <div v-if="report.key_insights?.length" class="report-insights">
          <p class="insights-heading">Key Insights</p>
          <ul class="insights-list">
            <li v-for="insight in report.key_insights.slice(0,3)" :key="insight">
              <Icon name="ph:arrow-right-bold" style="color:var(--primary);font-size:0.7rem;flex-shrink:0;margin-top:3px" />
              {{ insight }}
            </li>
          </ul>
        </div>
        <div v-else class="report-locked">
          <Icon name="ph:lock-fill" style="font-size:0.875rem" />
          Full report requires Pro plan —
          <NuxtLink to="/dashboard/billing">Upgrade</NuxtLink>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const { api, user } = useAuth()
const loading = ref(true)
const reports = ref<any[]>([])
onMounted(async () => {
  try { const data: any = await api('/reports/'); reports.value = data.results || data }
  finally { loading.value = false }
})
</script>

<style scoped>
@keyframes spin { to { transform: rotate(360deg); } }
.loading-state,.empty-state { display: flex; align-items: center; gap: 0.75rem; padding: 4rem; justify-content: center; color: var(--text-muted); flex-direction: column; }
.reports-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px,1fr)); gap: 1.25rem; }
.report-card { background: white; border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--shadow-sm); transition: all 0.15s; }
.report-card:hover { box-shadow: var(--shadow-md); border-color: var(--primary-border); }
.report-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.875rem; }
.report-industry { background: var(--primary-light); color: var(--primary); padding: 2px 10px; border-radius: 999px; font-size: 0.7rem; font-weight: 700; text-transform: capitalize; letter-spacing: 0.02em; }
.report-date { font-size: 0.75rem; color: var(--text-muted); }
.report-title { font-size: 1rem; font-weight: 700; color: var(--gray-900); margin-bottom: 0.625rem; line-height: 1.4; }
.report-summary { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1rem; }
.report-insights { background: var(--gray-50); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 0.875rem; }
.insights-heading { font-size: 0.75rem; font-weight: 700; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.625rem; }
.insights-list { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; }
.insights-list li { display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.825rem; color: var(--gray-700); }
.report-locked { display: flex; align-items: center; gap: 0.375rem; font-size: 0.8rem; color: var(--text-muted); }
.report-locked a { color: var(--primary); font-weight: 600; text-decoration: none; }
</style>
