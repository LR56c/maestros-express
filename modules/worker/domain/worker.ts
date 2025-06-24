import { ValidDate }    from "@/modules/shared/domain/value_objects/valid_date"
import { User }         from "@/modules/user/domain/user"
import {
  NationalIdentity
}                       from "@/modules/national_identity/domain/national_identity"
import {
  ValidString
}                       from "@/modules/shared/domain/value_objects/valid_string"
import {
  ValidDecimal
}                       from "@/modules/shared/domain/value_objects/valid_decimal"
import {
  ValidBool
}                       from "@/modules/shared/domain/value_objects/valid_bool"
import { Speciality }   from "@/modules/speciality/domain/speciality"
import { Certificate }  from "@/modules/certificate/domain/certificate"
import { Zone }         from "@/modules/zone/domain/zone"
import { WorkerTax }    from "@/modules/worker_tax/domain/worker_tax"
import { Story }        from "@/modules/story/domain/story"
import {
  WorkerBooking
}                       from "@/modules/worker_booking/domain/worker_booking"
import {
  WorkerSchedule
}                       from "@/modules/worker_schedule/domain/worker_schedule"
import { Package }      from "@/modules/package/domain/package"
import { Review }       from "@/modules/review/domain/review"
import { Errors }       from "@/modules/shared/domain/exceptions/errors"
import { wrapType }     from "@/modules/shared/utils/wrap_type"
import {
  BaseException
}                       from "@/modules/shared/domain/exceptions/base_exception"
import { WorkerStatus } from "@/modules/worker/domain/worker_status"

export class Worker {
  private constructor(
    readonly user: User,
    readonly nationalIdentity: NationalIdentity,
    readonly birthDate: ValidDate,
    readonly description: ValidString,
    readonly reviewCount: ValidDecimal,
    readonly reviewAverage: ValidDecimal,
    readonly location: ValidString,
    readonly status: WorkerStatus,
    readonly specialities: Speciality[],
    readonly certificates: Certificate[],
    readonly workZones: Zone[],
    readonly taxes: WorkerTax[],
    readonly stories: Story[],
    readonly bookings: WorkerBooking[],
    readonly schedule: WorkerSchedule[],
    readonly packages: Package[],
    readonly reviews: Review[],
    readonly createdAt: ValidDate
  )
  {
  }

  static create(
    user: User,
    nationalIdentity: NationalIdentity,
    birthDate: Date | string,
    description: string,
    location: string,
    status: string
  ): Worker | Errors {
    return Worker.fromPrimitives(
      user, nationalIdentity, birthDate, description, 0,
      0, location, status,
      [], [], [], [], [], [], [], [], [], ValidDate.nowUTC()
    )
  }

  static fromPrimitives(
    user: User,
    nationalIdentity: NationalIdentity,
    birthDate: Date | string,
    description: string,
    reviewCount: number,
    reviewAverage: number,
    location: string,
    status: string,
    specialities: Speciality[],
    certificates: Certificate[],
    workZones: Zone[],
    taxes: WorkerTax[],
    stories: Story[],
    bookings: WorkerBooking[],
    schedule: WorkerSchedule[],
    packages: Package[],
    reviews: Review[],
    createdAt: Date | string
  ): Worker | Errors {
    const errors = []

    const birthDateVO = wrapType( () => ValidDate.from( birthDate ) )
    if ( birthDateVO instanceof BaseException ) {
      errors.push( birthDateVO )
    }

    const descriptionVO = wrapType( () => ValidString.from( description ) )
    if ( descriptionVO instanceof BaseException ) {
      errors.push( descriptionVO )
    }

    const locationVO = wrapType( () => ValidString.from( location ) )
    if ( locationVO instanceof BaseException ) {
      errors.push( locationVO )
    }

    const workerStatusVO = wrapType( () => WorkerStatus.from( status ) )
    if ( workerStatusVO instanceof BaseException ) {
      errors.push( workerStatusVO )
    }

    const createdAtVO = wrapType( () => ValidDate.from( createdAt ) )

    if ( createdAtVO instanceof BaseException ) {
      errors.push( createdAtVO )
    }

    const reviewCountVO = wrapType( () => ValidDecimal.from( reviewCount ) )
    if ( reviewCountVO instanceof BaseException ) {
      errors.push( reviewCountVO )
    }

    const reviewAverageVO = wrapType( () => ValidDecimal.from( reviewAverage ) )
    if ( reviewAverageVO instanceof BaseException ) {
      errors.push( reviewAverageVO )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new Worker(
      user,
      nationalIdentity,
      birthDateVO as ValidDate,
      descriptionVO as ValidString,
      reviewCountVO as ValidDecimal,
      reviewAverageVO as ValidDecimal,
      locationVO as ValidString,
      workerStatusVO as WorkerStatus,
      specialities, certificates, workZones,
      taxes, stories, bookings, schedule, packages, reviews,
      createdAtVO as ValidDate
    )
  }

  static fromPrimitivesThrow(
    user: User,
    nationalIdentity: NationalIdentity,
    birthDate: Date | string,
    description: string,
    reviewCount: number,
    reviewAverage: number,
    location: string,
    status: string,
    specialities: Speciality[],
    certificates: Certificate[],
    workZones: Zone[],
    taxes: WorkerTax[],
    stories: Story[],
    bookings: WorkerBooking[],
    schedule: WorkerSchedule[],
    packages: Package[],
    reviews: Review[],
    createdAt: Date | string
  ): Worker {
    return new Worker(
      user, nationalIdentity, ValidDate.from( birthDate ),
      ValidString.from( description ), ValidDecimal.from( reviewCount ),
      ValidDecimal.from( reviewAverage ), ValidString.from( location ),
      WorkerStatus.from( status ), specialities, certificates, workZones,
      taxes, stories, bookings, schedule, packages, reviews,
      ValidDate.from( createdAt )
    )
  }

}