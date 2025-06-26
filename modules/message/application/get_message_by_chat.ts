import { MessageDAO }   from "@/modules/message/domain/message_dao"
import { Either, left } from "fp-ts/Either"
import {
  BaseException
}                       from "@/modules/shared/domain/exceptions/base_exception"
import { Message } from "@/modules/message/domain/message"
import { UUID } from "@/modules/shared/domain/value_objects/uuid"
import { wrapType } from "@/modules/shared/utils/wrap_type"

export class GetMessageByChat {
  constructor(private readonly dao : MessageDAO) {
  }

  async execute( chatId: string ): Promise<Either<BaseException[], Message[]>>{
    const vUserId = wrapType( () => UUID.from( chatId ) )

    if ( vUserId instanceof BaseException ) {
      return left( [vUserId] )
    }

    return await this.dao.getByChat( vUserId )
  }

}