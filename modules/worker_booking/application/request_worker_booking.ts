import {
  WorkerBookingDAO
}                         from "@/modules/worker_booking/domain/worker_booking_dao"
import { WorkerBooking }               from "@/modules/worker_booking/domain/worker_booking"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  WorkerBookingDTO
}                         from "@/modules/worker_booking/application/worker_booking_dto"
import {
  ensureWorkerBookingExist
}                         from "@/modules/worker_booking/utils/ensure_worker_booking_exist"
import { containError } from "@/modules/shared/utils/contain_error"
import {
  DataNotFoundException
} from "@/modules/shared/domain/exceptions/data_not_found_exception"
import { Errors }               from "@/modules/shared/domain/exceptions/errors"

export class RequestWorkerBooking {
  constructor( private readonly dao: WorkerBookingDAO ) {
  }

  async execute(
    clientId: string,
    workerId: string,
    book: WorkerBookingDTO ): Promise<Either<BaseException[], WorkerBooking>> {
    const exist = await ensureWorkerBookingExist(this.dao, book.id)

    if ( isLeft( exist ) ) {
      if ( !containError( exist.left, new DataNotFoundException() ) ) {
        return left( exist.left )
      }
    }

    const newBooking = WorkerBooking.create(
      book.id,
      workerId,
      clientId,
      book.status,
      book.date
    )

    if ( newBooking instanceof Errors ) {
      return left( newBooking.values )
    }

    const result = await this.dao.request( newBooking )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( newBooking )
  }

}