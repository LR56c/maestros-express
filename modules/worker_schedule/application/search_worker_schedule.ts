import {
  WorkerScheduleDAO
}                               from "@/modules/worker_schedule/domain/worker_schedule_dao"
import { Either, isLeft, left } from "fp-ts/Either"
import {
  BaseException
}                               from "@/modules/shared/domain/exceptions/base_exception"
import { Speciality }           from "@/modules/speciality/domain/speciality"
import {
  genericEnsureSearch
}                               from "@/modules/shared/utils/generic_ensure_search"
import {
  WorkerSchedule
}                               from "@/modules/worker_schedule/domain/worker_schedule"

export class SearchWorkerSchedule {
  constructor( private readonly dao: WorkerScheduleDAO ) {
  }

  async execute( query: Record<string, any>, limit?: number, skip ?: string,
    sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], WorkerSchedule[]>> {
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

    return this.dao.search( query, validLimit, validSkip, validSortBy,
      validSortType )
  }
}