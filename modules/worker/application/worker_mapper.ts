import { Worker }                    from "@/modules/worker/domain/worker"
import {
  WorkerResponse
}                                    from "@/modules/worker/application/worker_response"
import {
  UserMapper
}                                    from "@/modules/user/application/user_mapper"
import {
  NationalIdentityMapper
}                                    from "@/modules/national_identity/application/national_identity_mapper"
import {
  SpecialityMapper
}                                    from "@/modules/speciality/application/speciality_mapper"
import {
  WorkerTax
}                                    from "@/modules/worker_tax/domain/worker_tax"
import {
  WorkerTaxMapper
}                                    from "@/modules/worker_tax/application/worker_tax_mapper"
import {
  Errors
}                                    from "@/modules/shared/domain/exceptions/errors"
import {
  Speciality
}                                    from "@/modules/speciality/domain/speciality"
import {
  SpecialityDTO
}                                    from "@/modules/speciality/application/speciality_dto"
import {
  WorkerTaxDTO
}                                    from "@/modules/worker_tax/application/worker_tax_dto"
import {
  BaseException
}                                    from "@/modules/shared/domain/exceptions/base_exception"
import {
  ValidString
}                                    from "@/modules/shared/domain/value_objects/valid_string"
import {
  ValidDecimal
}                                    from "@/modules/shared/domain/value_objects/valid_decimal"
import {
  UserResponse
}                                    from "@/modules/user/application/user_response"
import {
  NationalIdentifierDTO
}                                    from "@/modules/national_identity/application/national_identity_dto"
import { wrapType, wrapTypeDefault } from "@/modules/shared/utils/wrap_type"
import {
  WorkerStatus
}                                    from "@/modules/worker/domain/worker_status"
import {
  WorkerProfileDTO
}                                    from "@/modules/worker/application/worker_profile_dto"
import {
  Position
}                                    from "@/modules/shared/domain/value_objects/position"

export class WorkerMapper {
  static toProfile( w: Worker, age: number,
    location: string ): WorkerProfileDTO {
    return {
      user_id       : w.user.userId.toString(),
      full_name     : `${ w.user.name.value } ${ w.user.surname.value }`,
      avatar        : w.user.avatar?.value,
      age,
      description   : w.description?.value ?? "",
      review_count  : w.reviewCount.value,
      review_average: w.reviewAverage.value,
      location,
      specialities  : w.specialities.map( SpecialityMapper.toDTO ),
      taxes         : w.taxes.map( WorkerTaxMapper.toDTO )
    }
  }

  static toDTO( worker: Worker ): WorkerResponse {
    return {
      user             : UserMapper.toDTO( worker.user ),
      national_identity: NationalIdentityMapper.toDTO(
        worker.nationalIdentity ),
      birth_date       : worker.birthDate.toString(),
      description      : worker.description?.value,
      review_count     : worker.reviewCount.value,
      review_average   : worker.reviewAverage.value,
      status           : worker.status.value,
      location         : worker.location.toPoint(),
      specialities     : worker.specialities.map( SpecialityMapper.toDTO ),
      taxes            : worker.taxes.map( WorkerTaxMapper.toDTO )
      // work_zones       : worker.workZones.map( ZoneMapper.toDTO ),
      // certificates     : worker.certificates.map( CertificateMapper.toDTO ),
      // stories          : worker.stories.map( StoryMapper.toDTO ),
      // bookings         : worker.bookings.map( WorkerBookingMapper.toDTO ),
      // schedule         : worker.schedule.map( WorkerScheduleMapper.toDTO ),
      // packages         : worker.packages.map( PackageMapper.toDTO ),
      // reviews          : worker.reviews.map( ReviewMapper.toDTO )
    }
  }

  static toJSON( dto: WorkerResponse ): Record<string, any> {
    return {
      user             : UserMapper.toJSON( dto.user ),
      national_identity: NationalIdentityMapper.toJSON(
        dto.national_identity ),
      birth_date       : dto.birth_date,
      description      : dto.description,
      review_count     : dto.review_count,
      review_average   : dto.review_average,
      status           : dto.status,
      location         : dto.location,
      specialities     : dto.specialities.map( SpecialityMapper.toJSON ),
      taxes            : dto.taxes.map( WorkerTaxMapper.toJSON )
      // certificates     : dto.certificates.map( CertificateMapper.toJSON ),
      // work_zones       : dto.work_zones.map( ZoneMapper.toJSON ),
      // stories          : dto.stories.map( StoryMapper.toJSON ),
      // bookings         : dto.bookings.map( WorkerBookingMapper.toJSON ),
      // schedule         : dto.schedule.map( WorkerScheduleMapper.toJSON ),
      // packages         : dto.packages.map( PackageMapper.toJSON ),
      // reviews          : dto.reviews.map( ReviewMapper.toJSON )
    }
  }

