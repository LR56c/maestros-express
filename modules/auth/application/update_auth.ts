import { AuthRepository } from "@/modules/auth/domain/auth_repository"
import { Auth }                 from "@/modules/auth/domain/auth"
import { Either, isLeft, left } from "fp-ts/Either"
import  {
  BaseException
}                               from "@/modules/shared/domain/exceptions/base_exception"
import { AuthUpdateDTO }  from "@/modules/auth/application/auth_update_dto"
import { wrapType }       from "@/modules/shared/utils/wrap_type"
import { Email }          from "@/modules/shared/domain/value_objects/email"
import { Errors }         from "@/modules/shared/domain/exceptions/errors"

export class UpdateAuth {
  constructor( private readonly repo: AuthRepository ) {
  }

  async execute( auth: AuthUpdateDTO
  ): Promise<Either<BaseException[], Auth>> {
    const email = wrapType( () => Email.from( auth.email ) )

    if ( email instanceof BaseException ) {
      return left( [email] )
    }

    const exist = await this.repo.getByEmail( email )

    if ( isLeft( exist ) ) {
      return left( exist.left )
    }

    const updatedAuth = Auth.fromPrimitives(
      exist.right.userId.value,
      email.value,
      auth.metadata as Record<string, any>,
      exist.right.authMethod.value,
      exist.right.createdAt.value,
      exist.right.name.value,
      exist.right.updatedAt?.value,
      exist.right.lastLogin?.value
    )

    if ( updatedAuth instanceof Errors ) {
      return left( updatedAuth.values )
    }

    return this.repo.update( updatedAuth )
  }
}