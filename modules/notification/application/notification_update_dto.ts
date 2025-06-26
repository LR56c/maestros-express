import { z } from "zod"

export const notificationUpdateSchema = z.object( {
  id: z.string(),
  viewed_at: z.boolean().optional()
} )

export type NotificationUpdateDTO = z.infer<typeof notificationUpdateSchema>
