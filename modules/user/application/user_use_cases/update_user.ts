import { UserDAO }                     from "@/modules/user/domain/user_dao"
import {
  GetAuth
}                                      from "@/modules/user/application/auth_use_cases/get_auth"
import { User, UserAuth }              from "@/modules/user/domain/user"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  UserResponse
}                                      from "@/modules/user/application/models/user_response"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"

export class UpdateUser {
  constructor(
    private readonly dao: UserDAO,
    private readonly getUser: GetAuth
  )
  {
  }

  async execute( dto: UserResponse ): Promise<Either<BaseException[], User>> {
    const exist = await this.getUser.execute( dto.email )

    if ( isLeft( exist ) ) {
      return left( exist.left )
    }

    const user = UserAuth.fromPrimitives(
      exist.right.userId.toString(),
      exist.right.email.value,
      exist.right.fullName.value,
      exist.right.createdAt.toString(),
      dto.role ? dto.role : exist.right.role.toString(),
      dto.status ? dto.status : exist.right.status?.value ?? null,
      dto.avatar ? dto.avatar : exist.right.avatar?.value ?? null
    )

    if ( user instanceof Errors ) {
      return left( user.values )
    }

    const result = await this.dao.update( user )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( user )
  }
}