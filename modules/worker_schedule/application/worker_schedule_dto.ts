import { z } from "zod"

export const workerScheduleSchema = z.object( {
  id                  : z.string(),
  week_day            : z.number().int(),
  status              : z.string(),
  start_date          : z.string().datetime(),
  end_date            : z.string().datetime(),
  recurrent_start_date: z.string().datetime().optional(),
  recurrent_end_date  : z.string().datetime().optional()
} )

export type WorkerScheduleDTO = z.infer<typeof workerScheduleSchema>

