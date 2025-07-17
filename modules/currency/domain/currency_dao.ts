import {
  ValidInteger
}                      from "@/modules/shared/domain/value_objects/valid_integer"
import {
  ValidString
}                      from "@/modules/shared/domain/value_objects/valid_string"
import type { Either } from "fp-ts/Either"
import {
  BaseException
}                      from "@/modules/shared/domain/exceptions/base_exception"
import { Currency }    from "@/modules/currency/domain/currency"
import { PaginatedResult } from "@/modules/shared/domain/paginated_result"

export abstract class CurrencyDAO {
  abstract search( query: Record<string, any>, limit?: ValidInteger,
    skip ?: ValidString, sortBy ?: ValidString,
    sortType ?: ValidString ): Promise<Either<BaseException[], PaginatedResult<Currency>>>

  abstract add( currency: Currency ): Promise<Either<BaseException, boolean>>

  abstract update( currency: Currency ): Promise<Either<BaseException, boolean>>

  abstract remove( id: ValidString ): Promise<Either<BaseException, boolean>>
}
