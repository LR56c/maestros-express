import { Email }          from "@/modules/shared/domain/value_objects/email"
import { Either, left }   from "fp-ts/Either"
import {
  BaseException
}                         from "@/modules/shared/domain/exceptions/base_exception"
import { wrapType }       from "@/modules/shared/utils/wrap_type"
import { Password }       from "@/modules/user/domain/password"
import { AuthRepository } from "@/modules/user/domain/auth_repository"
import {
  UserLoginRequest
}                         from "@/modules/user/application/models/user_login_request"
import { UserAuth } from "@/modules/user/domain/user"

export class LoginUser {
  constructor( private readonly repo: AuthRepository ) {
  }

  async execute( dto: UserLoginRequest ): Promise<Either<BaseException[], UserAuth>> {
    const errors = []

    const emailValue = wrapType( () => Email.from( dto.email ) )

    if ( emailValue instanceof BaseException ) {
      errors.push( emailValue )
    }

    const passwordValue = wrapType( () => Password.from( dto.password ) )

    if ( passwordValue instanceof BaseException ) {
      errors.push( passwordValue )
    }

    if ( errors.length > 0 ) {
      return left( errors )
    }

    return this.repo.login( emailValue as Email, passwordValue as Password )
  }
}