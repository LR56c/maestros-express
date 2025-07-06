import { UserDAO }                              from "@/modules/user/domain/user_dao"
import { Either, isLeft, isRight, left, right } from "fp-ts/Either"
import {
  BaseException
}                                               from "@/modules/shared/domain/exceptions/base_exception"
import {
  UserResponse
}                                               from "@/modules/user/application/models/user_response"
import {
  GetAuth
}                                               from "@/modules/user/application/auth_use_cases/get_auth"
import {
  DataAlreadyExistException
}                                               from "@/modules/shared/domain/exceptions/data_already_exist_exception"
import {
  UserAuth
}                                               from "@/modules/user/domain/user"
import {
  Errors
}                                               from "@/modules/shared/domain/exceptions/errors"

export class AddUser {
  constructor(
    private readonly dao: UserDAO,
    private readonly getUser: GetAuth
  )
  {
  }

  async execute( dto: UserResponse ): Promise<Either<BaseException[], boolean>> {
    const exist = await this.getUser.execute( dto.email )
    if ( isRight( exist ) ) {
      return left( [new DataAlreadyExistException()] )
    }

    const user = UserAuth.create(
      dto.user_id,
      dto.email,
      dto.full_name,
      dto.role,
      dto.status,
      dto.avatar ? dto.avatar : null
    )

    if ( user instanceof Errors ) {
      return left( user.values )
    }

    const result = await this.dao.add( user )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }
}