  static fromJSON( json: Record<string, any> ): WorkerResponse | Errors {
    const errors = []

    const user = UserMapper.fromJSON( json.user )

    if ( user instanceof Errors ) {
      errors.push( ...user.values )
    }

    const nationalIdentity = NationalIdentityMapper.fromJSON(
      json.national_identity )

    if ( nationalIdentity instanceof Errors ) {
      errors.push( ...nationalIdentity.values )
    }

    const specialities: SpecialityDTO[] = []

    for ( const speciality of json.specialities ) {
      const mappedSpeciality = SpecialityMapper.fromJSON( speciality )
      if ( mappedSpeciality instanceof Errors ) {
        errors.push( ...mappedSpeciality.values )
      }
      else {
        specialities.push( mappedSpeciality )
      }
    }

    // const certificates: CertificateDTO[] = []
    // for ( const certificate of json.certificates ) {
    //   const mappedCertificate = CertificateMapper.fromJSON( certificate )
    //   if ( mappedCertificate instanceof Errors ) {
    //     errors.push( ...mappedCertificate.values )
    //   }
    //   else {
    //     certificates.push( mappedCertificate )
    //   }
    // }

    // const workZones: ZoneDTO[] = []
    // for ( const zone of json.work_zones ) {
    //   const mappedZone = ZoneMapper.fromJSON( zone )
    //   if ( mappedZone instanceof Errors ) {
    //     errors.push( ...mappedZone.values )
    //   }
    //   else {
    //     workZones.push( mappedZone )
    //   }
    // }

    const taxes: WorkerTaxDTO[] = []
    for ( const tax of json.taxes ) {
      const mappedTax = WorkerTaxMapper.fromJSON( tax )
      if ( mappedTax instanceof Errors ) {
        errors.push( ...mappedTax.values )
      }
      else {
        taxes.push( mappedTax )
      }
    }

    // const stories: StoryDTO[] = []
    // for ( const story of json.stories ) {
    //   const mappedStory = StoryMapper.fromJSON( story )
    //   if ( mappedStory instanceof Errors ) {
    //     errors.push( ...mappedStory.values )
    //   }
    //   else {
    //     stories.push( mappedStory )
    //   }
    // }

    // const bookings: WorkerBookingDTO[] = []
    // for ( const booking of json.bookings ) {
    //   const mappedBooking = WorkerBookingMapper.fromJSON( booking )
    //   if ( mappedBooking instanceof Errors ) {
    //     errors.push( ...mappedBooking.values )
    //   }
    //   else {
    //     bookings.push( mappedBooking )
    //   }
    // }

    // const schedule: WorkerScheduleDTO[] = []
    // for ( const sched of json.schedule ) {
    //   const mappedSchedule = WorkerScheduleMapper.fromJSON( sched )
    //   if ( mappedSchedule instanceof Errors ) {
    //     errors.push( ...mappedSchedule.values )
    //   }
    //   else {
    //     schedule.push( mappedSchedule )
    //   }
    // }

    // const packages: PackageDTO[] = []
    // for ( const pkg of json.packages ) {
    //   const mappedPackage = PackageMapper.fromJSON( pkg )
    //   if ( mappedPackage instanceof Errors ) {
    //     errors.push( ...mappedPackage.values )
    //   }
    //   else {
    //     packages.push( mappedPackage )
    //   }
    // }

    // const reviews: ReviewDTO[] = []
    // for ( const review of json.reviews ) {
    //   const mappedReview = ReviewMapper.fromJSON( review )
    //   if ( mappedReview instanceof Errors ) {
    //     errors.push( ...mappedReview.values )
    //   }
    //   else {
    //     reviews.push( mappedReview )
    //   }
    // }

    const birhtDate = wrapType(
      () => ValidString.from( json.birth_date ) )

    if ( birhtDate instanceof BaseException ) {
      errors.push( birhtDate )
    }

    const description = wrapTypeDefault( undefined,
      ( value ) => ValidString.from( value ), json.description )

    if ( description instanceof BaseException ) {
      errors.push( description )
    }

    const reviewCount = wrapType(
      () => ValidDecimal.from( json.review_count ) )

    if ( reviewCount instanceof BaseException ) {
      errors.push( reviewCount )
    }

    const reviewAverage = wrapType(
      () => ValidDecimal.from( json.review_average ) )

    if ( reviewAverage instanceof BaseException ) {
      errors.push( reviewAverage )
    }

    const status = wrapType(
      () => WorkerStatus.from( json.status ) )

    if ( status instanceof BaseException ) {
      errors.push( status )
    }

    const location = wrapType(
      () => Position.fromJSON( json.location ) )

    if ( location instanceof BaseException ) {
      errors.push( location )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      user             : user as UserResponse,
      national_identity: nationalIdentity as NationalIdentifierDTO,
      birth_date       : (
        birhtDate as ValidString
      ).value,
      description      : description instanceof ValidString ?
        description.value : undefined,
      review_count     : (
        reviewCount as ValidDecimal
      ).value,
      review_average   : (
        reviewAverage as ValidDecimal
      ).value,
      status           : (
        status as WorkerStatus
      ).value,
      location         : (
        location as Position
      ).toPoint(),
      specialities     : specialities,
      taxes            : taxes
      // certificates     : certificates,
      // work_zones       : workZones,
      // stories          : stories,
      // bookings         : bookings,
      // schedule         : schedule,
      // packages         : packages,
      // reviews          : reviews
    }
  }

