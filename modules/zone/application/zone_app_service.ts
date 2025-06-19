import { ZoneDTO } from "@/modules/zone/application/zone_mapper"

export abstract class ZoneAppService {

  abstract search( queryUrl: string ): Promise<ZoneDTO[]>
}
