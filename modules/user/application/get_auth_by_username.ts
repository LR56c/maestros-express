import { AuthRepository } from "@/modules/user/domain/auth_repository"
import { Either, left }   from "fp-ts/Either"
import {
  BaseException
}                         from "@/modules/shared/domain/exceptions/base_exception"
import { User }           from "@/modules/user/domain/user"
import { wrapType }       from "@/modules/shared/utils/wrap_type"
import {
  ValidString
}                         from "@/modules/shared/domain/value_objects/valid_string"

export class GetAuthByUsername {
  constructor( private readonly repo: AuthRepository ) {
  }

  async execute( username: string ): Promise<Either<BaseException[], User>> {
    const vusername = wrapType( () => ValidString.from( username ) )

    if ( vusername instanceof BaseException ) {
      return left( [vusername] )
    }

    return this.repo.getByEmail( vusername )
  }

}