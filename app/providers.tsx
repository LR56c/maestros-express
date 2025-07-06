"use client"
import { ReactNode }           from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { getQueryClient }      from "@/lib/query_client"
import { ReactQueryDevtools }  from "@tanstack/react-query-devtools"
import { AuthProvider }        from "@/app/context/auth_context"
import { WorkerProvider }      from "@/app/context/worker_context"

export default function Providers( { children }: { children: ReactNode } ) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={ queryClient }>
      <AuthProvider>
        <WorkerProvider>
          { children }
          <ReactQueryDevtools/>
        </WorkerProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}