'use client'

import { PrivyProvider } from '@privy-io/react-auth'
import { ReactNode } from 'react'
import { PrivyEnabledContext } from '@/lib/useAuth'

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID
const PRIVY_ENABLED = PRIVY_APP_ID && PRIVY_APP_ID !== 'your-privy-app-id-here'

export function Providers({ children }: { children: ReactNode }) {
  // If Privy isn't configured, just render children with context set to false
  if (!PRIVY_ENABLED) {
    return (
      <PrivyEnabledContext.Provider value={false}>
        {children}
      </PrivyEnabledContext.Provider>
    )
  }

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'dark',
          accentColor: '#3B82F6',
        },
      }}
    >
      <PrivyEnabledContext.Provider value={true}>
        {children}
      </PrivyEnabledContext.Provider>
    </PrivyProvider>
  )
}
