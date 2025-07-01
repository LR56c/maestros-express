import { AuthRepository } from "@/modules/auth/domain/auth_repository"
import {
  ValidString
}                       from "@/modules/shared/domain/value_objects/valid_string"
import { Either, left } from "fp-ts/Either"
import  {
  BaseException
}                       from "@/modules/shared/domain/exceptions/base_exception"
import { wrapType }       from "@/modules/shared/utils/wrap_type"

export class LogoutAuth {
  constructor( private readonly repo: AuthRepository ) {
  }

  async execute( token: string ): Promise<Either<BaseException, boolean>>{
    const validToken = wrapType(()=>ValidString.from( token ))
    if ( validToken instanceof BaseException ) {
      return left( validToken )
    }

    return this.repo.logout( validToken )
  }

}