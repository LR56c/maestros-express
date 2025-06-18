import {
  NotificationRepository
}                              from "@/modules/notification/domain/notification_repository"
import type { Either }         from "fp-ts/Either"
import { isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import {
  type NotificationRequest
}                              from "@/modules/notification/application/notification_request"
import {
  Notification
}                              from "@/modules/notification/domain/notification"
import { wrapType }            from "@/modules/shared/utils/wrap_type"
import {
  ValidInteger
}                              from "@/modules/shared/domain/value_objects/valid_integer"
import {
  ValidString
}                              from "@/modules/shared/domain/value_objects/valid_string"
import {
  DataAlreadyExistException
}                              from "@/modules/shared/domain/exceptions/data_already_exist_exception"
import {
  Errors
}                              from "@/modules/shared/domain/exceptions/errors"

export class SendNotification {
  constructor( private readonly repo: NotificationRepository ) {
  }

  private async validateNotificationData( json: Record<string, any> ): Promise<Either<BaseException[], Record<string, any>>> {
    const errors = []
    const title  = wrapType( () => ValidString.from( json.title ) )

    if ( title instanceof BaseException ) {
      errors.push( title )
    }

    const notificationFrom = wrapType(
      () => ValidString.from( json.notification_from ) )

    if ( notificationFrom instanceof BaseException ) {
      errors.push( notificationFrom )
    }

    const contentFrom = wrapType( () => ValidString.from( json.content_from ) )

    if ( contentFrom instanceof BaseException ) {
      errors.push( contentFrom )
    }

    const redirectUrl = wrapType( () => ValidString.from( json.redirect_url ) )

    if ( redirectUrl instanceof BaseException ) {
      errors.push( redirectUrl )
    }

    if ( errors.length > 0 ) {
      return left( errors )
    }

    return right( {
      title            : (
        title as ValidString
      ).value,
      notification_from: (
        notificationFrom as ValidString
      ).value,
      content_from     : (
        contentFrom as ValidString
      ).value,
      redirect_url     : (
        redirectUrl as ValidString
      ).value
    } )
  }

  private async ensureNotificationExist( id: string ): Promise<Either<BaseException[], boolean>> {
    const existResult = await this.repo.search( {
      id: id
    }, ValidInteger.from( 1 ) )

    if ( isLeft( existResult ) ) {
      return left( existResult.left )
    }

    if ( existResult.right.length > 0 &&
      existResult.right[0]!.id.toString() === id )
    {
      return left( [new DataAlreadyExistException()] )
    }
    return right( true )
  }


  async execute( dto: NotificationRequest ): Promise<Either<BaseException[], Notification>> {

    const data = await this.validateNotificationData( dto.data )

    if ( isLeft( data ) ) {
      return left( data.left )
    }

    const notificationNotExist = await this.ensureNotificationExist( dto.id )

    if ( isLeft( notificationNotExist ) ) {
      return left( notificationNotExist.left )
    }

    const notification = Notification.create(
      dto.id,
      dto.user_id,
      data.right
    )

    if ( notification instanceof Errors ) {
      return left( notification.values )
    }

    const result = await this.repo.send( notification, dto.tokens )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( notification )
  }
}
