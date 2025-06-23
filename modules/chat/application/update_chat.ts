import { ChatDAO } from "@/modules/chat/domain/chat_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
} from "@/modules/shared/domain/exceptions/base_exception"
import {
  ChatDTO
} from "@/modules/chat/application/chat_dto"
import {
  ensureChatExist
} from "@/modules/chat/utils/ensure_chat_exist"
import { Chat } from "@/modules/chat/domain/chat"
import {
  Errors
} from "@/modules/shared/domain/exceptions/errors"

export class UpdateChat {
  constructor( private readonly dao: ChatDAO ) {
  }

  async execute( chat: ChatDTO ): Promise<Either<BaseException[], boolean>> {
    const exist = await ensureChatExist( this.dao, chat.id )

    if ( isLeft( exist ) ) {
      return left( exist.left )
    }

    const oldChat = exist.right

    const updatedChat = Chat.fromPrimitives(
      oldChat.id.value,
      oldChat.workerId.value,
      oldChat.clientId.value,
      oldChat.createdAt.value,
      oldChat.subject.value,
      chat.accepted_date ?? oldChat.acceptedDate?.value,
      chat.quotation_accepted ?? oldChat.quotationAccepted?.value,
      chat.worker_archived ?? oldChat.workerArchived?.value
    )

    if ( updatedChat instanceof Errors ) {
      return left( updatedChat.values )
    }

    const result = await this.dao.update( updatedChat )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }

}