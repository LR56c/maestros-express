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
  ValidDate
}                                    from "@/modules/shared/domain/value_objects/valid_date"
import {
  UUID
}                                    from "@/modules/shared/domain/value_objects/uuid"
import {
  InvalidUUIDException
}                                    from "@/modules/shared/domain/exceptions/invalid_uuid_exception"

export class NotificationMapper {
  static toResponse( notification: Notification ): NotificationResponse {
    return {
      id               : notification.id.toString(),
      title            : notification.data.title,
      notification_from: notification.data.notification_from,
      content_from     : notification.data.content_from,
      redirect_url     : notification.data.redirect_url,
      viewed_at        : notification.viewedAt?.value
    }
  }

  static toJSON( notification: NotificationResponse ): Record<string, any> {
    return {
      id       : notification.id.toString(),
      data     : {
        title            : notification.title,
        notification_from: notification.notification_from,
        content_from     : notification.content_from,
        redirect_url     : notification.redirect_url
      },
      viewed_at: notification.viewed_at
    }
  }

  static fromJSON( json: Record<string, any> ): NotificationResponse | Errors {
    const errors = []

    const id = wrapType<UUID, InvalidUUIDException>(
      () => UUID.from( json.id ) )

    if ( id instanceof BaseException ) {
      errors.push( id )
    }

    const title = wrapType( () => ValidString.from( json.data.title ) )

    if ( title instanceof BaseException ) {
      errors.push( title )
    }

    const notificationFrom = wrapType(
      () => ValidString.from( json.data.notification_from ) )

    if ( notificationFrom instanceof BaseException ) {
      errors.push( notificationFrom )
    }

    const contentFrom = wrapType(
      () => ValidString.from( json.data.content_from ) )

    if ( contentFrom instanceof BaseException ) {
      errors.push( contentFrom )
    }

    const redirectUrl = wrapType(
      () => ValidString.from( json.data.redirect_url ) )

    if ( redirectUrl instanceof BaseException ) {
      errors.push( redirectUrl )
    }

    const viewed_at = wrapTypeDefault( undefined,
      ( value ) => ValidDate.from( value ), json.viewed_at )

    if ( viewed_at instanceof BaseException ) {
      errors.push( viewed_at )
    }


    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      id               : (
        id as UUID
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
      ).value : undefined
    }
  }
}
