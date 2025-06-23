import { MessageDAO }  from "@/modules/message/domain/message_dao"
import { Message }               from "@/modules/message/domain/message"
import { Either, isLeft, right } from "fp-ts/Either"
import {
  BaseException
}                                from "@/modules/shared/domain/exceptions/base_exception"
import { MessageDTO }  from "@/modules/message/application/message_dto"
import { Errors }      from "@/modules/shared/domain/exceptions/errors"

export class UpdateMessage {
  constructor( private readonly dao: MessageDAO ) {
  }

  async execute(
    message: MessageDTO ): Promise<Either<BaseException[], boolean>> {
    const existResult = await ensureMessageExist( this.dao, message.id )

    if ( isLeft( existResult ) ) {
      return left( existResult.left )
    }

    const oldMessage = existResult.right

    const newMessage = Message.fromPrimitives(
      oldMessage.id.toString(),
      oldMessage.chatId.toString(),
      oldMessage.userId.toString(),
      message.content,
      message.type,
      message.type,
      message.status,
      oldMessage.createdAt.toString()
    )

    if ( newMessage instanceof Errors ) {
      return left( newMessage.values )
    }

    const result = await this.dao.update( newMessage )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }

}