'use client';

import { PropsWithChildren, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from "@trpc/client";
import { trpc } from "@/trpc/client";

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';

const Providers = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
      trpc.createClient({
        links: [
          httpBatchLink({
            url: `${FRONTEND_URL}/api/trpc`,
            fetch(url, options) {
              return fetch(url, { ...options, credentials: 'include' })
            }
          })
        ]
      })
  )

  return (
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </trpc.Provider>
  )
}

export default Providers
