"use client"
import { RoleLevelType, RoleType } from "@/modules/user/domain/role_type"
import { headers }                 from "next/headers"
import { wrapType }                from "@/modules/shared/utils/wrap_type"
import {
  BaseException
}                                  from "@/modules/shared/domain/exceptions/base_exception"
import { useAuthContext }          from "@/app/context/auth_context"
import { checkRole }               from "@/utils/check_role"

export const checkClientRole = async ( minRole: RoleLevelType ) => {
  const {user} = useAuthContext()
  return checkRole(minRole, user?.role)
}
