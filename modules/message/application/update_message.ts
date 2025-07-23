import { MessageDAO }                  from "@/modules/message/domain/message_dao"
import { Message }                     from "@/modules/message/domain/message"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"
import {
  MessageUpdateDTO
}                                      from "@/modules/message/application/message_update_dto"
import {
  ensureMessageExist
}                                      from "@/modules/message/utils/ensure_message_exist"

export class UpdateMessage {
  constructor( private readonly dao: MessageDAO ) {
  }

  async execute( message: MessageUpdateDTO ): Promise<Either<BaseException[], Message>> {
    const existResult = await ensureMessageExist( this.dao, message.id )
    if ( isLeft( existResult ) ) {
      return left( existResult.left )
    }

    const oldMessage = existResult.right

    const updatedMessage = Message.fromPrimitives(
      oldMessage.id.toString(),
      oldMessage.chatId.toString(),
      oldMessage.userId.toString(),
      oldMessage.content.value,
      oldMessage.type.value,
      message.status,
      oldMessage.createdAt.toString()
    )

    if ( updatedMessage instanceof Errors ) {
      return left( updatedMessage.values )
    }

    const result = await this.dao.update( updatedMessage )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( updatedMessage )
  }

}