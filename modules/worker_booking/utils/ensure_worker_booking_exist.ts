import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  ValidInteger
}                                      from "@/modules/shared/domain/value_objects/valid_integer"
import {
  DataNotFoundException
}                                      from "@/modules/shared/domain/exceptions/data_not_found_exception"
import {
  WorkerBookingDAO
}                                      from "@/modules/worker_booking/domain/worker_booking_dao"
import {
  WorkerBooking
}                                      from "@/modules/worker_booking/domain/worker_booking"

export const ensureWorkerBookingExist = async ( dao: WorkerBookingDAO,
  bookId: string ): Promise<Either<BaseException[], WorkerBooking>> => {

  const book = await dao.search({
    id: bookId
  }, ValidInteger.from(1))

  if ( isLeft(book) ) {
    return left(book.left)
  }

  if ( book.right.length > 0 && book.right[0]!.id.value !== bookId ) {
    return left( [new DataNotFoundException()] )
  }

  return right(book.right[0])
}