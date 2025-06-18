import { type NotificationRequest }  from "./notification_request"
import { type NotificationResponse } from "./notification_response"
import {
  type NotificationUpdateDTO
}                                    from "@/modules/notification/application/notification_update_dto"

export abstract class NotificationAppService {
  abstract send( notification: NotificationRequest,
    tokens: string[] ): Promise<NotificationResponse>

  abstract search( queryUrl: string ): Promise<NotificationResponse[]>

  abstract update( id: string,
    dto: NotificationUpdateDTO ): Promise<NotificationResponse>
}
