import {
  WorkerBookingDAO
}                               from "@/modules/worker_booking/domain/worker_booking_dao"
import { Either, isLeft, left } from "fp-ts/Either"
import {
  BaseException
}                               from "@/modules/shared/domain/exceptions/base_exception"
import { Quotation }      from "@/modules/quotation/domain/quotation"
import {
  genericEnsureSearch
}                         from "@/modules/shared/utils/generic_ensure_search"
import {
  WorkerBooking
}                               from "@/modules/worker_booking/domain/worker_booking"

export class SearchWorkerBooking {
  constructor(private readonly dao : WorkerBookingDAO) {
  }
  async execute( query: Record<string, any>, limit?: number,
    skip ?: string, sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], WorkerBooking[]>>{
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