import { z }          from "zod"

export const notificationConfigSchema = z.object( {
  id                 : z.string(),
  user_id            : z.string().uuid(),
  device_data        : z.json(),
  device_token       : z.string(),
  notification_source: z.string()
} )

export type NotificationConfigDTO = z.infer<typeof notificationConfigSchema>
