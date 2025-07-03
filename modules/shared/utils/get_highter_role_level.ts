import { matchRole, RoleLevel } from "@/modules/role/domain/role_level"

export const getHighterRoleLevel = ( roles: string[] ) => {
  let userRole: RoleLevel | undefined = undefined
  for ( const role of roles ) {
    const checkRole = matchRole( role )
    userRole        = checkRole !== undefined && (
      userRole === undefined || checkRole > userRole
    ) ? checkRole : userRole
  }
  return userRole
}
