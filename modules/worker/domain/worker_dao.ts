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
import { Worker }      from "@/modules/worker/domain/worker"
import { PaginatedResult } from "@/modules/shared/domain/paginated_result"

export abstract class WorkerDAO {
  abstract search( query: Record<string, any>, limit?: ValidInteger,
    skip ?: ValidString, sortBy ?: ValidString,
    sortType ?: ValidString ): Promise<Either<BaseException[], PaginatedResult<Worker>>>

  abstract update( worker: Worker ): Promise<Either<BaseException, boolean>>

  abstract add( worker: Worker ): Promise<Either<BaseException, boolean>>

  abstract remove( userId: ValidString ): Promise<Either<BaseException, boolean>>
}
