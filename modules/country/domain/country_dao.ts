import { Country }         from "./country"
import { type Either }     from "fp-ts/Either"
import {
  ValidInteger
}                          from "@/modules/shared/domain/value_objects/valid_integer"
import {
  ValidString
}                          from "@/modules/shared/domain/value_objects/valid_string"
import {
  BaseException
}                          from "@/modules/shared/domain/exceptions/base_exception"
import { UUID }            from "@/modules/shared/domain/value_objects/uuid"
import { PaginatedResult } from "@/modules/shared/domain/paginated_result"

export abstract class CountryDAO {

  abstract search( query: Record<string, any>, limit ?: ValidInteger,
    skip ?: ValidString, sortBy ?: ValidString,
    sortType ?: ValidString ): Promise<Either<BaseException[], PaginatedResult<Country>>>
  abstract add( country: Country ): Promise<Either<BaseException, boolean>>
  abstract update( country: Country ): Promise<Either<BaseException, boolean>>
  abstract remove( id: UUID ): Promise<Either<BaseException, boolean>>
}
