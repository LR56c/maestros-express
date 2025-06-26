import { type Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                           from "@/modules/shared/domain/exceptions/base_exception"
import {
  ValidInteger
}                                           from "@/modules/shared/domain/value_objects/valid_integer"
import type {
  RoleDAO
}                                           from "@/modules/role/domain/role_dao"

export class RemoveRole {
  constructor( private readonly dao: RoleDAO ) {
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
