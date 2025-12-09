import { z } from "zod"

export const notificationResponseSchema = z.object( {
  id               : z.string(),
  title            : z.string(),
  notification_from: z.string(),
  icon: z.string(),
  content_from     : z.string(),
  redirect_url     : z.string(),
  viewed_at        : z.string().datetime().nullish(),
  created_at        : z.string().datetime()
} )

export type NotificationResponse = z.infer<typeof notificationResponseSchema>
