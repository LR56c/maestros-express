import { z } from "zod"

export const reportSchema = z.object( {
  id          : z.string(),
  from_user_id: z.string(),
  to_user_id  : z.string(),
  reason      : z.string()
} )

export type ReportDTO = z.infer<typeof reportSchema>

