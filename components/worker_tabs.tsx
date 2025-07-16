"use client"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelectedLayoutSegment }    from "next/navigation"
import Link                            from "next/link"
import {
  WorkerProfileDTO
}                                      from "@/modules/worker/application/worker_profile_dto"
interface WorkerTabsProps {
  worker: WorkerProfileDTO
}
export default  function WorkerTabs({worker}: WorkerTabsProps ){
  const seg = useSelectedLayoutSegment();
  const current = seg ?? "tarifa"
  return (
    <Tabs value={current} className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="tarifa" asChild>
          <Link href={`/trabajador/${worker.user_id}`}>Tarifas</Link>
        </TabsTrigger>
        <TabsTrigger value="historial" asChild>
          <Link href={`/trabajador/${worker.user_id}/historial`}>Historial</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
