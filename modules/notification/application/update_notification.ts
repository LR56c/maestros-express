import {
  NotificationRepository
}                              from "@/modules/notification/domain/notification_repository"
import type { Either }         from "fp-ts/Either"
import { isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import { wrapTypeDefault }     from "@/modules/shared/utils/wrap_type"
import {
  ValidDate
}                              from "@/modules/shared/domain/value_objects/valid_date"
import {
  ValidInteger
}                              from "@/modules/shared/domain/value_objects/valid_integer"
import {
  Notification
}                              from "@/modules/notification/domain/notification"
import {
  ValidBool
}                              from "@/modules/shared/domain/value_objects/valid_bool"
import {
  DataNotFoundException
}                              from "@/modules/shared/domain/exceptions/data_not_found_exception"
import {
  NotificationUpdateDTO
} from "@/modules/notification/application/notification_update_dto"

export class UpdateNotification {
  constructor( private readonly repo: NotificationRepository ) {
  }

  private async ensureNotificationExist( id: string ): Promise<Either<BaseException[], Notification>> {
    const existResult = await this.repo.search( {
      id: id
    }, ValidInteger.from( 1 ) )

    if ( isLeft( existResult ) ) {
      return left( existResult.left )
    }

    if ( existResult.right.length > 0 &&
      existResult.right[0]!.id.toString() !== id )
    {
      return left( [new DataNotFoundException()] )
    }
    return right( existResult.right[0]! )
  }


  async execute( dto : NotificationUpdateDTO): Promise<Either<BaseException[], Notification>> {
    const notificationResult = await this.ensureNotificationExist( dto.id )

    if ( isLeft( notificationResult ) ) {
      return left( notificationResult.left )
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
      notification.isEnabled,
      notification.createdAt,
      !viewedAt ? undefined : ValidDate.now()
    )

    const result = await this.repo.update( newNotification )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( newNotification )
  }
}
