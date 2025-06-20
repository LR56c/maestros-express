export enum RoleLevel {
  ADMIN  = 3,
  PRO    = 2,
  CLIENT   = 1,
  PUBLIC = 0,
}

export const matchRole = ( role ?: string ): RoleLevel | undefined => {
  if ( !role ) {
    return undefined
  }
  const roleMap: { [key: string]: RoleLevel } = {
    admin : RoleLevel.ADMIN,
    pro   : RoleLevel.PRO,
    client  : RoleLevel.CLIENT,
    public: RoleLevel.PUBLIC
  }
  return roleMap[role] !== undefined ? roleMap[role] : undefined
}
