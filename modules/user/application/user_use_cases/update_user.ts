import { UserDAO }        from "@/modules/user/domain/user_dao"
import { GetAuth }        from "@/modules/user/application/auth_use_cases/get_auth"
import { User, UserAuth } from "@/modules/user/domain/user"
import { Either, isLeft, left } from "fp-ts/Either"
import {
  BaseException
}                               from "@/modules/shared/domain/exceptions/base_exception"
import { UserResponse } from "@/modules/user/application/models/user_response"
import { Errors } from "@/modules/shared/domain/exceptions/errors"

export class UpdateUser {
  constructor(
    private readonly dao: UserDAO,
    private readonly getUser: GetAuth
  )
  {
  }

  async execute( dto: UserResponse ): Promise<Either<BaseException[], boolean>>{
    const exist = await this.getUser.execute( email )

    if ( isLeft( exist ) ) {
      return left( [exist.left] )
    }

    const user = UserAuth.fromPrimitives(
      exist.right.userId.toString(),
      exist.right.email.value,
      exist.right.fullName.value,
      exist.right.createdAt.toString(),
      dto.role,
      dto.status,
      dto.avatar,
    )

    if ( user instanceof Errors ) {
      return left( user.values )
    }

    const result = await this.dao.update( user )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }
}