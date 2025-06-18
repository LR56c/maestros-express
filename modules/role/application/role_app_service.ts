import type { RoleDTO } from "@/modules/role/application/role_dto"

export abstract class RoleAppService {
  abstract add( role: RoleDTO ): Promise<void>

  abstract search( queryUrl: string ): Promise<RoleDTO[]>

  abstract remove( id: string ): Promise<void>

  abstract update( id: string, role: RoleDTO ): Promise<void>
}
