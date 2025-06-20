import { type RegionDTO } from "./region_dto"

export abstract class RegionAppService {

  abstract search( queryUrl: string ): Promise<RegionDTO[]>
  abstract add( region: RegionDTO ): Promise<void>
  abstract update( region: RegionDTO ): Promise<void>
  abstract remove( id: string ): Promise<void>
}
