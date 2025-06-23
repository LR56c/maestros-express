import { PrismaClient }        from "@/lib/generated/prisma"
import { ChatDAO }             from "@/modules/chat/domain/chat_dao"
import { Chat }                from "@/modules/chat/domain/chat"
import { UUID }                from "@/modules/shared/domain/value_objects/uuid"
import { Either, left, right } from "fp-ts/Either"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import {
  InfrastructureException
}                              from "@/modules/shared/domain/exceptions/infrastructure_exception"
import { Errors }              from "@/modules/shared/domain/exceptions/errors"

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
          workerId         : chat.workerId.toString(),
          clientId         : chat.clientId.toString()
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async getById( id: UUID ): Promise<Either<BaseException[], Chat>> {
    try {
      const response = await this.db.chat.findUniqueOrThrow( {
        where: {
          id: id.toString()
        }
      } )

      const chat = Chat.fromPrimitives(
        response.id,
        response.workerId,
        response.clientId,
        response.createdAt,
        response.subject,
        response.acceptedDate ? response.acceptedDate : undefined,
        response.quotationAccepted ? response.quotationAccepted : undefined,
        response.workerArchived ? response.workerArchived : undefined
      )

      if ( chat instanceof Errors ) {
        return left( chat.values )
      }

      return right( chat )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }

  async getByUser( userId: UUID ): Promise<Either<BaseException[], Chat[]>> {
    try {
      const response = await this.db.chat.findMany( {
        where: {
          clientId: userId.toString()
        }
      } )

      const chats: Chat[] = []
      for ( const e of response ) {
        const chat = Chat.fromPrimitives(
          e.id,
          e.workerId,
          e.clientId,
          e.createdAt,
          e.subject,
          e.acceptedDate ? e.acceptedDate : undefined,
          e.quotationAccepted ? e.quotationAccepted : undefined,
          e.workerArchived ? e.workerArchived : undefined
        )

        if ( chat instanceof Errors ) {
          return left( chat.values )
        }

        chats.push( chat )
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
          quotationAccepted: chat.quotationAccepted ? chat.quotationAccepted.value : null,
          acceptedDate     : chat.acceptedDate ? chat.acceptedDate.toString() : null,
          workerArchived   : chat.workerArchived ? chat.workerArchived.value : null
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }
}