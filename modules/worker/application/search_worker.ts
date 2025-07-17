import { WorkerDAO }                   from "@/modules/worker/domain/worker_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  genericEnsureSearch
}                                      from "@/modules/shared/utils/generic_ensure_search"
import {
  WorkerProfileDTO
}                                      from "@/modules/worker/application/worker_profile_dto"
import { wrapType, wrapTypeDefault }   from "@/modules/shared/utils/wrap_type"
import {
  Position
}                                      from "@/modules/shared/domain/value_objects/position"
import {
  WorkerMapper
}                                      from "@/modules/worker/application/worker_mapper"
import {
  calculateAge
}                                      from "@/modules/shared/utils/calculate_age"
import {
  calculateDistance
}                                      from "@/modules/shared/utils/calculate_distance"
import {
  PaginatedResult
}                                      from "@/modules/shared/domain/paginated_result"

export class SearchWorker {
  constructor( private readonly dao: WorkerDAO ) {
  }

  async execute( query: Record<string, any>, limit?: number, skip ?: string,
    sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], PaginatedResult<WorkerProfileDTO>>> {

    const userLocation = wrapTypeDefault(undefined, (value) => Position.fromJSON( value ) ,query.location)

    if ( userLocation instanceof BaseException ) {
      return left( [userLocation] )
    }

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

    const response: WorkerProfileDTO[] = []
    for ( const w of workersResult.right.items ) {
      const location = wrapType( () => Position.fromJSON( w.location.value ) )

      if ( location instanceof BaseException ) {
        return left( [location] )
      }

      const distance = userLocation instanceof Position ? calculateDistance( userLocation.value, location.value ) : ""

      const mapped: WorkerProfileDTO = WorkerMapper.toProfile( w,
        calculateAge( w.birthDate.value ),
        distance
      )
      response.push( mapped )
    }
    return right( {
      items: response,
      total: workersResult.right.total,
    } )
  }
}