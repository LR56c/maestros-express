import {
  ValidInteger
}                          from "@/modules/shared/domain/value_objects/valid_integer"
import {
  ValidString
}                          from "@/modules/shared/domain/value_objects/valid_string"
import { Report }          from "@/modules/report/domain/report"
import {
  BaseException
}                          from "@/modules/shared/domain/exceptions/base_exception"
import { Either }          from "fp-ts/Either"
import { PaginatedResult } from "@/modules/shared/domain/paginated_result"

export abstract class ReportDAO {
  abstract search( query: Record<string, any>, limit?: ValidInteger,
    skip ?: ValidString, sortBy ?: ValidString,
    sortType ?: ValidString ): Promise<Either<BaseException[], PaginatedResult<Report>>>
  abstract add( report: Report ): Promise<Either<BaseException, boolean>>
}
