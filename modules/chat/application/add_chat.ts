import { ChatDAO } from "@/modules/chat/domain/chat_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
} from "@/modules/shared/domain/exceptions/base_exception"
import {
  ChatDTO
} from "@/modules/chat/application/chat_dto"
import {
  ensureSpecialityExist
} from "@/modules/speciality/utils/ensure_speciality_exist"
import {
  containError
} from "@/modules/shared/utils/contain_error"
import {
  DataNotFoundException
} from "@/modules/shared/domain/exceptions/data_not_found_exception"
import {
  ensureChatExist
} from "@/modules/chat/utils/ensure_chat_exist"
import { Chat } from "@/modules/chat/domain/chat"
import {
  Errors
} from "@/modules/shared/domain/exceptions/errors"

export class AddChat {
  constructor( private readonly dao: ChatDAO ) {
  }

  async execute(
    workerId: string,
    clientId: string,
    chat: ChatDTO ): Promise<Either<BaseException[], boolean>> {

    const existResult = await ensureChatExist( this.dao, chat.id )

    if ( isLeft( existResult ) ) {
      if ( !containError( existResult.left, new DataNotFoundException() ) ) {
        return left( existResult.left )
      }
    }

    const newChat = Chat.create(
      chat.id,
      workerId,
      clientId,
      chat.subject,
      chat.accepted_date,
      chat.quotation_accepted,
      chat.worker_archived
    )

    if ( newChat instanceof Errors ) {
      return left( newChat.values )
    }

    const result = await this.dao.add( newChat )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }

}