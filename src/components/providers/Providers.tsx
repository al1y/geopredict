'use client'

import { PrivyProvider } from '@privy-io/react-auth'
import { ReactNode } from 'react'

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID

export function Providers({ children }: { children: ReactNode }) {
  // If no Privy app ID, render children without auth provider
  if (!PRIVY_APP_ID || PRIVY_APP_ID === 'your-privy-app-id-here') {
    return <>{children}</>
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
      {children}
    </PrivyProvider>
  )
}
