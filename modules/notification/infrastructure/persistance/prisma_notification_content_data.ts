import {
  NotificationContentDAO
} from "@/modules/notification/domain/notification_content_dao"
import * as changeCase              from "change-case"
import { PrismaClient }             from "@/lib/generated/prisma"
import {
  ValidInteger
} from "@/modules/shared/domain/value_objects/valid_integer"
import { ValidString }         from "@/modules/shared/domain/value_objects/valid_string"
import { Either, left, right } from "fp-ts/Either"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import { PaginatedResult } from "@/modules/shared/domain/paginated_result"
import {
  NotificationContent
} from "@/modules/notification/domain/notification_content"
import { Errors } from "@/modules/shared/domain/exceptions/errors"
import {
  InfrastructureException
} from "@/modules/shared/domain/exceptions/infrastructure_exception"

export class PrismaNotificationContentData implements NotificationContentDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  mapQuery( query: Record<string, any> ): Record<string, any> {
    const where: Record<string, any> = {}
    if ( query.id ) {
      where["id"] = {
        equals: query.id
      }
    }
    return where
  }


  async search( query: Record<string, any>, limit?: ValidInteger,
    skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[], PaginatedResult<NotificationContent>>> {
    try {
      const where = this.mapQuery( query )
      const orderField     = sortBy
        ? changeCase.camelCase( sortBy.value )
        : "viewedAt"
      const orderDirection = sortType ? sortType.value : "desc"
      const orderBy        = { [orderField]: orderDirection }

      let cursor: any | undefined
      const cursorBy = sortBy && sortBy.value === "viewed_at"
        ? "viewedAt"
        : "id"
      if ( skip ) {
        cursor = { [cursorBy]: skip.value }
      }
      // const offset                    = skip ? parseInt( skip.value ) : 0
      const results                = await this.db.$transaction( [
        this.db.notificationContent.findMany( {
          where  : where,
          orderBy: orderBy,
          cursor : cursor,
          // skip   : offset,
          skip   : skip ? 1 : undefined,
          take   : limit?.value
        } ),
        this.db.notificationContent.count( {
          where: where
        } )
      ] )
      const [response, totalCount] = results
      const dates: NotificationContent[]  = []
      for ( const item of response ) {
        const mapped = NotificationContent.fromPrimitives(
          item.id.toString(),
          item.data as Record<string, any>,
          item.createdAt,
        )

        if ( mapped instanceof Errors ) {
          return left( mapped.values )
        }
        dates.push( mapped )
      }
      return right( {
        items: dates,
        total: totalCount
      } )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }

}