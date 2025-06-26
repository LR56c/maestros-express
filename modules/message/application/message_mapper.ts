import { MessageResponse } from "@/modules/message/application/message_response"
import { Message }         from "@/modules/message/domain/message"
import { ZoneDTO }       from "@/modules/zone/application/zone_dto"
import { Errors }        from "@/modules/shared/domain/exceptions/errors"
import { wrapType }      from "@/modules/shared/utils/wrap_type"
import { UUID }          from "@/modules/shared/domain/value_objects/uuid"
import {
  BaseException
}                        from "@/modules/shared/domain/exceptions/base_exception"
import { Zone }          from "@/modules/zone/domain/zone"
import {
  ValidString
}                        from "@/modules/shared/domain/value_objects/valid_string"
import { MessageType }   from "@/modules/message/domain/message_type"
import { MessageStatus } from "@/modules/message/domain/message_status"
import { ValidDate }     from "@/modules/shared/domain/value_objects/valid_date"

export class MessageMapper {
  static toDTO( message: Message ): MessageResponse {
    return {
      id       : message.id.toString(),
      chatId   : message.chatId.toString(),
      userId   : message.userId.toString(),
      content  : message.content.value,
      type     : message.type.value,
      status   : message.status.value,
      createdAt: message.createdAt.value
    }
  }

  static toJSON( message: MessageResponse ): Record<string, any> {
    return {
      id       : message.id,
      content  : message.content,
      type     : message.type,
      status   : message.status,
      createdAt: message.createdAt
    }
  }

  static fromJSON( json: Record<string, any> ): MessageResponse | Errors {
    const errors = []

    const id = wrapType(
      () => UUID.from( json.id ) )

    if ( id instanceof BaseException ) {
      errors.push( id )
    }

    const content = wrapType(
      () => ValidString.from( json.content ) )

    if ( content instanceof BaseException ) {
      errors.push( content )
    }

    const type = wrapType(
      () => MessageType.from( json.type ) )

    if ( type instanceof BaseException ) {
      errors.push( type )
    }

    const status = wrapType(
      () => MessageStatus.from( json.status ) )

    if ( status instanceof BaseException ) {
      errors.push( status )
    }

    const createdAt = wrapType(
      () => ValidDate.from( json.created_at ) )

    if ( createdAt instanceof BaseException ) {
      errors.push( createdAt )
    }

    if ( errors.length ) {
      return new Errors( errors )
    }

    return {
      id        : (
        id as UUID
      ).toString(),
      content   : (
        content as ValidString
      ).value,
      type      : (
        type as MessageType
      ).value,
      status    : (
        status as MessageStatus
      ).value,
      created_at: (
        createdAt as ValidDate
      ).value
    }
  }

  static toDomain( json: Record<string, any> ): Message | Errors {
    return Message.fromPrimitives(
      json.id,
      json.chat_id,
      json.user_id,
      json.content,
      json.type,
      json.status,
      json.created_at
    )
  }
}