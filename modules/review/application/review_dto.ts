import { z }            from "zod"

export const reviewSchema = z.object( {
  id          : z.string(),
  user_id     : z.string(),
  service_id  : z.string(),
  service_type: z.string(),
  description : z.string(),
  value       : z.number().int()
} )

export type ReviewDTO = z.infer<typeof reviewSchema>

