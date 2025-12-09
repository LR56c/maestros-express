import { z } from "zod"

export const notificationContentResponseSchema = z.object( {
  id        : z.string(),
  data      : z.json(),
  created_at: z.iso.datetime()
} )

export type NotificationContentResponse = z.infer<typeof notificationContentResponseSchema>
