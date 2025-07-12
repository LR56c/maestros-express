"use server"
import { RoleLevelType } from "@/modules/user/domain/role_type"
import { createClientServer } from "@/utils/supabase/server"
import { checkRole } from "@/utils/check_role"

export const checkServerRole = async ( minRole: RoleLevelType ) => {
  const sup                = await createClientServer()
  const { data: { user } } = await sup.auth.getUser()
  return checkRole(minRole, user?.role)
}