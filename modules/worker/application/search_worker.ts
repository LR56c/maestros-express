import { WorkerDAO }                   from "@/modules/worker/domain/worker_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  genericEnsureSearch
}                                      from "@/modules/shared/utils/generic_ensure_search"
import {
  PaginatedResult
}                                      from "@/modules/shared/domain/paginated_result"
import { Worker }                      from "@/modules/worker/domain/worker"

export class SearchWorker {
  constructor( private readonly dao: WorkerDAO ) {
  }

  async execute( query: Record<string, any>, limit?: number, skip ?: string,
    sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], PaginatedResult<Worker>>> {

    const searchParamsResult = genericEnsureSearch( limit, skip, sortBy,
      sortType )

    if ( isLeft( searchParamsResult ) ) {
      return left( searchParamsResult.left )
    }

    const {
            validLimit,
            validSkip,
            validSortBy,
            validSortType
          } = searchParamsResult.right

    const workersResult = await this.dao.search( query, validLimit, validSkip,
      validSortBy,
      validSortType )

    if ( isLeft( workersResult ) ) {
      return left( workersResult.left )
    }
    return right( workersResult.right )
  }
}