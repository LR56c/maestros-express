import { PrismaClient }        from "@/lib/generated/prisma"
import {
  QuotationDAO
}                              from "@/modules/quotation/domain/quotation_dao"
import { Quotation }           from "@/modules/quotation/domain/quotation"
import { Either, left, right } from "fp-ts/Either"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import {
  ValidInteger
}                              from "@/modules/shared/domain/value_objects/valid_integer"
import {
  ValidString
}                              from "@/modules/shared/domain/value_objects/valid_string"
import {
  InfrastructureException
}                              from "@/modules/shared/domain/exceptions/infrastructure_exception"
import * as changeCase         from "change-case"
import {
  Errors
}                              from "@/modules/shared/domain/exceptions/errors"
import {
  QuotationDetail
}                              from "@/modules/quotation/modules/quotation_detail/domain/quotation_detail"

export class PrismaQuotationData implements QuotationDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  async add( quotation: Quotation ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.$transaction( [
        this.db.quotation.create( {
          data: {
            id           : quotation.id.toString(),
            clientId     : quotation.userId.toString(),
            chatId       : quotation.chatId.toString(),
            workerId     : quotation.workerId.toString(),
            title        : quotation.title.value,
            total        : quotation.total.value,
            status       : quotation.status.value,
            valueFormat  : quotation.valueFormat.value,
            createdAt    : quotation.createdAt.toString(),
            estimatedTime: quotation.estimatedTime?.toString()
          }
        } ),
        this.db.quotationDetail.createMany( {
          data: quotation.details.map( detail => (
            {
              id         : detail.id.toString(),
              quotationId: quotation.id.toString(),
              name       : detail.name.value,
              value      : detail.value.value,
              valueFormat: detail.valueFormat.value,
              createdAt  : detail.createdAt.toString(),
              description: detail.description ? detail.description.value : null
            }
          ) )
        } )
      ] )
      return right( true )
    }
    catch ( error ) {
      return left( new InfrastructureException() )
    }
  }

  async search( query: Record<string, any>, limit?: ValidInteger,
    skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[], Quotation[]>> {
    try {
      const where = {}
      if ( query.id
      )
      {
        // @ts-ignore
        where["id"] = {
          equals: query.id
        }
      }
      const orderBy = {}
      if ( sortBy ) {
        const key    = changeCase.camelCase( sortBy.value )
        // @ts-ignore
        orderBy[key] = sortType ? sortType.value : "desc"
      }

      const offset   = skip ? parseInt( skip.value ) : 0
      const response = await this.db.quotation.findMany( {
        where  : where,
        orderBy: orderBy,
        skip   : offset,
        take   : limit?.value,
        include: {
          QuotationDetail: true
        }
      } )

      const result: Quotation[] = []
      for ( const e of response ) {

        const details: QuotationDetail[] = []

        for ( const detail of e.QuotationDetail ) {
          const mappedDetail = QuotationDetail.fromPrimitives(
            detail.id.toString(),
            detail.quotationId,
            detail.name,
            detail.value,
            detail.valueFormat,
            detail.createdAt,
            detail.description ? detail.description : undefined
          )
          if ( mappedDetail instanceof Errors ) {
            return left( mappedDetail.values )
          }
          details.push( mappedDetail )
        }

        const mapped = Quotation.fromPrimitives(
          e.id.toString(),
          e.clientId.toString(),
          e.chatId.toString(),
          e.workerId.toString(),
          e.title,
          e.total,
          e.status,
          e.valueFormat,
          e.createdAt,
          details,
          e.estimatedTime ? e.estimatedTime : undefined
        )
        if ( mapped instanceof Errors ) {
          return left( mapped.values )
        }
        result.push( mapped )
      }
      return right( result )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }

  async update( quotation: Quotation ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.$transaction( [
        this.db.quotation.update( {
          where: { id: quotation.id.toString() },
          data : {
            title        : quotation.title.value,
            total        : quotation.total.value,
            status       : quotation.status.value,
            valueFormat  : quotation.valueFormat.value,
            estimatedTime: quotation.estimatedTime?.toString()
          }
        } ),
        this.db.quotationDetail.deleteMany( {
          where: { quotationId: quotation.id.toString() }
        } ),
        this.db.quotationDetail.createMany( {
          data: quotation.details.map( detail => (
            {
              id         : detail.id.toString(),
              quotationId: quotation.id.toString(),
              name       : detail.name.value,
              value      : detail.value.value,
              valueFormat: detail.valueFormat.value,
              createdAt  : detail.createdAt.toString(),
              description: detail.description ? detail.description.value : null
            }
          ) )
        } )
      ] )
      return right( true )
    }
    catch ( error ) {
      return left( new InfrastructureException() )
    }
  }
}