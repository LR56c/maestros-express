import { AuthRepository } from "@/modules/auth/domain/auth_repository"
import { UUID }           from "@/modules/shared/domain/value_objects/uuid"
import { Either, left }   from "fp-ts/Either"
import {
  BaseException
}                         from "@/modules/shared/domain/exceptions/base_exception"
import { wrapType }       from "@/modules/shared/utils/wrap_type"

export class RemoveAuth {
  constructor( private readonly repo: AuthRepository ) {
  }

  async execute( id: string ): Promise<Either<BaseException, boolean>> {
    const uuid = wrapType( () => UUID.from( id ) )

    if ( uuid instanceof BaseException ) {
      return left( uuid )
    }
    return this.repo.remove( uuid )
  }

}