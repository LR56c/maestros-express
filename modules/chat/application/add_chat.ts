import { ChatDAO }                     from "@/modules/chat/domain/chat_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  containError
}                                      from "@/modules/shared/utils/contain_error"
import {
  DataNotFoundException
}                                      from "@/modules/shared/domain/exceptions/data_not_found_exception"
import {
  ensureChatExist
}                                      from "@/modules/chat/utils/ensure_chat_exist"
import { Chat }                        from "@/modules/chat/domain/chat"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"
import {
  ChatRequest
}                                      from "@/modules/chat/application/chat_request"
import {
  InfrastructureException
}                                      from "@/modules/shared/domain/exceptions/infrastructure_exception"
import {
  SearchUsers
}                                      from "@/modules/user/application/search_auth"

export class AddChat {
  constructor(
    private readonly dao: ChatDAO,
    private readonly searchUser: SearchUsers
  )
  {
  }

  async execute( dto: ChatRequest ): Promise<Either<BaseException[], Chat>> {

    if ( dto.worker_id === dto.client_id ) {
      return left( [
        new InfrastructureException( "Worker and client cannot be the same" )
      ] )
    }

    const existResult = await ensureChatExist( this.dao, dto.id )
    if ( isLeft( existResult ) ) {
      if ( !containError( existResult.left, new DataNotFoundException() ) ) {
        return left( existResult.left )
      }
    }

    const clientExist = await this.searchUser.execute( {
      id: dto.worker_id
    }, 1 )

    if ( isLeft( clientExist ) ) {
      return left( clientExist.left )
    }

    const workerExist = await this.searchUser.execute( {
      id: dto.client_id
    }, 1 )

    if ( isLeft( workerExist ) ) {
      return left( workerExist.left )
    }

    const newChat = Chat.create(
      dto.id,
      workerExist.right.items[0],
      clientExist.right.items[0],
      dto.subject,
      []
    )

    if ( newChat instanceof Errors ) {
      return left( newChat.values )
    }

    const result = await this.dao.add( newChat )
    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( newChat )
  }

}