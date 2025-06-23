import { MessageDAO } from "@/modules/message/domain/message_dao"
import type { Either } from "fp-ts/Either"
import {
  BaseException
} from "@/modules/shared/domain/exceptions/base_exception"
import { Message } from "@/modules/message/domain/message"
import { UUID } from "@/modules/shared/domain/value_objects/uuid"

export class GetMessageByUser {
  constructor(private readonly dao : MessageDAO) {
  }

  async execute( userId: string ): Promise<Either<BaseException[], Message[]>>{
    const vUserId = wrapType( () => UUID.from( userId ) )

    if ( vUserId instanceof BaseException ) {
      return left( [vUserId] )
    }

    return await this.dao.getByUser( vUserId )
  }

}