import { MessageDAO }                  from "@/modules/message/domain/message_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import { MessageDTO } from "@/modules/message/application/message_dto"
import {
  ensureMessageExist
} from "@/modules/message/utils/ensure_message_exist"
import {
  DataNotFoundException
} from "@/modules/shared/domain/exceptions/data_not_found_exception"
import { containError }         from "@/modules/shared/utils/contain_error"
import { Message }              from "@/modules/message/domain/message"
import { Errors }               from "@/modules/shared/domain/exceptions/errors"

export class AddMessage {
  constructor(private readonly dao : MessageDAO) {
  }

  async execute(
    chatId: string,
    userId: string,
    message : MessageDTO ): Promise<Either<BaseException[], boolean>>{
    const existResult = await ensureMessageExist( this.dao, message.id )

    if ( isLeft( existResult ) ) {
      if ( !containError( existResult.left, new DataNotFoundException() ) ) {
        return left( existResult.left )
      }
    }

    const newMessage = Message.create(
      message.id,
      chatId,
      userId,
      message.content,
      message.type,
      message.status,
    )

    if ( newMessage instanceof Errors ) {
      return left( newMessage.values )
    }

    const result = await this.dao.add( newMessage )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }

}