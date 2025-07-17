import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  genericEnsureSearch
}                                      from "@/modules/shared/utils/generic_ensure_search"
import {
  WorkerEmbeddingRepository
}                                      from "@/modules/worker_embedding/domain/worker_embedding_repository"
import {
  SearchWorker
}                                      from "@/modules/worker/application/search_worker"
import { wrapType }                    from "@/modules/shared/utils/wrap_type"
import {
  WorkerProfileDTO
}                                      from "@/modules/worker/application/worker_profile_dto"
import {
  ValidString
}                                      from "@/modules/shared/domain/value_objects/valid_string"
import {
  Position
}                                      from "@/modules/shared/domain/value_objects/position"
import {
  ValidInteger
}                                      from "@/modules/shared/domain/value_objects/valid_integer"

export class SearchWorkerEmbedding {

  constructor(
    private readonly repo: WorkerEmbeddingRepository,
    private readonly searchWorkers: SearchWorker
  )
  {
  }

  async execute( query: Record<string, any>,
    limit?: number, skip ?: string,
    sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], WorkerProfileDTO[]>> {
    const searchParamsResult = genericEnsureSearch( limit, skip, sortBy,
      sortType )

    const errors = []

    if ( isLeft( searchParamsResult ) ) {
      return left( searchParamsResult.left )
    }

    const {
            validLimit,
            validSkip,
            validSortBy,
            validSortType
          } = searchParamsResult.right

    const vInput = wrapType( () => ValidString.from( query.input ) )
    if ( vInput instanceof BaseException ) {
      errors.push( vInput )
    }

    const location = wrapType( () => Position.fromJSON( query.location ) )

    if ( location instanceof BaseException ) {
      errors.push( location )
    }

    const radius = wrapType( () => ValidInteger.from( query.radius ) )

    if ( radius instanceof BaseException ) {
      errors.push( radius )
    }

    if ( errors.length > 0 ) {
      return left( errors )
    }

    const embedResult = await this.repo.search( vInput as ValidString,
      location as Position, radius as ValidInteger, validLimit )
    if ( isLeft( embedResult ) ) {
      return left( embedResult.left )
    }

    const workerIds = embedResult.right.map( e => e.workerId.toString() )

    const workersResult = await this.searchWorkers.execute( {
        ids     : workerIds.join( "," ),
        location: (
          location as Position
        ).toPoint()
      }, validLimit?.value, validSkip?.value, validSortBy?.value,
      validSortType?.value )
    if ( isLeft( workersResult ) ) {
      return left( workersResult.left )
    }

    return right( workersResult.right.items )
  }
}