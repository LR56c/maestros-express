import { Email }         from "../../shared/domain/value_objects/email"
import { Password }      from "./password"
import {
  ValidString
}                        from "../../shared/domain/value_objects/valid_string"
import { AuthMethod }    from "./auth_method"
import { Auth }          from "./auth"
import { ResetPassword } from "./reset_password_method"
import { type Either }   from "fp-ts/Either"
import type {
  BaseException
}                        from "@/modules/shared/domain/exceptions/base_exception"
import { UUID }          from "@/modules/shared/domain/value_objects/uuid"

export abstract class AuthRepository {
  abstract remove( id: UUID ): Promise<Either<BaseException, boolean>>

  abstract login( email: Email, password: Password ): Promise<Either<BaseException[], Auth>>

  abstract logout( token: ValidString ): Promise<Either<BaseException, boolean>>

  abstract register( auth: Auth,
    password: Password ): Promise<Either<BaseException[], Auth>>

  abstract requestResetPassword( method: ResetPassword,
    data ?: string ): Promise<Either<BaseException, boolean>>


  abstract revalidate( token: ValidString ): Promise<Either<BaseException[], Auth>>

  abstract singinOauth( token: ValidString,method: AuthMethod ): Promise<Either<BaseException[], Auth>>

  abstract confirmResetPassword( userId: UUID, method: ResetPassword,
    data ?: string ): Promise<Either<BaseException, boolean>>

  abstract update( auth: Auth ): Promise<Either<BaseException[], Auth>>
  abstract getByEmail( email :Email ): Promise<Either<BaseException[], Auth>>

}
