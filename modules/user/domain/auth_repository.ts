import { Email }          from "../../shared/domain/value_objects/email"
import { Password }       from "./password"
import {
  ValidString
}                         from "../../shared/domain/value_objects/valid_string"
import { type Either }    from "fp-ts/Either"
import type {
  BaseException
}                         from "@/modules/shared/domain/exceptions/base_exception"
import { User, UserAuth } from "@/modules/user/domain/user"
import {
  NationalIdentityFormat
}                         from "@/modules/national_identity_format/domain/national_identity_format"
import {
  ValidInteger
} from "@/modules/shared/domain/value_objects/valid_integer"
import { PaginatedResult } from "@/modules/shared/domain/paginated_result"

export abstract class AuthRepository {
  abstract remove( id: ValidString ): Promise<Either<BaseException, boolean>>

  abstract register( auth: User,
    password: Password ): Promise<Either<BaseException[], User>>

  abstract update( user: User ): Promise<Either<BaseException[], boolean>>

  abstract getByEmail( email: Email ): Promise<Either<BaseException[], User>>

  abstract getByUsername( username: ValidString ): Promise<Either<BaseException[], User>>
}
