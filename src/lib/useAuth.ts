'use client'

import { usePrivy } from '@privy-io/react-auth'

const PRIVY_ENABLED = typeof window !== 'undefined' &&
  process.env.NEXT_PUBLIC_PRIVY_APP_ID &&
  process.env.NEXT_PUBLIC_PRIVY_APP_ID !== 'your-privy-app-id-here'

// Fallback hook when Privy isn't configured
function useNoAuth() {
  return {
    ready: true,
    authenticated: false,
    login: () => console.warn('Privy not configured. Set NEXT_PUBLIC_PRIVY_APP_ID in .env.local'),
    logout: () => {},
    user: null,
  }
}

export function useAuth() {
  // We have to call both hooks unconditionally due to React rules
  // But we can choose which result to return
  const privyResult = usePrivyOrFallback()
  return privyResult
}

function usePrivyOrFallback() {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const privy = usePrivy()
    return {
      ready: privy.ready,
      authenticated: privy.authenticated,
      login: privy.login,
      logout: privy.logout,
      user: privy.user,
    }
  } catch {
    // Privy provider not available, return fallback
    return {
      ready: true,
      authenticated: false,
      login: () => console.warn('Privy not configured'),
      logout: () => {},
      user: null,
    }
  }
}
