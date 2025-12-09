import { Errors }                      from "../../shared/domain/exceptions/errors.js"
import { wrapType }                    from "../../shared/utils/wrap_type.js"
import {
  BaseException
}                                      from "../../shared/domain/exceptions/base_exception.js"
import {
  UUID
}                                      from "../../shared/domain/value_objects/uuid.js"
import {
  ValidDate
}                                      from "../../shared/domain/value_objects/valid_date.js"
import { NotificationContent }         from "../domain/notification_content"
import { NotificationContentResponse } from "./notification_content_response"

export class NotificationContentMapper {
  static toResponse( notification: NotificationContent ): NotificationContentResponse {
    return {
      id        : notification.id.toString(),
      data      : notification.data,
      created_at: notification.createdAt.toString()
    }
  }

  static toJSON( notification: NotificationContentResponse ): Record<string, any> {
    return {
      id        : notification.id.toString(),
      data      : notification.data,
      created_at: notification.created_at
    }
  }

  static fromJSON( json: Record<string, any> ): NotificationContentResponse | Errors {
    const errors = []

    const id = wrapType(
      () => UUID.from( json.id ) )

    if ( id instanceof BaseException ) {
      errors.push( id )
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
      id        : (
        id as UUID
      ).toString(),
      data      : json.data,
      created_at: (
        created_at as ValidDate
      ).toString()
    }
  }
}
