import { Chat }                      from "@/modules/chat/domain/chat"
import {
  ChatResponse
}                                    from "@/modules/chat/application/chat_response"
import {
  Errors
}                                    from "@/modules/shared/domain/exceptions/errors"
import { wrapType, wrapTypeDefault } from "@/modules/shared/utils/wrap_type"
import {
  UUID
}                                    from "@/modules/shared/domain/value_objects/uuid"
import {
  BaseException
}                                    from "@/modules/shared/domain/exceptions/base_exception"
import {
  ValidString
}                                    from "@/modules/shared/domain/value_objects/valid_string"
import {
  ValidDate
}                                    from "@/modules/shared/domain/value_objects/valid_date"
import {
  MessageMapper
}                                    from "@/modules/message/application/message_mapper"
import { Message }                   from "@/modules/message/domain/message"
import {
  MessageResponse
}                                    from "@/modules/message/application/message_response"
import {
  UserMapper
}                                    from "@/modules/user/application/user_mapper"
import {
  UserResponse
}                                    from "@/modules/user/application/models/user_response"

export class ChatMapper {
  static toDTO( chat: Chat ): ChatResponse {
    return {
      id                : chat.id.toString(),
      client            : UserMapper.toDTO( chat.client ),
      worker            : UserMapper.toDTO( chat.worker ),
      messages          : chat.messages.map( MessageMapper.toDTO ),
      subject           : chat.subject?.value,
      accepted_date     : chat.acceptedDate?.value,
      quotation_accepted: chat.quotationAccepted?.value,
      worker_archived   : chat.workerArchived?.value,
      created_at        : chat.createdAt.toString()
    }
  }

  static toJSON( chat: ChatResponse ): Record<string, any> {
    return {
      id                : chat.id,
      client_id         : chat.client,
      worker_id         : chat.worker,
      subject           : chat.subject,
      accepted_date     : chat.accepted_date,
      quotation_accepted: chat.quotation_accepted,
      worker_archived   : chat.worker_archived,
      created_at        : chat.created_at,
      messages          : chat.messages.map( MessageMapper.toJSON )
    }
  }

  static fromJSON( chat: Record<string, any> ): ChatResponse | Errors {
    const errors = []

    const id = wrapType(
      () => UUID.from( chat.id ) )

    if ( id instanceof BaseException ) {
      errors.push( id )
    }

    const client = UserMapper.fromJSON( chat.client )

    if ( client instanceof Errors ) {
      errors.push( ...client.values )
    }

    const worker = UserMapper.fromJSON( chat.worker )

    if ( worker instanceof Errors ) {
      errors.push( ...worker.values )
    }

    const subject = wrapTypeDefault( undefined,
      ( value ) => ValidString.from( value ), chat.subject )

    if ( subject instanceof BaseException ) {
      errors.push( subject )
    }

    const acceptedDate = wrapTypeDefault( undefined,
      ( value ) => ValidDate.from( value ), chat.accepted_date )

    if ( acceptedDate instanceof BaseException ) {
      errors.push( acceptedDate )
    }

    const quotationAccepted = wrapTypeDefault( undefined,
      ( value ) => UUID.from( value ), chat.quotation_accepted )

    if ( quotationAccepted instanceof BaseException ) {
      errors.push( quotationAccepted )
    }

    const workerArchived = wrapTypeDefault( undefined,
      ( value ) => ValidDate.from( value ), chat.worker_archived )

    if ( workerArchived instanceof BaseException ) {
      errors.push( workerArchived )
    }

    const createdAt = wrapType(
      () => ValidDate.from( chat.created_at ) )

    if ( createdAt instanceof BaseException ) {
      errors.push( createdAt )
    }

    const messages: MessageResponse[] = []
    for ( const el of chat.messages ) {
      const message = MessageMapper.fromJSON( el )
      if ( message instanceof Errors ) {
        return message
      }
      messages.push( message )
    }


    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      id                : (
        id as UUID
      ).toString(),
      messages,
      client            : client as UserResponse,
      worker            : worker as UserResponse,
      subject           : (
        subject as ValidString
      ).value,
      accepted_date     : acceptedDate ? (
        acceptedDate as ValidDate
      ).value : undefined,
      quotation_accepted: quotationAccepted ? (
        quotationAccepted as UUID
      ).value : undefined,
      worker_archived   : workerArchived ? (
        workerArchived as ValidDate
      ).value : undefined,
      created_at        : (
        createdAt as ValidDate
      ).value
    }
  }

  static toDomain( json: Record<string, any> ): Chat | Errors {
    const messages: Message[] = []
    for ( const el of json.messages ) {
      const message = MessageMapper.toDomain( el )
      if ( message instanceof Errors ) {
        return message
      }
      messages.push( message )
    }

    return Chat.fromPrimitives(
      json.id,
      json.worker,
      json.client,
      json.created_at,
      json.subject,
      messages,
      json.accepted_date,
      json.quotation_accepted,
      json.worker_archived
    )
  }
}