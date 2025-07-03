import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  DataNotFoundException
}                   from "@/modules/shared/domain/exceptions/data_not_found_exception"
import {
  AuthRepository
}                   from "@/modules/user/domain/auth_repository"
import { wrapType } from "@/modules/shared/utils/wrap_type"
import {
  Email
}                   from "@/modules/shared/domain/value_objects/email"
import { UserAuth } from "@/modules/user/domain/user"

export const ensureUserExist = async ( repo: AuthRepository,
  email: string ): Promise<Either<BaseException[], UserAuth>> => {

  const vemail = wrapType(()=>Email.from( email ))

  if ( vemail instanceof BaseException ) {
    return left( [vemail] )
  }

  const user = await repo.getByEmail(vemail)

  if ( isLeft(user) ) {
    return left(user.left)
  }

  if ( user.right.email.value !== email ) {
    return left( [new DataNotFoundException()] )
  }

  return right(user.right)
}