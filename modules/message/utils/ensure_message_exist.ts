import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import { wrapType }                    from "@/modules/shared/utils/wrap_type"
import {
  UUID
}                                      from "@/modules/shared/domain/value_objects/uuid"
import {
  DataNotFoundException
}                                      from "@/modules/shared/domain/exceptions/data_not_found_exception"
import {
  MessageDAO
}                                      from "@/modules/message/domain/message_dao"
import { Message }                     from "@/modules/message/domain/message"

export const ensureMessageExist = async ( dao: MessageDAO, messageId: string ): Promise<Either<BaseException[], Message>> =>{
  const vid = wrapType(()=>UUID.from(messageId))

  if (vid instanceof BaseException) {
    return left([vid])
  }
  const message = await dao.getById(vid as UUID)

  if (isLeft(message)) {
    return left(message.left)
  }

  if(message.right.id.toString() !== messageId) {
    return left( [new DataNotFoundException()] )
  }

  return right(message.right)
}