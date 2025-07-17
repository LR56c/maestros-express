import { User }   from "@/modules/user/domain/user"
import { Either } from "fp-ts/Either"
import {
  BaseException
}                 from "@/modules/shared/domain/exceptions/base_exception"
import {
  ValidInteger
}                 from "@/modules/shared/domain/value_objects/valid_integer"
import {
  ValidString
}                 from "@/modules/shared/domain/value_objects/valid_string"
import { UUID } from "@/modules/shared/domain/value_objects/uuid"
import { PaginatedResult } from "@/modules/shared/domain/paginated_result"

export abstract class UserDAO {

  abstract add( user: User ): Promise<Either<BaseException, boolean>>
  abstract update( user: User ): Promise<Either<BaseException, boolean>>
  abstract remove( id: UUID ): Promise<Either<BaseException, boolean>>

  abstract search( query: Record<string, any>, limit?: ValidInteger,
    skip ?: ValidString, sortBy ?: ValidString,
    sortType ?: ValidString ): Promise<Either<BaseException[], PaginatedResult<User>>>
}