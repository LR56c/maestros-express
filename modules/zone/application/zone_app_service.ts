import { ZoneDTO } from "@/modules/zone/application/zone_dto"

export abstract class ZoneAppService {

  abstract removeBulk( ids: string[] ): Promise<void>
  abstract addBulk( workerId: string,
    zones: ZoneDTO[] ): Promise<void>

  abstract getByWorker( workerId: string ): Promise<ZoneDTO[]>
}
