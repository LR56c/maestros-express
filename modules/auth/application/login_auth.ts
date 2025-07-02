import { AuthRepository } from "@/modules/auth/domain/auth_repository"
import { Email } from "@/modules/shared/domain/value_objects/email"
import { Password }     from "@/modules/auth/domain/password"
import { Either, left } from "fp-ts/Either"
import {
  BaseException
}                       from "@/modules/shared/domain/exceptions/base_exception"
import { Auth } from "@/modules/auth/domain/auth"
import { wrapType }       from "@/modules/shared/utils/wrap_type"
import { AuthLoginRequest } from "@/modules/auth/application/auth_login_request"

export class LoginAuth {
  constructor( private readonly repo: AuthRepository ) {
  }

  async execute( dto : AuthLoginRequest ): Promise<Either<BaseException[], Auth>>{
    const errors = []

    const emailValue = wrapType(()=>Email.from( dto.email ))

    if ( emailValue instanceof BaseException ) {
      errors.push( emailValue )
    }

    const passwordValue = wrapType(()=>Password.from( dto.password ))

    if ( passwordValue instanceof BaseException ) {
      errors.push( passwordValue )
    }

    if ( errors.length > 0 ) {
      return left(errors)
    }

    return this.repo.login( emailValue as Email, passwordValue as Password)
  }
}