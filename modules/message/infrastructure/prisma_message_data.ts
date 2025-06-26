import { PrismaClient } from "@/lib/generated/prisma"
import { MessageDAO }   from "@/modules/message/domain/message_dao"
import { Message }             from "@/modules/message/domain/message"
import { Either, left, right } from "fp-ts/Either"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import { UUID }         from "@/modules/shared/domain/value_objects/uuid"
import {
  InfrastructureException
}                       from "@/modules/shared/domain/exceptions/infrastructure_exception"
import { Errors }       from "@/modules/shared/domain/exceptions/errors"
import {
  DataNotFoundException
} from "@/modules/shared/domain/exceptions/data_not_found_exception"
import { boolean }             from "fp-ts"

export class PrismaMessageData implements MessageDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  async add( message: Message ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.message.create( {
        data: {
          id       : message.id.toString(),
          content  : message.content.value,
          status   : message.status.value,
          type     : message.type.value,
          createdAt: message.createdAt.toString(),
          userId   : message.userId.toString(),
          chatId   : message.chatId.toString()
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async getByChat( chatId: UUID ): Promise<Either<BaseException[], Message[]>> {
    try {
      const response = await this.db.message.findMany( {
        where: {
          chatId: chatId.toString()
        }
      } )

      const messages: Message[] = []

      for ( const message of response ) {
        const msg = Message.fromPrimitives(
          message.id,
          message.chatId,
          message.userId,
          message.content,
          message.type,
          message.status,
          message.createdAt,
        )

        if ( msg instanceof Errors ) {
          return left( msg.values )
        }

        messages.push( msg )
      }

      return right( messages )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }


  async getById( id: UUID ): Promise<Either<BaseException[], Message>> {
    try {
      const response = await this.db.message.findUnique( {
        where: {
          id: id.toString()
        }
      } )

      if ( !response ) {
        return left( [new DataNotFoundException()] )
      }

      const message = Message.fromPrimitives(
        response.id,
        response.chatId,
        response.userId,
        response.content,
        response.type,
        response.status,
        response.createdAt,
      )

      if ( message instanceof Errors ) {
        return left( message.values )
      }

      return right( message )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }

  async getByUser( userId: UUID ): Promise<Either<BaseException[], Message[]>> {
    try {
      const response = await this.db.message.findMany( {
        where: {
          userId: userId.toString()
        }
      } )

      const messages: Message[] = []

      for ( const message of response ) {
        const msg = Message.fromPrimitives(
          message.id,
          message.chatId,
          message.userId,
          message.content,
          message.type,
          message.status,
          message.createdAt,
        )

        if ( msg instanceof Errors ) {
          return left( msg.values )
        }

        messages.push( msg )
      }

      return right( messages )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }

  async update( message: Message ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.message.update( {
        where: {
          id: message.id.toString()
        },
        data : {
          content: message.content.value,
          status : message.status.value,
          type   : message.type.value
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }
}