import { Role }        from "./role"
import { type Either } from "fp-ts/Either"
import { UUID }        from "@/modules/shared/domain/value_objects/uuid"
import {
  BaseException
} from "@/modules/shared/domain/exceptions/base_exception"
import {
  ValidInteger
} from "@/modules/shared/domain/value_objects/valid_integer"
import { ValidString } from "@/modules/shared/domain/value_objects/valid_string"

export abstract class RoleDAO {
  abstract add( role: Role ): Promise<Either<BaseException, boolean>>

  abstract update( role: Role ): Promise<Either<BaseException, boolean>>

  abstract remove( id: UUID ): Promise<Either<BaseException, boolean>>

  abstract search( query: Record<string, any>, limit ?: ValidInteger,
    skip ?: ValidString, sortBy ?: ValidString,
    sortType ?: ValidString ): Promise<Either<BaseException[], Role[]>>
}
