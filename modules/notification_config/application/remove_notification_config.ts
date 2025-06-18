import {
  NotificationConfigDAO
}                              from "@/modules/notification_config/domain/notification_config_dao"
import type { Either }         from "fp-ts/Either"
import { isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import {
  ValidInteger
}                              from "@/modules/shared/domain/value_objects/valid_integer"

export class RemoveNotificationConfig {
  constructor( private readonly dao: NotificationConfigDAO ) {
  }

  async execute( id: string ): Promise<Either<BaseException[], boolean>> {
    const exist = await this.dao.search( {
      id: id
    }, ValidInteger.from( 1 ) )

    if ( isLeft( exist ) ) {
      return left( exist.left )
    }

    const result = await this.dao.remove( exist.right[0]!.id )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }

}
