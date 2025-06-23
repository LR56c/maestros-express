import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
} from "@/modules/shared/domain/exceptions/base_exception"
import { wrapType } from "@/modules/shared/utils/wrap_type"
import { UUID } from "@/modules/shared/domain/value_objects/uuid"
import {
  DataNotFoundException
} from "@/modules/shared/domain/exceptions/data_not_found_exception"
import { ChatDAO }                     from "@/modules/chat/domain/chat_dao"
import { Chat }                        from "@/modules/chat/domain/chat"

export const ensureChatExist = async ( dao: ChatDAO, chatId: string ): Promise<Either<BaseException[], Chat>> =>{
  const vid = wrapType(()=>UUID.from(chatId))

  if (vid instanceof BaseException) {
    return left([vid])
  }
  const chat = await dao.getById(vid as UUID)

  if (isLeft(chat)) {
    return left(chat.left)
  }

  if(chat.right.id.toString() !== chatId) {
    return left( [new DataNotFoundException()] )
  }

  return right(chat.right)
}