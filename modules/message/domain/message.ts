import { UUID }          from "@/modules/shared/domain/value_objects/uuid"
import { ValidDate }     from "@/modules/shared/domain/value_objects/valid_date"
import {
  ValidString
}                        from "@/modules/shared/domain/value_objects/valid_string"
import { Errors }        from "@/modules/shared/domain/exceptions/errors"
import {
  BaseException
}                        from "@/modules/shared/domain/exceptions/base_exception"
import { MessageType }   from "@/modules/message/domain/message_type"
import { MessageStatus } from "@/modules/message/domain/message_status"

export class Message {
  private constructor(
    readonly id: UUID,
    readonly chatId: UUID,
    readonly userId: UUID,
    readonly content: ValidString,
    readonly type: ValidString,
    readonly status: ValidString,
    readonly createdAt: ValidDate
  )
  {
  }

  static create(
    id: string,
    chatId: string,
    userId: string,
    content: string,
    type: string,
    status: string
  ): Message | Errors {
    return Message.fromPrimitives(
      id,
      chatId,
      userId,
      content,
      type,
      status,
      ValidDate.nowUTC()
    )
  }

  static fromPrimitivesThrow(
    id: string,
    chatId: string,
    userId: string,
    content: string,
    type: string,
    status: string,
    createdAt: Date | string
  ): Message {
    return new Message(
      UUID.from( id ),
      UUID.from( chatId ),
      UUID.from( userId ),
      ValidString.from( content ),
      ValidString.from( type ),
      ValidString.from( status ),
      ValidDate.from( createdAt )
    )
  }

  static fromPrimitives(
    id: string,
    chatId: string,
    userId: string,
    content: string,
    type: string,
    status: string,
    createdAt: Date | string
  ): Message | Errors {
    const errors = []

    const idVO = wrapType( () => UUID.from( id ) )
    if ( idVO instanceof BaseException ) {
      errors.push( idVO )
    }

    const chatIdVO = wrapType( () => UUID.from( chatId ) )
    if ( chatIdVO instanceof BaseException ) {
      errors.push( chatIdVO )
    }

    const userIdVO = wrapType( () => UUID.from( userId ) )
    if ( userIdVO instanceof BaseException ) {
      errors.push( userIdVO )
    }

    const contentVO = wrapType(
      () => ValidString.from( content ) )
    if ( contentVO instanceof BaseException ) {
      errors.push( contentVO )
    }

    const typeVO = wrapType(
      () => MessageType.from( type ) )
    if ( typeVO instanceof BaseException ) {
      errors.push( typeVO )
    }

    const statusVO = wrapType(
      () => MessageStatus.from( status ) )
    if ( statusVO instanceof BaseException ) {
      errors.push( statusVO )
    }

    const createdAtVO = wrapType(
      () => ValidDate.from( createdAt ) )
    if ( createdAtVO instanceof BaseException ) {
      errors.push( createdAtVO )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new Message(
      idVO,
      chatIdVO,
      userIdVO,
      contentVO,
      typeVO,
      statusVO,
      createdAtVO
    )
  }
}