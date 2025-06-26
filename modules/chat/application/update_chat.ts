import { ChatDAO } from "@/modules/chat/domain/chat_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
} from "@/modules/shared/domain/exceptions/base_exception"
import {
  ChatResponse
} from "@/modules/chat/application/chat_response"
import {
  ensureChatExist
} from "@/modules/chat/utils/ensure_chat_exist"
import { Chat } from "@/modules/chat/domain/chat"
import {
  Errors
} from "@/modules/shared/domain/exceptions/errors"
import { ChatUpdateDTO } from "@/modules/chat/application/chat_update_dto"

export class UpdateChat {
  constructor( private readonly dao: ChatDAO ) {
  }

  async execute( chat: ChatUpdateDTO ): Promise<Either<BaseException[], Chat>> {
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

    return right( updatedChat )
  }

}