  static toDomain( json: Record<string, any> ): Worker | Errors {
    const user = UserMapper.toDomain( json.user )

    if ( user instanceof Errors ) {
      return user
    }

    const nationalIdentity = NationalIdentityMapper.toDomain(
      json.national_identity )

    if ( nationalIdentity instanceof Errors ) {
      return nationalIdentity
    }

    const specialities: Speciality[] = []
    for ( const speciality of json.specialities ) {
      const mappedSpeciality = SpecialityMapper.toDomain( speciality )
      if ( mappedSpeciality instanceof Errors ) {
        return mappedSpeciality
      }
      specialities.push( mappedSpeciality )
    }

    // const certificates: Certificate[] = []
    // for ( const certificate of json.certificates ) {
    //   const mappedCertificate = CertificateMapper.toDomain( certificate )
    //   if ( mappedCertificate instanceof Errors ) {
    //     return mappedCertificate
    //   }
    //   certificates.push( mappedCertificate )
    // }

    // const workZones: Zone[] = []
    // for ( const zone of json.work_zones ) {
    //   const mappedZone = ZoneMapper.toDomain( zone )
    //   if ( mappedZone instanceof Errors ) {
    //     return mappedZone
    //   }
    //   workZones.push( mappedZone )
    // }

    const taxes: WorkerTax[] = []
    for ( const tax of json.taxes ) {
      const mappedTax = WorkerTaxMapper.toDomain( tax )
      if ( mappedTax instanceof Errors ) {
        return mappedTax
      }
      taxes.push( mappedTax )
    }

    // const stories: Story[] = []
    // for ( const story of json.stories ) {
    //   const mappedStory = StoryMapper.toDomain( story )
    //   if ( mappedStory instanceof Errors ) {
    //     return mappedStory
    //   }
    //   stories.push( mappedStory )
    // }

    // const bookings: WorkerBooking[] = []
    // for ( const booking of json.bookings ) {
    //   const mappedBooking = WorkerBookingMapper.toDomain( booking )
    //   if ( mappedBooking instanceof Errors ) {
    //     return mappedBooking
    //   }
    //   bookings.push( mappedBooking )
    // }

    // const schedule: WorkerSchedule[] = []
    // for ( const sched of json.schedule ) {
    //   const mappedSchedule = WorkerScheduleMapper.toDomain( sched )
    //   if ( mappedSchedule instanceof Errors ) {
    //     return mappedSchedule
    //   }
    //   schedule.push( mappedSchedule )
    // }

    // const packages: Package[] = []
    // for ( const pkg of json.packages ) {
    //   const mappedPackage = PackageMapper.toDomain( pkg )
    //   if ( mappedPackage instanceof Errors ) {
    //     return mappedPackage
    //   }
    //   packages.push( mappedPackage )
    // }

    // const reviews: Review[] = []
    // for ( const review of json.reviews ) {
    //   const mappedReview = ReviewMapper.toDomain( review )
    //   if ( mappedReview instanceof Errors ) {
    //     return mappedReview
    //   }
    //   reviews.push( mappedReview )
    // }

    return Worker.fromPrimitives(
      user,
      nationalIdentity,
      json.birth_date,
      json.review_count,
      json.review_average,
      json.status,
      json.location,
      specialities,
      taxes,
      // certificates,
      // workZones,
      // stories,
      // bookings,
      // schedule,
      // packages,
      // reviews,
      json.created_at,
      json.verified_at,
      json.description
    )

  }
}