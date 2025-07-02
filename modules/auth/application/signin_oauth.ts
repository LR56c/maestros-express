import { AuthRepository } from "@/modules/auth/domain/auth_repository"
import { Either, left }   from "fp-ts/Either"
import {
  BaseException
}                         from "@/modules/shared/domain/exceptions/base_exception"
import { Auth }           from "@/modules/auth/domain/auth"
import { OauthRequest }   from "@/modules/auth/application/oauth_request"
import { wrapType }       from "@/modules/shared/utils/wrap_type"
import {
  ValidString
}                         from "@/modules/shared/domain/value_objects/valid_string"
import { AuthMethod }     from "@/modules/auth/domain/auth_method"

export class SigninOauth {
  constructor( private readonly repo: AuthRepository ) {
  }

  async execute(dto : OauthRequest): Promise<Either<BaseException[], Auth>>{
    const errors : BaseException[] = []

    const token =wrapType(()=>ValidString.from(dto.token))

    if ( token instanceof BaseException ) {
      errors.push( token )
    }

    const method =wrapType(()=>AuthMethod.from(dto.method))

    if ( method instanceof BaseException ) {
      errors.push( method )
    }

    if ( errors.length > 0 ) {
      return left( errors )
    }

    return this.repo.singinOauth( token as ValidString
      , method as AuthMethod )
  }
}