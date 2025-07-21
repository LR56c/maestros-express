import { ChatDAO }      from "@/modules/chat/domain/chat_dao"
import { Either, left } from "fp-ts/Either"
import {
  BaseException
}                       from "@/modules/shared/domain/exceptions/base_exception"
import { Chat }         from "@/modules/chat/domain/chat"
import { wrapType }     from "@/modules/shared/utils/wrap_type"
import { UUID }         from "@/modules/shared/domain/value_objects/uuid"

export class GetChatById {
  constructor(private  readonly dao: ChatDAO) {
  }
  async execute( userId : string ): Promise<Either<BaseException[], Chat>>{
    const vUserId = wrapType( () => UUID.from( userId ) )

    if ( vUserId instanceof BaseException ) {
      return left( [vUserId] )
    }

    return await this.dao.getById( vUserId )
  }
}