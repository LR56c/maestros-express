import { type Either }                 from "fp-ts/lib/Either"
import { isLeft, left, right }         from "fp-ts/lib/Either"
import {
  BaseException
}                                      from "../../shared/domain/exceptions/base_exception"
import { NotificationUpdateDTO }       from "./notification_update_dto"
import { Notification }                from "../domain/notification"
import { wrapTypeDefault }             from "../../shared/utils/wrap_type"
import {
  ValidBool
}                                      from "../../shared/domain/value_objects/valid_bool"
import {
  ValidDate
}                                      from "../../shared/domain/value_objects/valid_date"
import {
  InfrastructureException
}                                      from "../../shared/domain/exceptions/infrastructure_exception"
import {
  ensureUserNotificationExist
}                                      from "@/modules/notification/utils/ensure_notification_exist"
import {
  NotificationRepository
}                                      from "@/modules/notification/domain/notification_repository"

export class UpdateNotification {
  constructor( private readonly dao: NotificationRepository ) {
  }


  async execute(userId :string, dto : NotificationUpdateDTO): Promise<Either<BaseException[], Notification>> {
    const notificationResult = await ensureUserNotificationExist(this.dao, dto.id, userId )

    if ( isLeft( notificationResult ) ) {
      return left( notificationResult.left )
    }

    if( notificationResult.right.userId.toString() !== userId ) {
      return left( [new InfrastructureException("You can only update your own notifications")] )
    }

    const viewedAt = wrapTypeDefault( undefined,
      ( value ) => ValidBool.from( value ), dto.viewed_at )

    if ( viewedAt instanceof BaseException ) {
      return left( [viewedAt] )
    }

    const notification = notificationResult.right

    const newNotification = Notification.from(
      notification.id,
      notification.userId,
      notification.data,
      notification.createdAt,
      !viewedAt ? undefined : ValidDate.now()
    )

    const result = await this.dao.update( newNotification )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( newNotification )
  }
}
