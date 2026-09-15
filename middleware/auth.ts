export default defineNuxtRouteMiddleware(() => {
  const token = useCookie('nd_token')
  if (!token.value) {
    return navigateTo('/login')
  }
})
