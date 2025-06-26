import { type NotificationConfigDTO } from "./notification_config_dto"

export abstract class NotificationConfigAppService {
  abstract add( notificationConfig: NotificationConfigDTO ): Promise<void>
  abstract update( notificationConfig: NotificationConfigDTO ): Promise<void>

  abstract remove( id: string ): Promise<void>

  abstract search( queryUrl: string ): Promise<NotificationConfigDTO[]>
}
