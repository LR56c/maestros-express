"use server"
import WorkerApplyForm from "@/components/form/worker_apply_form"
// import { verifyServerRole } from "@/utils/check_role"
// import { RoleLevelType }    from "@/modules/user/domain/role_type"

export default async function AplicarTrabajador() {
  return <div className="flex flex-col items-center justify-center min-h-screen">
    <WorkerApplyForm/>
  </div>
}