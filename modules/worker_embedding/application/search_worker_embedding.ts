import { Either, isLeft, left } from "fp-ts/Either"
import {
  BaseException
}                               from "@/modules/shared/domain/exceptions/base_exception"
import { Package }        from "@/modules/package/domain/package"
import {
  genericEnsureSearch
}                         from "@/modules/shared/utils/generic_ensure_search"
import {
  WorkerEmbeddingRepository
} from "@/modules/worker_embedding/domain/worker_embedding_repository"
import {
  WorkerEmbedding
}                               from "@/modules/worker_embedding/domain/worker_embedding"

export class SearchWorkerEmbedding {

  constructor(private readonly repo : WorkerEmbeddingRepository) {
  }
  async execute( query: Record<string, any>, limit?: number, skip ?: string,
    sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], WorkerEmbedding[]>> {
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

    return this.repo.search( query, validLimit, validSkip, validSortBy,
      validSortType )
  }

}