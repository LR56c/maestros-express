"use client"
import { ReactNode }           from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { getQueryClient }      from "@/lib/query_client"
import { ReactQueryDevtools }  from "@tanstack/react-query-devtools"

export default function Providers( { children }: { children: ReactNode } ) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={ queryClient }>
      { children }
      <ReactQueryDevtools/>
    </QueryClientProvider>
  )
}