import { AuthRepository } from "@/modules/auth/domain/auth_repository"
import { Auth }           from "@/modules/auth/domain/auth"
import { Either, left }   from "fp-ts/Either"
import {
  BaseException
}                         from "@/modules/shared/domain/exceptions/base_exception"
import {
  AuthRegisterRequest
}                         from "@/modules/auth/application/auth_register_request"
import { UUID }           from "@/modules/shared/domain/value_objects/uuid"
import { wrapType }       from "@/modules/shared/utils/wrap_type"
import { Password }       from "@/modules/auth/domain/password"
import { Errors }         from "@/modules/shared/domain/exceptions/errors"

export class RegisterAuth {
  constructor( private readonly repo: AuthRepository ) {
  }


  async execute( dto: AuthRegisterRequest,
    initRoles ?: string[] ): Promise<Either<BaseException[], Auth>> {

    const password = wrapType( () => Password.from( dto.password ) )

    if ( password instanceof BaseException ) {
      return left( [password] )
    }

    const auth = Auth.create(
      UUID.create().value,
      dto.email,
      {
        roles: initRoles ?? [],
      },
      "EMAIL",
      dto.name
    )

    if ( auth instanceof Errors ) {
      return left( auth.values )
    }

    return this.repo.register( auth, password )
  }
}