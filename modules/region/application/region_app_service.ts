import { type RegionDTO } from "./region_dto"

export abstract class RegionAppService {

  abstract search( queryUrl: string ): Promise<RegionDTO[]>
}
