import { Either, left }   from "fp-ts/Either"
import {
  BaseException
}                         from "@/modules/shared/domain/exceptions/base_exception"
import { wrapType }       from "@/modules/shared/utils/wrap_type"
import {
  ValidString
}                         from "@/modules/shared/domain/value_objects/valid_string"
import { AuthRepository } from "@/modules/user/domain/auth_repository"

export class RemoveUser {
  constructor( private readonly repo: AuthRepository ) {
  }

  async execute( id: string ): Promise<Either<BaseException, boolean>> {
    const vid = wrapType( () => ValidString.from( id ) )

    if ( vid instanceof BaseException ) {
      return left( vid )
    }
    return this.repo.remove( vid )
  }

}