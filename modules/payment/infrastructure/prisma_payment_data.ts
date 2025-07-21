import { PrismaClient }        from "@/lib/generated/prisma"
import { PaymentDAO }          from "@/modules/payment/domain/payment_dao"
import { Payment }             from "@/modules/payment/domain/payment"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import { Either, left, right } from "fp-ts/Either"
import {
  ValidString
}                              from "@/modules/shared/domain/value_objects/valid_string"
import {
  ValidInteger
}                              from "@/modules/shared/domain/value_objects/valid_integer"
import {
  InfrastructureException
}                              from "@/modules/shared/domain/exceptions/infrastructure_exception"
import * as changeCase         from "change-case"
import { Errors }              from "@/modules/shared/domain/exceptions/errors"
import { PaginatedResult }     from "@/modules/shared/domain/paginated_result"

export class PrismaPaymentData implements PaymentDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  async update( payment: Payment ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.payment.update( {
        where: {
          id: payment.id.toString()
        },
        data : {
          status     : payment.status.value,
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }



  async add( payment: Payment ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.payment.create( {
        data: {
          id         : payment.id.toString(),
          serviceId  : payment.serviceId.toString(),
          userId     : payment.clientId.toString(),
          serviceType: payment.serviceType.value,
          token      : payment.token.value,
          status     : payment.status.value,
          total      : payment.total.value,
          valueFormat: payment.valueFormat.value,
          createdAt  : payment.createdAt.toString()
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async search( query: Record<string, any>, limit?: ValidInteger,
    skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[], PaginatedResult<Payment>>> {
    try {
      const where = {}
      if ( query.id ) {
        // @ts-ignore
        where["id"] = {
          equals: query.id
        }
      }
      if ( query.service_id ) {
        // @ts-ignore
        where["serviceId"] = {
          equals: query.service_id
        }
      }
      const orderBy = {}
      if ( sortBy ) {
        const key    = changeCase.camelCase( sortBy.value )
        // @ts-ignore
        orderBy[key] = sortType ? sortType.value : "desc"
      }

      const offset   = skip ? parseInt( skip.value ) : 0
      const results = await this.db.$transaction([
        this.db.payment.findMany( {
          where  : where,
          orderBy: orderBy,
          skip   : offset,
          take   : limit?.value
        } ),
        this.db.payment.count( {
          where: where
        } )
      ])
      const [ response, total ] = results
      const result: Payment[] = []
      for ( const e of response ) {
        const mapped = Payment.fromPrimitives(
          e.id.toString(),
          e.serviceId.toString(),
          e.serviceType,
          e.userId.toString(),
          e.token,
          e.status,
          e.total.toNumber(),
          e.valueFormat,
          e.createdAt
        )
        if ( mapped instanceof Errors ) {
          return left( mapped.values )
        }
        result.push( mapped )
      }
      return right( {
        items: result,
        total: total
      } )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }
}