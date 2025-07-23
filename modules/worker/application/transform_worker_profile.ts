import { Either, left, right } from "fp-ts/Either"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import {
  WorkerProfileDTO
}                              from "@/modules/worker/application/worker_profile_dto"
import { Worker }              from "@/modules/worker/domain/worker"
import { wrapTypeDefault }     from "@/modules/shared/utils/wrap_type"
import {
  Position
}                              from "@/modules/shared/domain/value_objects/position"
import { calculateDistance }   from "@/modules/shared/utils/calculate_distance"
import { WorkerMapper }        from "@/modules/worker/application/worker_mapper"
import { calculateAge }        from "@/modules/shared/utils/calculate_age"

export class TransformWorkerProfile {
  async execute( workers: Worker[],
    location?: string ): Promise<Either<BaseException[], WorkerProfileDTO[]>> {

    const userLocation = wrapTypeDefault(undefined, (value) => Position.fromJSON( value ),location )

    if ( userLocation instanceof BaseException ) {
      return left( [userLocation] )
    }
    const response: WorkerProfileDTO[] = []
    for ( const w of workers ) {
      const distance = userLocation instanceof Position ? calculateDistance( userLocation.value, w.location.toJson() ) : ""
      const mapped: WorkerProfileDTO = WorkerMapper.toProfile( w, calculateAge( w.birthDate.value ), distance )
      response.push( mapped )
    }
    return right( response )

  }
}