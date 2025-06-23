import type { Either }   from "fp-ts/Either"
import {
  BaseException
}                        from "@/modules/shared/domain/exceptions/base_exception"
import { UUID }          from "@/modules/shared/domain/value_objects/uuid"
import { WorkerBooking } from "@/modules/worker_booking/domain/worker_booking"
import {
  ValidInteger
}                        from "@/modules/shared/domain/value_objects/valid_integer"
import {
  ValidString
}                        from "@/modules/shared/domain/value_objects/valid_string"

export abstract class WorkerBookingDAO {
  abstract search( query: Record<string, any>, limit?: ValidInteger,
    skip ?: ValidString, sortBy ?: ValidString,
    sortType ?: ValidString ): Promise<Either<BaseException[], WorkerBooking[]>>

  abstract request( book: WorkerBooking ): Promise<Either<BaseException, boolean>>

  abstract update( book: WorkerBooking ): Promise<Either<BaseException, boolean>>

  abstract cancel( id: UUID ): Promise<Either<BaseException, boolean>>
}
