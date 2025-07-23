import { Email }       from "../../shared/domain/value_objects/email"
import { Password }    from "./password"
import {
  ValidString
}                      from "../../shared/domain/value_objects/valid_string"
import { type Either } from "fp-ts/Either"
import type {
  BaseException
}                      from "@/modules/shared/domain/exceptions/base_exception"
import { User }        from "@/modules/user/domain/user"

export abstract class AuthRepository {
  abstract remove( id: ValidString ): Promise<Either<BaseException, boolean>>

  abstract register( auth: User,
    password: Password ): Promise<Either<BaseException[], User>>

  abstract update( user: User ): Promise<Either<BaseException[], boolean>>

  abstract getByEmail( email: Email ): Promise<Either<BaseException[], User>>

  abstract getByUsername( username: ValidString ): Promise<Either<BaseException[], User>>
}
