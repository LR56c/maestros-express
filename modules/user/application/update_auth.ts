import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import { wrapType }                    from "@/modules/shared/utils/wrap_type"
import {
  Email
}                                      from "@/modules/shared/domain/value_objects/email"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"
import {
  AuthRepository
}                                      from "@/modules/user/domain/auth_repository"
import {
  UserUpdateDTO
}                                      from "@/modules/user/application/models/user_update_dto"
import { UserAuth }                    from "@/modules/user/domain/user"

export class UpdateAuth {
  constructor( private readonly repo: AuthRepository ) {
  }

  async execute( auth: UserUpdateDTO
  ): Promise<Either<BaseException[], UserAuth>> {
    const email = wrapType( () => Email.from( auth.email ) )

    if ( email instanceof BaseException ) {
      return left( [email] )
    }

    const exist = await this.repo.getByEmail( email )

    if ( isLeft( exist ) ) {
      return left( exist.left )
    }

    const updatedUser = UserAuth.fromPrimitives(
      exist.right.userId.toString(),
      exist.right.email.value,
      exist.right.username.value,
      exist.right.fullName.value,
      exist.right.createdAt.toString(),
      auth.role ? auth.role : exist.right.role.toString(),
      auth.status ? auth.status : exist.right.status?.value ?? null,
      auth.avatar ? auth.avatar : exist.right.avatar?.value ?? null
    )

    if ( updatedUser instanceof Errors ) {
      return left( updatedUser.values )
    }

    const result = await this.repo.update( updatedUser )

    if ( isLeft( result ) ) {
      return left( result.left )
    }

    return right( updatedUser )
  }
}