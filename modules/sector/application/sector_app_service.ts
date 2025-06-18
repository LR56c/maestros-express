import type { SectorDTO } from "@/modules/sector/application/sector_dto"

export abstract class SectorAppService {

  abstract search( queryUrl: string ): Promise<SectorDTO[]>
}
