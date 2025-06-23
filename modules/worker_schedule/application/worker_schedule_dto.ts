import { z } from "zod"

export const workerScheduleSchema = z.object( {
  id                  : z.string(),
  week_day            : z.number().int(),
  status              : z.string(),
  start_date          : z.date(),
  end_date            : z.date(),
  created_at          : z.date(),
  recurrent_start_date: z.date().optional(),
  recurrent_end_date  : z.date().optional()
} )

export type WorkerScheduleDTO = z.infer<typeof workerScheduleSchema>

