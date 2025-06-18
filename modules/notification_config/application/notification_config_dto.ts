import { z }          from "zod"
import { jsonSchema } from "@/modules/shared/application/json_schema"

export const notificationConfigSchema = z.object( {
  id                 : z.string(),
  user_id            : z.string().uuid(),
  device_data        : jsonSchema,
  device_token       : z.string(),
  notification_source: z.string()
} )

export type NotificationConfigDTO = z.infer<typeof notificationConfigSchema>
