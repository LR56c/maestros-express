import { PrismaClient }        from "@/lib/generated/prisma"
import { ChatDAO }             from "@/modules/chat/domain/chat_dao"
import { Chat }                from "@/modules/chat/domain/chat"
import {
  UUID
}                              from "@/modules/shared/domain/value_objects/uuid"
import { Either, left, right } from "fp-ts/Either"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import {
  InfrastructureException
}                              from "@/modules/shared/domain/exceptions/infrastructure_exception"
import {
  Errors
}                              from "@/modules/shared/domain/exceptions/errors"
import {
  DataNotFoundException
}                              from "@/modules/shared/domain/exceptions/data_not_found_exception"
import { UserAuth }            from "@/modules/user/domain/user"
import { Message }             from "@/modules/message/domain/message"

export class PrismaChatData implements ChatDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  async add( chat: Chat ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.chat.create( {
        data: {
          id               : chat.id.toString(),
          subject          : chat.subject?.value,
          quotationAccepted: chat.quotationAccepted
            ? chat.quotationAccepted.value
            : null,
          acceptedDate     : chat.acceptedDate
            ? chat.acceptedDate.toString()
            : null,
          workerArchived   : chat.workerArchived
            ? chat.workerArchived.value
            : null,
          createdAt        : chat.createdAt.toString(),
          workerId         : chat.worker.userId.toString(),
          clientId         : chat.client.userId.toString()
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  private mapToChat( response: any ): Chat | Errors {
    const worker       = response.worker
    const workerMapped = UserAuth.fromPrimitives(
      worker.id,
      worker.email,
      worker.username,
      worker.name,
      worker.createdAt,
      worker.role,
      worker.status,
      worker.avatar
    )

    if ( workerMapped instanceof Errors ) {
      return workerMapped
    }

    const client       = response.client
    const clientMapped = UserAuth.fromPrimitives(
      client.id,
      client.email,
      client.username,
      client.name,
      client.createdAt,
      client.role,
      client.status,
      client.avatar
    )

    if ( clientMapped instanceof Errors ) {
      return clientMapped
    }

    // const messages: Message[] = []
    //
    // for ( const m of response.messages ) {
    //   const message = Message.fromPrimitives(
    //     m.id,
    //     m.chatId,
    //     m.userId,
    //     m.content,
    //     m.type,
    //     m.status,
    //     m.createdAt
    //   )
    //
    //   if ( message instanceof Errors ) {
    //     return message
    //   }
    //
    //   messages.push( message )
    // }


    return Chat.fromPrimitives(
      response.id,
      workerMapped,
      clientMapped,
      response.createdAt,
      response.subject,
      // messages,
      [],
      response.acceptedDate ? response.acceptedDate : undefined,
      response.quotationAccepted ? response.quotationAccepted : undefined,
      response.workerArchived ? response.workerArchived : undefined
    )
  }

  async getById( id: UUID ): Promise<Either<BaseException[], Chat>> {
    try {
      const response = await this.db.chat.findUnique( {
        where  : {
          id: id.toString()
        },
        include: {
          worker  : true,
          client  : true,
          messages: true
        }
      } )

      if ( !response ) {
        return left( [new DataNotFoundException()] )
      }

      const mapped = this.mapToChat( response )

      if ( mapped instanceof Errors ) {
        return left( mapped.values )
      }

      return right( mapped )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }

  async getByUser( userId: UUID ): Promise<Either<BaseException[], Chat[]>> {
    try {
      const result = await this.db.chat.findMany( {
        where  : {
          OR: [
            { clientId: userId.toString() },
            { workerId: userId.toString() }
          ]
        },
        include: {
          worker  : true,
          client  : true,
          // messages: true
        }
      } )

      const chats: Chat[] = []
      for ( const response of result ) {
        const mapped = this.mapToChat( response )

        if ( mapped instanceof Errors ) {
          return left( mapped.values )
        }
        chats.push( mapped )
      }

      return right( chats )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }

  async update( chat: Chat ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.chat.update( {
        where: { id: chat.id.toString() },
        data : {
          subject          : chat.subject?.value,
          quotationAccepted: chat.quotationAccepted
            ? chat.quotationAccepted.value
            : null,
          acceptedDate     : chat.acceptedDate
            ? chat.acceptedDate.toString()
            : null,
          workerArchived   : chat.workerArchived
            ? chat.workerArchived.value
            : null
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }
}