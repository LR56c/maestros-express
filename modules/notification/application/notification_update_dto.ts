import { z } from "zod"

export const notificationUpdateSchema = z.object( {
  viewed_at: z.boolean().optional()
} )

export type NotificationUpdateDTO = z.infer<typeof notificationUpdateSchema>
