import {
  NotificationConfigDAO
}                                   from "@/modules/notification_config/domain/notification_config_dao"
import {
  NotificationConfig
}                                   from "@/modules/notification_config/domain/notification_config"
import {
  ValidInteger
}                                   from "@/modules/shared/domain/value_objects/valid_integer"
import {
  ValidString
}                                   from "@/modules/shared/domain/value_objects/valid_string"
import { PrismaClient }             from "@/lib/generated/prisma"
import {
  BaseException
}                                   from "@/modules/shared/domain/exceptions/base_exception"
import { type Either, left, right } from "fp-ts/Either"
import {
  InfrastructureException
}                                   from "@/modules/shared/domain/exceptions/infrastructure_exception"
import * as changeCase              from "change-case"
import {
  Errors
}                                   from "@/modules/shared/domain/exceptions/errors"
import {
  UUID
}                                   from "@/modules/shared/domain/value_objects/uuid"

export class PrismaNotificationConfigData implements NotificationConfigDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  async update( notificationConfig: NotificationConfig ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.notificationConfig.update( {
        where: {
          id: notificationConfig.id.toString()
        },
        data : {
          deviceToken       : notificationConfig.deviceToken.value,
          data              : notificationConfig.deviceData,
          notificationType: notificationConfig.notificationSource.value,
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async add( notificationConfig: NotificationConfig ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.notificationConfig.create( {
        data: {
          id                : notificationConfig.id.toString(),
          userId            : notificationConfig.userId.toString(),
          deviceToken       : notificationConfig.deviceToken.value,
          data              : notificationConfig.deviceData,
          notificationType: notificationConfig.notificationSource.value,
          createdAt         : notificationConfig.createdAt.toString()
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async remove( id: UUID ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.notificationConfig.delete( {
        where: {
          id: id.toString()
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async search( query: Record<string, any>, limit: ValidInteger,
    skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[], NotificationConfig[]>> {
    try {
      const where = {}
      if ( query.id ) {
        // @ts-ignore
        where["id"] = {
          equals:  query.id
        }
      }
      if ( query.user_id ) {
        // @ts-ignore
        where["userId"] = {
          equals: query.user_id
        }
      }
      if ( query.device_token ) {
        // @ts-ignore
        where["deviceToken"] = {
          equals: query.device_token
        }
      }
      if ( query.notification_source ) {
        // @ts-ignore
        where["notificationSource"] = {
          equals: query.notification_source
        }
      }
      const jsonArrayQuery = this.jsonQueryFilter( query )
      if ( jsonArrayQuery.length > 0 ) {
        // @ts-ignore
        where["AND"] = jsonArrayQuery
      }
      const orderBy = {}
      if ( sortBy ) {
        const key    = changeCase.camelCase( sortBy.value )
        // @ts-ignore
        orderBy[key] = sortType ? sortType.value : "desc"
      }

      const offset   = skip ? parseInt( skip.value ) : 0
      const response = await this.db.notificationConfig.findMany( {
        where  : where,
        orderBy: orderBy,
        skip   : offset,
        take   : limit.value
      } )

      const result: NotificationConfig[] = []
      for ( const e of response ) {
        const mapped = NotificationConfig.fromPrimitives( e.id.toString(),
          e.userId.toString(),
          e.data as Record<string, any>, e.deviceToken, e.notificationType,
          e.createdAt )
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

  private jsonQueryFilter( query: Record<string, any> ): any[] {
    const jsonArrayQuery = []
    if ( query.device ) {
      jsonArrayQuery.push( {
        data: {
          path  : ["device"],
          equals: query.device
        }
      } )
    }
    return jsonArrayQuery
  }
}
