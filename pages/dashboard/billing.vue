<template>
  <NuxtLayout name="dashboard" title="Billing" subtitle="Manage your subscription and payment history">

    <div v-if="loading" class="loading-state">
      <Icon name="ph:spinner-gap-bold" style="font-size:1.5rem;color:var(--primary);animation:spin 1s linear infinite" />
      Loading billing info...
    </div>

    <div v-else class="billing-wrap">

      <!-- Current plan -->
      <section class="billing-section">
        <h2 class="section-label">Current Plan</h2>
        <div class="current-plan">
          <div class="current-plan-left">
            <div class="current-plan-icon">
              <Icon name="ph:crown-fill" style="font-size:1.25rem;color:var(--primary)" />
            </div>
            <div>
              <p class="current-plan-name">{{ status?.plan?.toUpperCase() || 'FREE' }} Plan</p>
              <p class="current-plan-leads">{{ status?.leads_remaining?.toLocaleString() }} leads remaining this month</p>
              <p v-if="status?.subscription?.expires_at" class="current-plan-expiry">
                Renews {{ new Date(status.subscription.expires_at).toLocaleDateString('en-NG', { month: 'long', day: 'numeric', year: 'numeric' }) }}
              </p>
            </div>
          </div>
          <span class="badge badge-lg" :class="`badge-${status?.plan}`">{{ status?.plan || 'free' }}</span>
        </div>
      </section>

      <!-- Plans -->
      <section class="billing-section">
        <h2 class="section-label">Available Plans</h2>
        <div class="plans-grid">
          <div v-for="(plan, key) in plans" :key="key"
            class="plan-card"
            :class="{ 'plan-card-active': status?.plan === key, 'plan-card-featured': key === 'pro' }">
            <div v-if="key === 'pro'" class="plan-popular-tag">Most Popular</div>
            <p class="plan-name">{{ plan.name }}</p>
            <div class="plan-price">
              <span class="plan-amount">{{ plan.price }}</span>
              <span class="plan-period">/month</span>
            </div>
            <ul class="plan-features">
              <li v-for="f in plan.features" :key="f">
                <Icon name="ph:check-circle-fill" style="color:var(--success);font-size:0.875rem;flex-shrink:0" />
                <span>{{ f }}</span>
              </li>
            </ul>
            <div class="plan-action">
              <div v-if="status?.plan === key" class="plan-active-tag">✓ Current Plan</div>
              <button v-else-if="key !== 'free'"
                class="btn btn-primary"
                style="width:100%;justify-content:center"
                :disabled="subscribing === key"
                @click="subscribe(key as string)">
                {{ subscribing === key ? 'Processing...' : `Subscribe` }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Payment history -->
      <section class="billing-section">
        <h2 class="section-label">Payment History</h2>
        <div class="table-card">
          <div v-if="!status?.recent_payments?.length" class="empty-payments">
            No payments yet.
          </div>
          <table v-else class="data-table">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in status?.recent_payments" :key="p.paid_at">
                <td style="font-weight:600;color:var(--gray-900)">₦{{ Number(p.amount).toLocaleString() }}</td>
                <td><span class="pay-badge" :class="`pay-${p.status}`">{{ p.status }}</span></td>
                <td style="color:var(--text-secondary);font-size:0.85rem">{{ p.paid_at ? new Date(p.paid_at).toLocaleDateString() : '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const { api } = useAuth()
const config = useRuntimeConfig()
const status = ref<any>(null)
const loading = ref(true)
const subscribing = ref<string|null>(null)

const plans: Record<string, any> = {
  free: { name: 'Free', price: '₦0', features: ['20 lead previews/month', 'Basic filters', 'No export'] },
  basic: { name: 'Basic', price: '₦15,000', features: ['500 leads/month', 'CSV export', '1 industry filter', 'Email support'] },
  pro: { name: 'Pro', price: '₦35,000', features: ['2,000 leads/month', 'Excel + CSV export', 'All industries', 'Competitor tracking', 'Market reports'] },
  enterprise: { name: 'Enterprise', price: '₦80,000', features: ['Unlimited leads', 'API access', 'Weekly reports', 'Dedicated support'] },
}

const subscribe = async (plan: string) => {
  subscribing.value = plan
  try {
    const data: any = await api('/subscriptions/initiate/', { method: 'POST', body: { plan } })
    const handler = (window as any).PaystackPop.setup({
      key: config.public.paystackPublicKey,
      email: status.value?.user_email,
      amount: { basic: 1500000, pro: 3500000, enterprise: 8000000 }[plan],
      currency: 'NGN',
      ref: data.reference,
      onClose: () => { subscribing.value = null },
      callback: async (response: any) => {
        try {
          await api('/subscriptions/verify/', { method: 'POST', body: { reference: response.reference } })
          status.value = await api('/subscriptions/status/')
          alert('Subscription activated!')
        } finally { subscribing.value = null }
      },
    })
    handler.openIframe()
  } catch { alert('Payment failed. Please try again.'); subscribing.value = null }
}

onMounted(async () => {
  try { status.value = await api('/subscriptions/status/') }
  finally { loading.value = false }
})
</script>

<style scoped>
@keyframes spin { to { transform: rotate(360deg); } }
.loading-state { display: flex; align-items: center; gap: 0.75rem; padding: 4rem; justify-content: center; color: var(--text-muted); }
.billing-wrap { display: flex; flex-direction: column; gap: 2rem; }
.billing-section {}
.section-label { font-size: 0.875rem; font-weight: 600; color: var(--gray-700); margin-bottom: 0.875rem; text-transform: uppercase; letter-spacing: 0.04em; }
.current-plan { background: white; border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem; display: flex; align-items: center; justify-content: space-between; box-shadow: var(--shadow-sm); }
.current-plan-left { display: flex; align-items: center; gap: 1rem; }
.current-plan-icon { width: 48px; height: 48px; background: var(--primary-light); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; }
.current-plan-name { font-size: 1.125rem; font-weight: 700; color: var(--gray-900); }
.current-plan-leads { font-size: 0.85rem; color: var(--text-muted); margin-top: 2px; }
.current-plan-expiry { font-size: 0.8rem; color: var(--text-muted); margin-top: 2px; }
.badge-lg { font-size: 0.8rem !important; padding: 4px 14px !important; }
.plans-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px,1fr)); gap: 1rem; }
.plan-card { background: white; border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem; position: relative; transition: all 0.15s; display: flex; flex-direction: column; gap: 1rem; }
.plan-card:hover { box-shadow: var(--shadow-md); }
.plan-card-active { border-color: var(--primary); background: var(--primary-light); }
.plan-card-featured { border-color: var(--primary); box-shadow: 0 0 0 1px var(--primary), var(--shadow-md); }
.plan-popular-tag { position: absolute; top: -13px; left: 50%; transform: translateX(-50%); background: var(--primary); color: white; font-size: 0.7rem; font-weight: 700; padding: 3px 14px; border-radius: 999px; white-space: nowrap; }
.plan-name { font-size: 0.8rem; font-weight: 700; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.05em; }
.plan-price { display: flex; align-items: baseline; gap: 2px; }
.plan-amount { font-size: 1.625rem; font-weight: 800; color: var(--gray-900); }
.plan-period { font-size: 0.8rem; color: var(--text-muted); }
.plan-features { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; flex: 1; }
.plan-features li { display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.8rem; color: var(--gray-700); }
.plan-action { margin-top: auto; }
.plan-active-tag { text-align: center; color: var(--success); font-weight: 600; font-size: 0.875rem; padding: 0.625rem; }
.table-card { background: white; border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-sm); }
.empty-payments { padding: 3rem; text-align: center; color: var(--text-muted); font-size: 0.875rem; }
.pay-badge { padding: 2px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: 600; text-transform: capitalize; }
.pay-success { background: var(--success-bg); color: var(--success); }
.pay-pending { background: var(--warning-bg); color: var(--warning); }
.pay-failed { background: var(--danger-bg); color: var(--danger); }
</style>
