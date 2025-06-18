import { User }        from "./user"
import { type Either } from "fp-ts/Either"
import {
  BaseException
}                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  ValidInteger
}                      from "@/modules/shared/domain/value_objects/valid_integer"
import {
  ValidString
}                      from "@/modules/shared/domain/value_objects/valid_string"
import type { UUID }   from "@/modules/shared/domain/value_objects/uuid"

export abstract class UserDAO {
  abstract add( user: User ): Promise<Either<BaseException, boolean>>

  abstract count( query: Record<string, any> ): Promise<Either<BaseException[], ValidInteger>>

  abstract getById( id: UUID ): Promise<Either<BaseException[], User>>

  abstract search( query: Record<string, any>, limit?: ValidInteger,
    skip ?: ValidString, sortBy ?: ValidString,
    sortType ?: ValidString ): Promise<Either<BaseException[], User[]>>

  abstract update( user: User ): Promise<Either<BaseException, boolean>>

  abstract remove( id: UUID ): Promise<Either<BaseException, boolean>>
}
