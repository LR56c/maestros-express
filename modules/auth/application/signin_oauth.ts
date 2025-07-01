import { AuthRepository } from "@/modules/auth/domain/auth_repository"
import type { Either }    from "fp-ts/Either"
import type {
  BaseException
}                         from "@/modules/shared/domain/exceptions/base_exception"
import { Auth }           from "@/modules/auth/domain/auth"
import { OauthRequest }   from "@/modules/auth/application/oauth_request"
import { wrapType }       from "@/modules/shared/utils/wrap_type"
import {
  ValidString
}                         from "@/modules/shared/domain/value_objects/valid_string"

export class SigninOauth {
  constructor( private readonly repo: AuthRepository ) {
  }

  async execute(dto : OauthRequest): Promise<Either<BaseException[], Auth>>{
    const errors = []

    const token =wrapType(()=>ValidString.from(dto.token))

    if ( token instanceof BaseException ) {
      errors.push( token )
    }

    const method =wrapType(()=>ValidString.from(dto.auth_method))

    if ( method instanceof BaseException ) {
      errors.push( token )
    }

    if ( errors.length > 0 ) {
      return left( errors )
    }

    return this.repo.singinOauth( token, method )
  }
}