import {
  WorkerBookingDAO
}                        from "@/modules/worker_booking/domain/worker_booking_dao"
import { WorkerBooking }               from "@/modules/worker_booking/domain/worker_booking"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  WorkerBookingDTO
}                        from "@/modules/worker_booking/application/worker_booking_dto"
import {
  ensureWorkerBookingExist
} from "@/modules/worker_booking/utils/ensure_worker_booking_exist"
import { Errors }               from "@/modules/shared/domain/exceptions/errors"

export class UpdateWorkerBooking {
  constructor( private readonly dao: WorkerBookingDAO ) {
  }

  async execute( book: WorkerBookingDTO ): Promise<Either<BaseException[], boolean>> {
    const exist = await ensureWorkerBookingExist( this.dao, book.id )

    if ( isLeft( exist ) ) {
      return left( exist.left )
    }

    const oldBooking = exist.right

    const newBooking = WorkerBooking.fromPrimitives(
      oldBooking.id.toString(),
      oldBooking.workerId.toString(),
      oldBooking.clientId.toString(),
      book.status,
      book.date,
      oldBooking.createdAt.toString()
    )

    if ( newBooking instanceof Errors ) {
      return left( newBooking.values )
    }

    const result = await this.dao.update( newBooking )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right(true)
  }

}