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

export class ChatMapper {
  static toDTO( chat: Chat ): ChatResponse {
    return {
      id                : chat.id.toString(),
      client_id         : chat.clientId.toString(),
      worker_id         : chat.workerId.toString(),
      client_name       : chat.clientName.value,
      worker_name       : chat.workerName.value,
      messages          : chat.messages.map( MessageMapper.toDTO ),
      subject           : chat.subject?.value,
      accepted_date     : chat.acceptedDate?.value,
      quotation_accepted: chat.quotationAccepted?.value,
      worker_archived   : chat.workerArchived?.value,
      created_at        : chat.createdAt.value,
    }
  }

  static toJSON( chat: ChatResponse ): Record<string, any> {
    return {
      id                : chat.id,
      client_id         : chat.client_id,
      worker_id         : chat.worker_id,
      client_name       : chat.client_name,
      worker_name       : chat.worker_name,
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

    const clientId = wrapType(
      () => ValidString.from( chat.client_id ) )

    if ( clientId instanceof BaseException ) {
      errors.push( clientId )
    }

    const workerId = wrapType(
      () => ValidString.from( chat.worker_id ) )

    if ( workerId instanceof BaseException ) {
      errors.push( workerId )
    }

    const clientName = wrapType(
      () => ValidString.from( chat.client_name ) )

    if ( clientName instanceof BaseException ) {
      errors.push( clientName )
    }

    const workerName = wrapType(
      () => ValidString.from( chat.worker_name ) )

    if ( workerName instanceof BaseException ) {
      errors.push( workerName )
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

    const messages : MessageResponse[] = []
    for ( const el of chat.messages) {
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
      client_id: (
        clientId as ValidString
      ).value,
      worker_id: (
        workerId as ValidString
      ).value,
      client_name       : (
        clientName as ValidString
      ).value,
      worker_name       : (
        workerName as ValidString
      ).value,
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
    const messages : Message[] = []
    for ( const el of json.messages) {
      const message = MessageMapper.toDomain( el )
      if ( message instanceof Errors ) {
        return message
      }
      messages.push( message )
    }

    return Chat.fromPrimitives(
      json.id,
      json.worker_id,
      json.client_id,
      json.worker_name,
      json.client_name,
      json.created_at,
      json.subject,
      messages,
      json.accepted_date,
      json.quotation_accepted,
      json.worker_archived
    )
  }
}