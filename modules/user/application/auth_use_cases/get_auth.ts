import { AuthRepository } from "@/modules/user/domain/auth_repository"
import { Email }          from "@/modules/shared/domain/value_objects/email"
import { Either, left }   from "fp-ts/Either"
import {
  BaseException
}                         from "@/modules/shared/domain/exceptions/base_exception"
import { User }           from "@/modules/user/domain/user"
import { wrapType }       from "@/modules/shared/utils/wrap_type"

export class GetAuth {
  constructor( private readonly repo: AuthRepository ) {
  }

  async execute( email: string ): Promise<Either<BaseException[], User>> {
    const userEmail = wrapType( () => Email.from( email ) )

    if ( userEmail instanceof BaseException ) {
      return left( [userEmail] )
    }

    return this.repo.getByEmail( userEmail )
  }

}