import { PackageResponse } from "@/modules/package/application/package_response"

export abstract class PackageAppService{
  abstract search( query: string): Promise<PackageResponse[]>
  abstract add( entity: PackageResponse ): Promise<void>
  abstract update( entity: PackageResponse ): Promise<void>
  abstract remove( id: string ): Promise<void>
}
