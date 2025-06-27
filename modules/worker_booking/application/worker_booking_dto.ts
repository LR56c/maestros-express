import { z } from "zod"

export const workerBookingSchema = z.object( {
  id    : z.string(),
  status: z.string(),
  date  : z.string().datetime()
} )

export type WorkerBookingDTO = z.infer<typeof workerBookingSchema>

