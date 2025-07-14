"use server"
import WorkerApplyForm        from "@/components/form/worker_apply_form"
import { createClientServer } from "@/utils/supabase/server"
import WorkerExtraForm        from "@/components/form/worker_extra_form"
import { redirect }           from "next/navigation"

export default async function AplicarTrabajador() {
  const sup                = await createClientServer()
  const { data: { user } } = await sup.auth.getUser()

  const isWorker     = user?.user_metadata.role === "WORKER"
  const isIncomplete = user?.user_metadata.status === "INCOMPLETE"

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {isWorker && isIncomplete ? (
        <WorkerExtraForm />
      ) : isWorker ? (
        redirect("/")
      ) : (
        <WorkerApplyForm />
      )}
    </div>
  )
}