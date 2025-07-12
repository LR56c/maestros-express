"use server"
import WorkerApplyForm        from "@/components/form/worker_apply_form"
import { createClientServer } from "@/utils/supabase/server"
import WorkerExtraForm        from "@/components/form/worker_extra_form"

export default async function AplicarTrabajador() {
  const sup                = await createClientServer()
  const { data: { user } } = await sup.auth.getUser()
  const extraForm = () => {
    if ( !user ) return false

    return user.user_metadata.role === "WORKER" && user.user_metadata.status ===
      "INCOMPLETE"
  }
  return <div
    className="flex flex-col items-center justify-center min-h-screen">
    { extraForm() ? <WorkerExtraForm/> : <WorkerApplyForm/> }
  </div>
}