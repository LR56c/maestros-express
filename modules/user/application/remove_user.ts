import { type Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                           from "@/modules/shared/domain/exceptions/base_exception"
import {
  UserDAO
}                                           from "@/modules/user/domain/user_dao"
import {
  ValidInteger
}                                           from "@/modules/shared/domain/value_objects/valid_integer"

export class RemoveUser {
  constructor( private readonly dao: UserDAO ) {
  }

  async execute( id: string ): Promise<Either<BaseException[], boolean>> {
    const existResult = await this.dao.search( {
      id: id
    }, ValidInteger.from( 1 ) )

    if ( isLeft( existResult ) ) {
      return left( existResult.left )
    }

    const result = await this.dao.remove( existResult.right[0]!.userId )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }
}
