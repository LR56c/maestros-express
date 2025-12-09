import { z } from "zod"

export const notificationRequestSchema = z.object( {
  id     : z.string(),
  data   : z.object( {
    title            : z.string(),
    notification_from: z.string(),
    content_from     : z.string(),
    redirect_url     : z.string()
  } ),
  tokens : z.array( z.string() ).nullish(),
  ids : z.array( z.string() ).nullish(),
} )

export type NotificationRequest = z.infer<typeof notificationRequestSchema>
