import { z } from "zod"
import {
  InvalidWorkerBookingStatusException
}            from "@/modules/worker_booking/domain/exception/invalid_worker_booking_status_exception"

export enum WorkingBookingStatusEnum {
  AVAILABLE = "AVAILABLE",
  BOOKED    = "BOOKED"
}

export class WorkingBookingStatus {

  readonly value: WorkingBookingStatusEnum

  private constructor( value: WorkingBookingStatusEnum ) {
    this.value = value
  }

  static create( value: WorkingBookingStatusEnum ): WorkingBookingStatus {
    return new WorkingBookingStatus( value )
  }

  static from( value: string ): WorkingBookingStatus {
    const result = z.nativeEnum( WorkingBookingStatusEnum )
                    .safeParse( value )
    if ( !result.success ) {
      throw new InvalidWorkerBookingStatusException()
    }
    return new WorkingBookingStatus( result.data )
  }

  static fromOrNull( value: string ): WorkingBookingStatus | undefined {
    try {
      return WorkingBookingStatus.from( value )
    }
    catch {
      return undefined
    }
  }
}
