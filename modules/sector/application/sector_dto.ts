import { z } from "zod"
import { regionSchema } from "@/modules/region/application/region_dto"

export const sectorSchema = z.object( {
  id          : z.string(),
  name        : z.string(),
  region: regionSchema
} )

export type SectorDTO = z.infer<typeof sectorSchema>

