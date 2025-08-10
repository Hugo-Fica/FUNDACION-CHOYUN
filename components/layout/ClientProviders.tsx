'use client'

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { Toaster } from 'sonner'

const queryClient = new QueryClient()
export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        position='top-center'
        expand={false}
        richColors
        closeButton
      />
      {children}
    </QueryClientProvider>
  )
}
