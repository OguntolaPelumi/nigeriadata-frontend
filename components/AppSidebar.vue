<template>
  <aside class="sidebar">

    <!-- Logo -->
    <div class="sidebar-logo">
      <div class="sidebar-logo-mark">
        <Icon name="ph:database-fill" style="font-size:1rem;color:white" />
      </div>
      <span class="sidebar-logo-text">Nigeria<span class="sidebar-logo-accent">Data</span></span>
    </div>

    <!-- Nav -->
    <nav class="sidebar-nav">
      <p class="sidebar-nav-label">Main Menu</p>
      <NuxtLink v-for="item in navItems" :key="item.to"
        :to="item.to" class="sidebar-link" active-class="sidebar-link-active"
        :exact="item.exact">
        <div class="sidebar-link-icon">
          <Icon :name="item.icon" style="font-size:1rem" />
        </div>
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <!-- Plan badge -->
    <div class="sidebar-plan">
      <div class="sidebar-plan-inner">
        <div class="sidebar-plan-top">
          <span class="sidebar-plan-label">Current Plan</span>
          <span class="badge" :class="`badge-${user?.subscription_plan || 'free'}`">
            {{ user?.subscription_plan || 'free' }}
          </span>
        </div>
        <div class="sidebar-plan-bar-wrap">
          <div class="sidebar-plan-bar">
            <div class="sidebar-plan-bar-fill"
              :style="`width:${Math.min(((user?.leads_used_this_month||0)/(user?.leads_limit||20))*100,100)}%`" />
          </div>
          <span class="sidebar-plan-usage">{{ user?.leads_remaining || 0 }} leads left</span>
        </div>
        <NuxtLink v-if="user?.subscription_plan === 'free'" to="/dashboard/billing" class="sidebar-upgrade-btn">
          Upgrade Plan →
        </NuxtLink>
      </div>
    </div>

    <!-- User -->
    <div class="sidebar-footer">
      <div class="sidebar-avatar">{{ initials }}</div>
      <div class="sidebar-user-info">
        <p class="sidebar-user-name">{{ user?.full_name || 'User' }}</p>
        <p class="sidebar-user-email">{{ user?.email }}</p>
      </div>
      <button class="sidebar-logout" @click="logout" title="Sign out">
        <Icon name="ph:sign-out-bold" style="font-size:1rem" />
      </button>
    </div>

  </aside>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()

const navItems = [
  { to: '/dashboard', icon: 'ph:squares-four-fill', label: 'Overview', exact: true },
  { to: '/dashboard/leads', icon: 'ph:buildings-fill', label: 'B2B Leads', exact: false },
  { to: '/dashboard/reports', icon: 'ph:chart-bar-fill', label: 'Market Reports', exact: false },
  { to: '/dashboard/billing', icon: 'ph:credit-card-fill', label: 'Billing', exact: false },
]

const initials = computed(() => {
  const name = user.value?.full_name || user.value?.email || 'U'
  return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
})
</script>

<style scoped>
.sidebar {
  position: fixed; left: 0; top: 0; bottom: 0; width: 256px;
  background: white; border-right: 1px solid var(--border);
  display: flex; flex-direction: column; z-index: 100;
  box-shadow: var(--shadow-sm);
}

/* Logo */
.sidebar-logo {
  display: flex; align-items: center; gap: 0.625rem;
  padding: 1.25rem 1.25rem;
  border-bottom: 1px solid var(--border);
}
.sidebar-logo-mark {
  width: 32px; height: 32px; border-radius: var(--radius);
  background: var(--primary); display: flex;
  align-items: center; justify-content: center; flex-shrink: 0;
}
.sidebar-logo-text {
  font-size: 1.1rem; font-weight: 800; color: var(--gray-900);
  letter-spacing: -0.3px;
}
.sidebar-logo-accent { color: var(--primary); }

/* Nav */
.sidebar-nav { flex: 1; padding: 1rem 0.75rem; overflow-y: auto; }
.sidebar-nav-label {
  font-size: 0.7rem; font-weight: 600; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.08em;
  padding: 0 0.625rem; margin-bottom: 0.375rem;
}
.sidebar-link {
  display: flex; align-items: center; gap: 0.625rem;
  padding: 0.5rem 0.625rem; border-radius: var(--radius);
  color: var(--gray-600); text-decoration: none;
  font-size: 0.875rem; font-weight: 500;
  transition: all 0.15s; margin-bottom: 2px;
}
.sidebar-link:hover { background: var(--gray-100); color: var(--gray-900); }
.sidebar-link-active { background: var(--primary-light) !important; color: var(--primary) !important; font-weight: 600; }
.sidebar-link-icon {
  width: 28px; height: 28px; border-radius: var(--radius-sm);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; color: inherit;
}
.sidebar-link-active .sidebar-link-icon { background: rgba(26,86,219,0.1); }

/* Plan */
.sidebar-plan { padding: 0.75rem; border-top: 1px solid var(--border); }
.sidebar-plan-inner {
  background: var(--gray-50); border: 1px solid var(--border);
  border-radius: var(--radius-md); padding: 0.875rem;
}
.sidebar-plan-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
.sidebar-plan-label { font-size: 0.75rem; font-weight: 600; color: var(--gray-500); }
.sidebar-plan-bar-wrap { margin-bottom: 0.75rem; }
.sidebar-plan-bar { background: var(--gray-200); border-radius: 999px; height: 4px; overflow: hidden; margin-bottom: 0.375rem; }
.sidebar-plan-bar-fill { height: 100%; background: var(--primary); border-radius: 999px; transition: width 0.5s; }
.sidebar-plan-usage { font-size: 0.75rem; color: var(--text-muted); }
.sidebar-upgrade-btn {
  display: block; text-align: center;
  background: var(--primary); color: white;
  padding: 0.5rem; border-radius: var(--radius);
  font-size: 0.8rem; font-weight: 600;
  text-decoration: none; transition: background 0.15s;
}
.sidebar-upgrade-btn:hover { background: var(--primary-hover); }

/* Footer */
.sidebar-footer {
  display: flex; align-items: center; gap: 0.625rem;
  padding: 0.875rem 1rem; border-top: 1px solid var(--border);
}
.sidebar-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--primary); color: white;
  font-size: 0.75rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.sidebar-user-info { flex: 1; overflow: hidden; }
.sidebar-user-name { font-size: 0.8rem; font-weight: 600; color: var(--gray-800); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sidebar-user-email { font-size: 0.7rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sidebar-logout {
  width: 28px; height: 28px; border-radius: var(--radius-sm);
  background: none; border: none; cursor: pointer;
  color: var(--gray-400); display: flex; align-items: center;
  justify-content: center; transition: all 0.15s; flex-shrink: 0;
}
.sidebar-logout:hover { background: var(--danger-bg); color: var(--danger); }
</style>
