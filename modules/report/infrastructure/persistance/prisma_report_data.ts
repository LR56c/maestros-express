import { PrismaClient }        from "@/lib/generated/prisma"
import { ReportDAO }           from "@/modules/report/domain/report_dao"
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
import { Report }              from "@/modules/report/domain/report"
import {
  InfrastructureException
}                              from "@/modules/shared/domain/exceptions/infrastructure_exception"
import * as changeCase         from "change-case"
import { Errors }              from "@/modules/shared/domain/exceptions/errors"
import { PaginatedResult }     from "@/modules/shared/domain/paginated_result"

export class PrismaReportData implements ReportDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  async add( report: Report ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.report.create( {
        data: {
          id        : report.id.toString(),
          fromUserId: report.fromUserId.toString(),
          toUserId  : report.toUserId.toString(),
          reason    : report.reason.value,
          createdAt : report.createdAt.toString()
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
    sortType?: ValidString ): Promise<Either<BaseException[], PaginatedResult<Report>>> {
    try {
      const where = {}
      if ( query.id ) {
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
      const results = await this.db.$transaction([
        this.db.report.findMany( {
          where  : where,
          orderBy: orderBy,
          skip   : offset,
          take   : limit?.value,
          include: {
            fromUser: true,
            toUser  : true
          }
        } ),
        this.db.report.count( {
          where: where
        } )
      ])
      const [ response, totalCount ] = results
      const result: Report[] = []
      for ( const e of response ) {
        const mapped = Report.fromPrimitives(
          e.id.toString(),
          e.fromUserId.toString(),
          e.toUserId.toString(),
          e.reason,
          e.createdAt )

        if ( mapped instanceof Errors ) {
          return left( mapped.values )
        }
        result.push( mapped )
      }
      return right( {
        items: result,
        total: totalCount
      } )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }
}