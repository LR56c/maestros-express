import { z }            from "zod"
import { sectorSchema } from "@/modules/sector/application/sector_dto"

export const zoneSchema = z.object( {
  id          : z.string(),
  sector: sectorSchema
} )

export type ZoneDTO = z.infer<typeof zoneSchema>

