import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getQueryClient }               from "@/lib/query_client"
import { getWorker }                    from "@/utils/tanstack_catalog"
import { WorkerDetail }                 from "@/components/worker_detail"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function DetalleTrabajador( { params }: PageProps ) {
  const { id } = await params

  const queryClient = getQueryClient()
  await queryClient.prefetchQuery( (
      {
        queryKey: ["worker", id],
        queryFn : ()=>getWorker( id )
      }
    )
  )
  return (
    <HydrationBoundary state={ dehydrate( queryClient ) }>
      <WorkerDetail/>
    </HydrationBoundary>
  )
}
