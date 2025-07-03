import { ValidString }     from "@/modules/shared/domain/value_objects/valid_string"
import { Either, left }    from "fp-ts/Either"
import {
  BaseException
}                          from "@/modules/shared/domain/exceptions/base_exception"
import { wrapTypeDefault } from "@/modules/shared/utils/wrap_type"
import { AuthRepository }  from "@/modules/user/domain/auth_repository"

export class LogoutUser {
  constructor( private readonly repo: AuthRepository ) {
  }

  async execute( token?: string ): Promise<Either<BaseException, boolean>> {
    const validToken = wrapTypeDefault( undefined,
      ( value ) => ValidString.from( value ), token )
    if ( validToken instanceof BaseException ) {
      return left( validToken )
    }

    return this.repo.logout( validToken )
  }

}