"use client"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSelectedLayoutSegment }    from "next/navigation"
import Link                            from "next/link"
import {
  WorkerProfileDTO
}                                      from "@/modules/worker/application/worker_profile_dto"
import { useAuthContext }              from "@/app/context/auth_context"

interface WorkerTabsProps {
  worker: WorkerProfileDTO
}

export default function WorkerTabs( { worker }: WorkerTabsProps ) {
  const { user } = useAuthContext()
  const seg      = useSelectedLayoutSegment()
  const current  = seg ?? "tarifa"
  return (
    <Tabs value={ current } className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="tarifa" asChild>
          <Link href={ `/trabajador/${ worker.user_id }` }>Tarifas</Link>
        </TabsTrigger>
        { user?.user_id === worker.user_id ?

          <TabsTrigger value="historial" asChild>
            <Link
              href={ `/trabajador/${ worker.user_id }/historial` }>Historial</Link>
          </TabsTrigger>
          : null }
      </TabsList>
    </Tabs>
  )
}
