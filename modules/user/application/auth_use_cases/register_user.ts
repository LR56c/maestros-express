import { Either, left }   from "fp-ts/Either"
import {
  BaseException
}                         from "@/modules/shared/domain/exceptions/base_exception"
import { UUID }           from "@/modules/shared/domain/value_objects/uuid"
import { wrapType }       from "@/modules/shared/utils/wrap_type"
import { Errors }         from "@/modules/shared/domain/exceptions/errors"
import { AuthRepository } from "@/modules/user/domain/auth_repository"
import { Password }       from "@/modules/user/domain/password"
import {
  UserRegisterRequest
}                   from "@/modules/user/application/models/user_register_request"
import { UserAuth } from "@/modules/user/domain/user"

export class RegisterUser {
  constructor( private readonly repo: AuthRepository ) {
  }


  async execute( dto: UserRegisterRequest): Promise<Either<BaseException[], UserAuth>> {

    const password = wrapType( () => Password.from( dto.password ) )

    if ( password instanceof BaseException ) {
      return left( [password] )
    }

    const user = UserAuth.create(
      UUID.create().value,
      dto.email,
      dto.full_name,
      "CLIENT",
      dto.avatar ? dto.avatar : null,
    )

    if ( user instanceof Errors ) {
      return left( user.values )
    }

    return this.repo.register( user, password )
  }
}