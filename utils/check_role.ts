import { RoleLevelType, RoleType } from "@/modules/user/domain/role_type"
import { wrapType }                from "@/modules/shared/utils/wrap_type"
import {
  BaseException
}                                  from "@/modules/shared/domain/exceptions/base_exception"

export const checkRole = async ( minRole: RoleLevelType, inputRole ?: string
) => {
  const roleType = wrapType( () => RoleType.from( inputRole ?? "" ) )
  if ( roleType instanceof BaseException ) {
    return false
  }
  return roleType.value >= minRole
}
