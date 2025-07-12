import { UserDAO }                     from "@/modules/user/domain/user_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  GetAuth
} from "@/modules/user/application/auth_use_cases/get_auth"

export class RemoveUser {
  constructor(
    private readonly dao: UserDAO ,
    private readonly getUser: GetAuth

  ) {
  }

  async execute( email: string ): Promise<Either<BaseException[], boolean>> {
    const exist = await this.getUser.execute( email )

    if ( isLeft( exist ) ) {
      return left( exist.left )
    }

    const result = await this.dao.remove( exist.right.userId )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }
}