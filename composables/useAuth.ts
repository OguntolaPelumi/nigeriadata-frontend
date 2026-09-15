export const useAuth = () => {
  const config = useRuntimeConfig()
  const router = useRouter()

  const token = useCookie('nd_token', { maxAge: 86400 * 30 })
  const user = useState('user', () => null as any)

  const isAuthenticated = computed(() => !!token.value)

  const api = async (endpoint: string, options: any = {}) => {
    return await $fetch(`${config.public.apiBase}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
        ...options.headers,
      },
    })
  }

  const login = async (email: string, password: string) => {
    const data: any = await api('/auth/login/', {
      method: 'POST',
      body: { email, password },
    })
    token.value = data.access
    await fetchUser()
    return data
  }

  const register = async (payload: any) => {
    const data: any = await api('/auth/register/', {
      method: 'POST',
      body: payload,
    })
    token.value = data.tokens.access
    user.value = data.user
    return data
  }

  const logout = () => {
    token.value = null
    user.value = null
    router.push('/login')
  }

  const fetchUser = async () => {
    if (!token.value) return
    try {
      user.value = await api('/auth/profile/')
    } catch {
      logout()
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    api,
    login,
    register,
    logout,
    fetchUser,
  }
}
