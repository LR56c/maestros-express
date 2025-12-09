import { Notification }              from "../domain/notification"
import { type NotificationResponse } from "./notification_response"
import {
  Errors
}                                    from "../../shared/domain/exceptions/errors"
import { wrapType, wrapTypeDefault } from "../../shared/utils/wrap_type"
import {
  BaseException
}                                    from "../../shared/domain/exceptions/base_exception"
import {
  ValidString
}                                    from "../../shared/domain/value_objects/valid_string"
import {
  UUID
}                                    from "../../shared/domain/value_objects/uuid"
import {
  ValidDate
}                                    from "../../shared/domain/value_objects/valid_date"

export class NotificationMapper {
  static toResponse( notification: Notification ): NotificationResponse {
    return {
      id               : notification.id.toString(),
      icon             : notification.data.icon,
      title            : notification.data.title,
      notification_from: notification.data.notification_from,
      content_from     : notification.data.content_from,
      redirect_url     : notification.data.redirect_url,
      viewed_at        : notification.viewedAt?.toString(),
      created_at       : notification.createdAt.toString()
    }
  }

  static toJSON( notification: NotificationResponse ): Record<string, any> {
    return {
      id        : notification.id.toString(),
      icon      : notification.icon,
      data      : {
        title            : notification.title,
        notification_from: notification.notification_from,
        content_from     : notification.content_from,
        redirect_url     : notification.redirect_url
      },
      viewed_at : notification.viewed_at,
      created_at: notification.created_at
    }
  }

  static fromJSON( json: Record<string, any> ): NotificationResponse | Errors {
    const errors = []

    const id = wrapType(
      () => UUID.from( json.id ) )

    if ( id instanceof BaseException ) {
      errors.push( id )
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

    const icon = wrapType(
      () => ValidString.from( json.icon ) )

    if ( icon instanceof BaseException ) {
      errors.push( icon )
    }

    const contentFrom = wrapType(
      () => ValidString.from( json.content_from ) )

    if ( contentFrom instanceof BaseException ) {
      errors.push( contentFrom )
    }

    const redirectUrl = wrapType(
      () => ValidString.from( json.redirect_url ) )

    if ( redirectUrl instanceof BaseException ) {
      errors.push( redirectUrl )
    }

    const viewed_at = wrapTypeDefault( undefined,
      ( value ) => ValidDate.from( value ), json.viewed_at )

    if ( viewed_at instanceof BaseException ) {
      errors.push( viewed_at )
    }

    const created_at = wrapType(
      () => ValidDate.from( json.created_at ) )

    if ( created_at instanceof BaseException ) {
      errors.push( created_at )
    }


    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      id               : (
        id as UUID
      ).toString(),
      icon             : (
        icon as ValidString
      ).value,
      created_at       : (
        created_at as ValidDate
      ).toString(),
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
      ).value,
      viewed_at        : viewed_at ? (
        viewed_at as ValidDate
      ).toString() : undefined
    }
  }
}
