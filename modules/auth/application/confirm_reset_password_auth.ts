import { AuthRepository } from "@/modules/auth/domain/auth_repository"
import { UUID }           from "@/modules/shared/domain/value_objects/uuid"
import { ResetPassword }  from "@/modules/auth/domain/reset_password_method"
import type { Either }    from "fp-ts/Either"
import type {
  BaseException
}                         from "@/modules/shared/domain/exceptions/base_exception"
import { AuthResetDTO }   from "@/modules/auth/application/auth_reset_dto"
import { wrapType }       from "@/modules/shared/utils/wrap_type"

export class ConfirmResetPasswordAuth {
  constructor( private readonly repo: AuthRepository ) {
  }

  async execute( userId: string,
    reset: AuthResetDTO ): Promise<Either<BaseException, boolean>> {
    const errors   = []
    const userUUID = wrapType( () => UUID.from( userId ) )

    if ( userUUID instanceof BaseException ) {
      errors.push( userUUID )
    }
    const resetMethod = wrapType(
      () => ResetPassword.from( reset.method, reset.data ) )

    if ( resetMethod instanceof BaseException ) {
      errors.push( resetMethod )
    }

    return this.repo.confirmResetPassword( userUUID, resetMethod, reset.data )
  }
}