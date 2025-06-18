import { z } from "zod"

export const notificationResponseSchema = z.object( {
  id               : z.string(),
  title            : z.string(),
  notification_from: z.string(),
  content_from     : z.string(),
  redirect_url     : z.string(),
  viewed_at        : z.string()
                      .datetime()
                      .transform( ( value ) => new Date( value ) )
                      .optional()
} )

export type NotificationResponse = z.infer<typeof notificationResponseSchema>
