import { z }                 from "zod"
import { formatUTCDateTime } from "@/modules/shared/utils/format_date_time"

export const workerScheduleSchema = z.object( {
  id                  : z.string(),
  week_day            : z.number().int(),
  status              : z.string(),
  start_date          : z.string()
                         .transform( t => formatUTCDateTime( new Date( t ) ) ),
  end_date            : z.string()
                         .transform( t => formatUTCDateTime( new Date( t ) ) ),
  recurrent_start_date: z.string()
                         .transform( t => formatUTCDateTime( new Date( t ) ) )
                         .nullish(),
  recurrent_end_date  : z.string()
                         .transform( t => formatUTCDateTime( new Date( t ) ) )
                         .nullish()
} )

export type WorkerScheduleDTO = z.infer<typeof workerScheduleSchema>

