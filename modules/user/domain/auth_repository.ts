import { Email }       from "../../shared/domain/value_objects/email"
import { Password }    from "./password"
import {
  ValidString
}                      from "../../shared/domain/value_objects/valid_string"
import { type Either } from "fp-ts/Either"
import type {
  BaseException
}                      from "@/modules/shared/domain/exceptions/base_exception"
import { UserAuth }    from "@/modules/user/domain/user"
import {
  NationalIdentity
}                      from "@/modules/national_identity/domain/national_identity"

export abstract class AuthRepository {
  abstract remove( id: ValidString ): Promise<Either<BaseException, boolean>>

  abstract anonymous(): Promise<Either<BaseException[], UserAuth>>

  abstract login( email: Email, password: Password ): Promise<Either<BaseException[], UserAuth>>

  abstract logout( token?: ValidString ): Promise<Either<BaseException, boolean>>

  abstract register( auth: UserAuth, password: Password ): Promise<Either<BaseException[], UserAuth>>

  abstract update( user: UserAuth ): Promise<Either<BaseException[], boolean>>

  abstract getByEmail( email: Email ): Promise<Either<BaseException[], UserAuth>>

  // abstract requestResetPassword( method: ResetPassword, data ?: string ): Promise<Either<BaseException, boolean>>
  // abstract revalidate( token: ValidString ): Promise<Either<BaseException[], User>>
  // abstract singinOauth( method: AuthMethod, token?: ValidString ): Promise<Either<BaseException[], User>>
  // abstract confirmResetPassword( userId: ValidString, method: ResetPassword, data ?: string ): Promise<Either<BaseException, boolean>>
}
