import { PrismaClient }        from "@/lib/generated/prisma"
import {
  WorkerBookingDAO
}                              from "@/modules/worker_booking/domain/worker_booking_dao"
import {
  UUID
}                              from "@/modules/shared/domain/value_objects/uuid"
import { Either, left, right } from "fp-ts/Either"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import {
  WorkerBooking
}                              from "@/modules/worker_booking/domain/worker_booking"
import {
  ValidInteger
}                              from "@/modules/shared/domain/value_objects/valid_integer"
import {
  ValidString
}                              from "@/modules/shared/domain/value_objects/valid_string"
import * as changeCase         from "change-case"
import {
  Errors
}                              from "@/modules/shared/domain/exceptions/errors"
import {
  InfrastructureException
}                              from "@/modules/shared/domain/exceptions/infrastructure_exception"

export class PrismaWorkerBookingData implements WorkerBookingDAO{
  constructor( private readonly db: PrismaClient ) {
  }

  async cancel( id: UUID ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.workerBooking.delete({
        where: {
          id: id.toString()
        }
      })
      // await this.db.workerBooking.update( {
      //   where: {
      //     id: id.toString()
      //   },
      //   data : {
      //     status: WorkingBookingStatusEnum.AVAILABLE
      //   }
      // } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async request( book: WorkerBooking ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.workerBooking.create( {
        data: {
          id        : book.id.toString(),
          workerId  : book.workerId.toString(),
          clientId  : book.clientId.toString(),
          status    : book.status.value,
          date      : book.date.toString(),
          createdAt : book.createdAt.toString()
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async search( query: Record<string, any>, limit?: ValidInteger, skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[], WorkerBooking[]>> {
    try {
      const where = {}
      if ( query.id ) {
        // @ts-ignore
        where["id"] = {
          equals:  query.id
        }
      }
      const orderBy = {}
      if ( sortBy ) {
        const key    = changeCase.camelCase( sortBy.value )
        // @ts-ignore
        orderBy[key] = sortType ? sortType.value : "desc"
      }
      const offset               = skip ? parseInt( skip.value ) : 0
      const response             = await this.db.workerBooking.findMany( {
        where  : where,
        orderBy: orderBy,
        skip   : offset,
        take   : limit?.value
      } )
      const bookings: WorkerBooking[] = []
      for ( const book of response ) {
        const mapped = WorkerBooking.fromPrimitives(
          book.id.toString(),
          book.workerId.toString(),
          book.clientId.toString(),
          book.status,
          book.date.toString(),
          book.createdAt
        )
        if ( mapped instanceof Errors ) {
          return left( mapped.values )
        }
        bookings.push( mapped )
      }
      return right( bookings )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }

  async update( book: WorkerBooking ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.workerBooking.update( {
        where: { id: book.id.toString() },
        data : {
          status  : book.status.value,
          date    : book.date.toString()
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }
}