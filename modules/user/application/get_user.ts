import { type Either, left } from "fp-ts/Either"
import {
  BaseException
}                            from "@/modules/shared/domain/exceptions/base_exception"
import { User }              from "@/modules/user/domain/user"
import { UserDAO }           from "@/modules/user/domain/user_dao"
import { wrapType }          from "@/modules/shared/utils/wrap_type"
import { UUID }              from "@/modules/shared/domain/value_objects/uuid"

export class GetUser {
  constructor( private readonly dao: UserDAO ) {
  }

  async execute( id: string ): Promise<Either<BaseException[], User>> {
    const vid = wrapType( () => UUID.from( id ) )
    if ( vid instanceof BaseException ) {
      return left( [vid] )
    }

    return await this.dao.getById( vid as UUID )
  }
}
