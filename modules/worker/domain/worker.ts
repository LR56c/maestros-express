import { ValidDate }                 from "@/modules/shared/domain/value_objects/valid_date"
import { UserAuth }                  from "@/modules/user/domain/user"
import {
  ValidString
}                                    from "@/modules/shared/domain/value_objects/valid_string"
import {
  ValidDecimal
}                                    from "@/modules/shared/domain/value_objects/valid_decimal"
import {
  Speciality
}                                    from "@/modules/speciality/domain/speciality"
import {
  WorkerTax
}                                    from "@/modules/worker_tax/domain/worker_tax"
import {
  Errors
}                                    from "@/modules/shared/domain/exceptions/errors"
import { wrapType, wrapTypeDefault } from "@/modules/shared/utils/wrap_type"
import {
  BaseException
}                                    from "@/modules/shared/domain/exceptions/base_exception"
import {
  WorkerStatus
}                                    from "@/modules/worker/domain/worker_status"
import {
  Position
}                                    from "@/modules/shared/domain/value_objects/position"
import {
  UUID
}                                    from "@/modules/shared/domain/value_objects/uuid"

export class Worker {
  private constructor(
    readonly user: UserAuth,
    readonly nationalIdentityId: UUID,
    readonly nationalIdentityValue: ValidString,
    readonly birthDate: ValidDate,
    readonly reviewCount: ValidDecimal,
    readonly reviewAverage: ValidDecimal,
    readonly location: Position,
    readonly status: WorkerStatus,
    readonly specialities: Speciality[],
    readonly taxes: WorkerTax[],

    // readonly workZones: Zone[],
    // readonly certificates: Certificate[],
    // readonly stories: Story[],
    // readonly schedule: WorkerSchedule[],
    // readonly reviews: Review[],
    
    // readonly bookings: WorkerBooking[],
    // readonly packages: Package[],
    readonly createdAt: ValidDate,
    readonly verifiedAt?: ValidDate,
    readonly description?: ValidString
  )
  {
  }

  static create(
    user: UserAuth,
    nationalIdentityId: string,
    nationalIdentityValue: string,
    birthDate: Date | string,
    location: string,
    status: string,
    description?: string
  ): Worker | Errors {
    return Worker.fromPrimitives(
      user,
      nationalIdentityId,
      nationalIdentityValue, birthDate, 0,
      0, location, status,
      [], [], ValidDate.nowUTC(), undefined, description
    )
  }

  static fromPrimitives(
    user: UserAuth,
    nationalIdentityId: string,
    nationalIdentityValue: string,
    birthDate: Date | string,
    reviewCount: number,
    reviewAverage: number,
    location: string,
    status: string,
    specialities: Speciality[],
    taxes: WorkerTax[],
    // workZones: Zone[],
    // certificates: Certificate[],
    // stories: Story[],
    // bookings: WorkerBooking[],
    // schedule: WorkerSchedule[],
    // packages: Package[],
    // reviews: Review[],
    createdAt: Date | string,
    verifiedAt?: Date | string,
    description?: string
  ): Worker | Errors {
    const errors = []

    const birthDateVO = wrapType( () => ValidDate.from( birthDate ) )
    if ( birthDateVO instanceof BaseException ) {
      errors.push( birthDateVO )
    }

    const descriptionVO = wrapTypeDefault( undefined,
      ( value ) => ValidString.from( value ), description )
    if ( descriptionVO instanceof BaseException ) {
      errors.push( descriptionVO )
    }

    const locationVO = wrapType( () => Position.fromJSON( location ) )
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

    const verifiedAtVO = wrapTypeDefault( undefined,
      ( value ) => ValidDate.from( value ), verifiedAt )

    if ( verifiedAtVO instanceof BaseException ) {
      errors.push( verifiedAtVO )
    }

    const vNationalIdentityId = wrapType(
      () => UUID.from( nationalIdentityId ) )

    if ( vNationalIdentityId instanceof BaseException ) {
      errors.push( vNationalIdentityId )
    }

    const vNationalIdentityValue = wrapType(
      () => ValidString.from( nationalIdentityValue ) )

    if ( vNationalIdentityValue instanceof BaseException ) {
      errors.push( vNationalIdentityValue )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new Worker(
      user,
      vNationalIdentityId as UUID,
      vNationalIdentityValue as ValidString,
      birthDateVO as ValidDate,
      reviewCountVO as ValidDecimal,
      reviewAverageVO as ValidDecimal,
      locationVO as Position,
      workerStatusVO as WorkerStatus,
      specialities,
      taxes,
      createdAtVO as ValidDate,
      verifiedAtVO as ValidDate | undefined,
      descriptionVO as ValidString | undefined
    )
  }

  static fromPrimitivesThrow(
    user: UserAuth,
    nationalIdentityId: string,
    nationalIdentityValue: string,
    birthDate: Date | string,
    reviewCount: number,
    reviewAverage: number,
    location: string,
    status: string,
    specialities: Speciality[],
    taxes: WorkerTax[],
    // certificates: Certificate[],
    // workZones: Zone[],
    // stories: Story[],
    // bookings: WorkerBooking[],
    // schedule: WorkerSchedule[],
    // packages: Package[],
    // reviews: Review[],
    createdAt: Date | string,
    description?: string,
    verifiedAt?: Date | string
  ): Worker {
    return new Worker(
      user,
      UUID.from( nationalIdentityId ),
      ValidString.from( nationalIdentityValue ), ValidDate.from( birthDate ),
      ValidDecimal.from( reviewCount ),
      ValidDecimal.from( reviewAverage ), Position.fromJSON( location ),
      WorkerStatus.from( status ), specialities,
      taxes,
      ValidDate.from( createdAt ),
      verifiedAt ? ValidDate.from( verifiedAt ) : undefined,
      description ? ValidString.from( description ) : undefined
    )
  }

}