import { RoleLevelType } from "@/modules/user/domain/role_type"

export const matchRole = ( role ?: string ): RoleLevelType | undefined => {
  if ( !role ) {
    return undefined
  }
  const roleMap: { [key: string]: RoleLevelType } = {
    admin : RoleLevelType.ADMIN,
    public: RoleLevelType.PUBLIC,
    worker: RoleLevelType.WORKER,
    client: RoleLevelType.CLIENT
  }
  return roleMap[role] !== undefined ? roleMap[role] : undefined
}
