import { AuthRepository } from "@/modules/auth/domain/auth_repository"
import { ResetPassword } from "@/modules/auth/domain/reset_password_method"
import { Either, left }  from "fp-ts/Either"
import  {
  BaseException
}                        from "@/modules/shared/domain/exceptions/base_exception"
import { AuthResetDTO }   from "@/modules/auth/application/auth_reset_dto"
import { wrapType }       from "@/modules/shared/utils/wrap_type"

export class RequestResetPasswordAuth {
  constructor( private readonly repo: AuthRepository ) {
  }

  async execute( reset: AuthResetDTO): Promise<Either<BaseException, boolean>>{

    const resetPassword = wrapType( ()=>ResetPassword.from( reset.method))

    if (resetPassword instanceof BaseException) {
      return left(resetPassword)
    }

    return this.repo.requestResetPassword( resetPassword, reset.data )
  }
}