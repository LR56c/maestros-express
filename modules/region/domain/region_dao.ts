import { Region }          from "./region"
import { ValidString }     from "../../shared/domain/value_objects/valid_string"
import {
  ValidInteger
}                          from "../../shared/domain/value_objects/valid_integer"
import { type Either }     from "fp-ts/Either"
import {
  BaseException
}                          from "@/modules/shared/domain/exceptions/base_exception"
import { UUID }            from "@/modules/shared/domain/value_objects/uuid"
import { PaginatedResult } from "@/modules/shared/domain/paginated_result"

export abstract class RegionDAO {
  abstract search( query: Record<string, any>, limit?: ValidInteger,
    skip ?: ValidString, sortBy ?: ValidString,
    sortType ?: ValidString ): Promise<Either<BaseException[], PaginatedResult<Region>>>
  abstract add( region: Region ): Promise<Either<BaseException, boolean>>
  abstract update( region: Region ): Promise<Either<BaseException, boolean>>
  abstract remove( id: UUID ): Promise<Either<BaseException, boolean>>
}
