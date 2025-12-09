import { type Either,isLeft, left, right }     from "fp-ts/lib/Either"
import {
  BaseException
}                                  from "../../shared/domain/exceptions/base_exception"
import { wrapType }                from "../../shared/utils/wrap_type"
import {
  ValidString
}                                  from "../../shared/domain/value_objects/valid_string"
import { NotificationRequest }     from "./notification_request"
import {
  Errors
}                                  from "../../shared/domain/exceptions/errors"
import { ensureNotificationExist } from "../utils/ensure_notification_exist"
import { containError }            from "../../shared/utils/contain_error"
import {
  DataNotFoundException
}                                  from "../../shared/domain/exceptions/data_not_found_exception"
import { NotificationRepository }  from "../domain/notification_repository"
import { NotificationDataDTO }     from "./notification_data_dto"
import { NotificationContent }     from "../domain/notification_content"
import {
  InfrastructureException
}                                  from "../../shared/domain/exceptions/infrastructure_exception"

export class SendNotification {
  constructor(
    private readonly repo: NotificationRepository,
    private readonly dao: NotificationRepository
  )
  {
  }

  private async validateNotificationData( json: Record<string, any> ): Promise<Either<BaseException[], NotificationDataDTO>> {
    const errors = []

    const icon = wrapType( () => ValidString.from( json.icon ) )

    if ( icon instanceof BaseException ) {
      errors.push( icon )
    }

    const title = wrapType( () => ValidString.from( json.title ) )

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
      icon             : (
        icon as ValidString
      ).value,
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


  async execute( dto: NotificationRequest ): Promise<Either<BaseException[], boolean>> {

    if ( !dto.ids || dto.ids.length === 0 || !dto.tokens ||
      dto.tokens.length === 0 )
    {
      return left( [new InfrastructureException( "Ids or tokens are empty" )] )
    }

    const data = await this.validateNotificationData( dto.data )
    if ( isLeft( data ) ) {
      return left( data.left )
    }

    const existResult = await ensureNotificationExist( this.dao,
      dto.id )
    if ( isLeft( existResult ) ) {
      if ( !containError( existResult.left, new DataNotFoundException() ) ) {
        return left( existResult.left )
      }
    }

    const notification = NotificationContent.create(
      dto.id,
      data.right
    )

    if ( notification instanceof Errors ) {
      return left( notification.values )
    }

    const resultNotifications = await this.repo.addBulk( notification, dto.ids )
    if ( isLeft( resultNotifications ) ) {
      return left( [resultNotifications.left] )
    }

    const result = await this.dao.addBulk( notification, dto.ids )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }
}
