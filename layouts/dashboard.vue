<template>
  <div class="dashboard-layout">
    <AppSidebar />
    <div class="dashboard-main">

      <!-- Top header -->
      <header class="dash-header">
        <div class="dash-header-inner">
          <div class="dash-header-left">
            <h1 class="dash-title">{{ title }}</h1>
            <p v-if="subtitle" class="dash-subtitle">{{ subtitle }}</p>
          </div>
          <div class="dash-header-right">
            <div class="dash-leads-pill">
              <div class="dash-leads-dot" />
              <span>{{ user?.leads_remaining ?? 0 }} leads remaining</span>
            </div>
            <NuxtLink v-if="user?.subscription_plan === 'free'" to="/dashboard/billing" class="btn btn-primary btn-sm">
              Upgrade Plan
            </NuxtLink>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <div class="dashboard-content">
        <slot />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title?: string; subtitle?: string }>()
const { user, fetchUser } = useAuth()
onMounted(() => fetchUser())
</script>

<style scoped>
.dash-header {
  background: var(--surface-tint); border-bottom: 1px solid var(--border-green);
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  position: sticky; top: 0; z-index: 50;
}
.dash-header-inner {
  padding: 0.875rem 2rem;
  display: flex; align-items: center; justify-content: space-between;
  gap: 1rem;
}
.dash-title { font-size: 1.125rem; font-weight: 700; color: var(--gray-900); }
.dash-subtitle { font-size: 0.8rem; color: var(--text-muted); margin-top: 1px; }
.dash-header-right { display: flex; align-items: center; gap: 0.75rem; }
.dash-leads-pill {
  display: flex; align-items: center; gap: 0.375rem;
  background: white; border: 1px solid var(--border-green);
  padding: 0.375rem 0.75rem; border-radius: 999px;
  font-size: 0.8rem; font-weight: 500; color: var(--gray-600);
}
.dash-leads-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--success); flex-shrink: 0;
}
</style>
