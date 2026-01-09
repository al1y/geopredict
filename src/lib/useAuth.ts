'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useContext, createContext } from 'react'

// Check if Privy is properly configured
const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID
const PRIVY_ENABLED = PRIVY_APP_ID && PRIVY_APP_ID !== 'your-privy-app-id-here'

// Context to check if we're inside PrivyProvider
export const PrivyEnabledContext = createContext(false)

export function useAuth() {
  const privyEnabled = useContext(PrivyEnabledContext)

  // Only call usePrivy if we're inside a real PrivyProvider
  if (privyEnabled) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const privy = usePrivy()
    return {
      ready: privy.ready,
      authenticated: privy.authenticated,
      login: privy.login,
      logout: privy.logout,
      user: privy.user,
    }
  }

  // Fallback when Privy isn't configured
  return {
    ready: true,
    authenticated: false,
    login: () => console.warn('Privy not configured. Set NEXT_PUBLIC_PRIVY_APP_ID in .env.local'),
    logout: () => {},
    user: null,
  }
}
