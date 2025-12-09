import { z } from "zod"

export const notificationDataSchema = z.object( {
  icon             : z.string(),
  title            : z.string(),
  notification_from: z.string(),
  content_from     : z.string(),
  redirect_url     : z.string()
} )

export type NotificationDataDTO = z.infer<typeof notificationDataSchema>
