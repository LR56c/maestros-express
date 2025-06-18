import { z } from "zod"

export const notificationRequestSchema = z.object( {
  id     : z.string(),
  user_id: z.string().uuid(),
  data   : z.object( {
    title            : z.string(),
    notification_from: z.string(),
    content_from     : z.string(),
    redirect_url     : z.string()
  } ),
  tokens : z.array( z.string() )
} )

export type NotificationRequest = z.infer<typeof notificationRequestSchema>
