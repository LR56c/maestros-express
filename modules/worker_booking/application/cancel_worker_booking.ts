import {
  WorkerBookingDAO
}                                      from "@/modules/worker_booking/domain/worker_booking_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  ensureWorkerBookingExist
}                                      from "@/modules/worker_booking/utils/ensure_worker_booking_exist"

export class CancelWorkerBooking {
  constructor(private readonly dao : WorkerBookingDAO) {
  }

  async execute( id: string ): Promise<Either<BaseException[], boolean>>{
    const exist = await ensureWorkerBookingExist(this.dao, id)

    if(isLeft(exist)){
      return left(exist.left)
    }

    const result = await this.dao.cancel(exist.right.id)

    if (isLeft(result)) {
      return left([result.left])
    }

    return right(true)
  }
}