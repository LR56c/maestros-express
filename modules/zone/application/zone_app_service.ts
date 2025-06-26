import { ZoneDTO } from "@/modules/zone/application/zone_dto"

export abstract class ZoneAppService {

  abstract upsert(  workerId: string, zones: ZoneDTO[]  ): Promise<void>


  abstract getByWorker( workerId: string ): Promise<ZoneDTO[]>
}
