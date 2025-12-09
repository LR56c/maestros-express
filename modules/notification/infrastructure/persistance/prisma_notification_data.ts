import { PrismaClient }             from "@/lib/generated/prisma"
import {
  NotificationRepository
}                                   from "@/modules/notification/domain/notification_repository"
import {
  ValidInteger
}                                   from "@/modules/shared/domain/value_objects/valid_integer"
import {
  ValidString
}                                   from "@/modules/shared/domain/value_objects/valid_string"
import {
  Notification
}                                   from "@/modules/notification/domain/notification"
import { type Either, left, right } from "fp-ts/Either"
import {
  BaseException
}                                   from "@/modules/shared/domain/exceptions/base_exception"
import {
  InfrastructureException
}                                   from "@/modules/shared/domain/exceptions/infrastructure_exception"
import * as changeCase              from "change-case"
import {
  Errors
}                                   from "@/modules/shared/domain/exceptions/errors"
import {
  extractOperator
}                                   from "@/modules/shared/infrastructure/prisma_query_utils"
import {
  DataAlreadyExistException
} from "@/modules/shared/domain/exceptions/data_already_exist_exception"
import {
  NotificationContent
}                                   from "@/modules/notification/domain/notification_content"

export class PrismaNotificationData implements NotificationRepository {
  constructor( private readonly db: PrismaClient ) {
  }

  async addBulk( notification: NotificationContent,
    ids : string[] ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.$transaction( [
        this.db.notificationContent.create( {
          data: {
            id       : notification.id.toString(),
            data     : notification.data,
            createdAt: notification.createdAt.toString()
          }
        } ),
        this.db.notification.createMany( {
          data: ids.map( userId => (
            {
              notificationId: notification.id.toString(),
              userId        : userId
            }
          ) )
        } )
      ] )
      return right( true )
    }
    catch ( e: any ) {
      const code = e.code
      if ( code ) {
        if ( code === "P2002" ) {
          return left( new DataAlreadyExistException() )
        }
      }
      return left( new InfrastructureException() )
    }
  }


  async search( query: Record<string, any>, limit: ValidInteger,
    skip ?: ValidString, sortBy ?: ValidString,
    sortType ?: ValidString ): Promise<Either<BaseException[], Notification[]>> {
    try {
      const where          = this.queryWhere( query )
      const jsonArrayQuery = this.jsonQueryFilter( query )
      if ( jsonArrayQuery.length > 0 ) {
        where["AND"] = jsonArrayQuery
      }
      const orderBy = {}
      if ( sortBy ) {
        const key    = changeCase.camelCase( sortBy.value )
        // @ts-ignore
        orderBy[key] = sortType ? sortType.value : "desc"
      }

      const offset   = skip ? parseInt( skip.value ) : 0
      const response = await this.db.notification.findMany( {
        where  : where,
        orderBy: orderBy,
        skip   : offset,
        take   : limit.value,
        include:{
          notification:true
        }
      } )

      const result: Notification[] = []
      for ( const item of response ) {
        const mapped = Notification.fromPrimitives(
          item.notificationId.toString(),
          item.userId.toString(),
          item.notification.data as Record<string, any>,
          item.notification.createdAt,
          item.viewedAt
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

  private queryWhere( query: Record<string, any> ): Record<string, any> {
    const where = {}
    if ( query.id ) {
      // @ts-ignore
      where["id"] = {
        equals: query.id
      }
    }
    if ( query.user_id ) {
      // @ts-ignore
      where["userId"] = {
        equals: query.user_id
      }
    }
    if ( query.is_enabled ) {
      // @ts-ignore
      where["isEnabled"] = {
        equals: Boolean( query.is_enabled )
      }
    }
    if ( query.interaction ) {
      // @ts-ignore
      where["interaction"] = {
        equals: query.interaction
      }
    }
    if ( query.viewed_at ) {
      let extract       = extractOperator( query.viewed_at as string )
      // @ts-ignore
      where["viewedAt"] = {
        [extract.operator]: extract.value ? new Date( extract.value ) : null
      }
    }
    return where
  }

  private jsonQueryFilter( query: Record<string, any> ): any[] {
    const jsonArrayQuery = []
    if ( query.title ) {
      jsonArrayQuery.push( {
        data: {
          path  : ["title"],
          equals: query.title
        }
      } )
    }
    if ( query.relevance ) {
      jsonArrayQuery.push(
        {
          data: {
            path  : ["relevance"],
            equals: query.relevance
          }
        } )
    }
    if ( query.notification_from ) {
      jsonArrayQuery.push(
        {
          data: {
            path  : ["notification_from"],
            equals: query.notification_from
          }
        } )
    }
    if ( query.content_from ) {
      jsonArrayQuery.push(
        {
          data: {
            path  : ["content_from"],
            equals: query.content_from
          }
        } )
    }
    if ( query.redirect_url ) {
      jsonArrayQuery.push(
        {
          data: {
            path  : ["redirect_url"],
            equals: query.redirect_url
          }
        } )
    }
    return jsonArrayQuery
  }

  async update( notification: Notification ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.notification.update( {
        where: {
          notificationId_userId: {
            notificationId: notification.id.toString(),
            userId        : notification.userId.toString()
          }
        },
        data : {
          viewedAt: notification.viewedAt?.toString()
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

}
