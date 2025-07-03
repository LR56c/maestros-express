"use server"
import { auth }                    from "@/lib/auth"
import { headers }                 from "next/headers"
import { RoleLevelType, RoleType } from "@/modules/user/domain/role_type"
import { wrapType }                from "@/modules/shared/utils/wrap_type"
import {
  BaseException
}                                  from "@/modules/shared/domain/exceptions/base_exception"

export const checkRole = async ( minRole: RoleLevelType ) => {
  const session = await auth.api.getSession( {
    headers: await headers()
  } )
  const role    = session?.user?.role

  const roleType = wrapType( () => RoleType.from( role ?? "" ) )

  if ( roleType instanceof BaseException) {
    return false
  }
  return roleType.value >= minRole
}