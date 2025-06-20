import type { SectorDTO } from "@/modules/sector/application/sector_dto"

export abstract class SectorAppService {

  abstract search( queryUrl: string ): Promise<SectorDTO[]>
  abstract add( sector: SectorDTO ): Promise<void>
  abstract update( sector: SectorDTO ): Promise<void>
  abstract remove( id: string ): Promise<void>
}
