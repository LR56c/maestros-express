import { PackageDTO } from "@/modules/package/application/package_dto"

export abstract class PackageAppService{
  abstract search( query: string): Promise<PackageDTO[]>
  abstract add( entity: PackageDTO ): Promise<void>
  abstract update( entity: PackageDTO ): Promise<void>
  abstract remove( id: string ): Promise<void>
}
