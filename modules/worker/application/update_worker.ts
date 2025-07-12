import { WorkerDAO }                   from "@/modules/worker/domain/worker_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  ensureWorkerExist
}                                      from "@/modules/worker/utils/ensure_worker_exist"
import {
  WorkerUpdateDTO
}                                      from "@/modules/worker/application/worker_update_dto"
import { Worker }                      from "@/modules/worker/domain/worker"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"
import { wrapTypeDefault }             from "@/modules/shared/utils/wrap_type"
import {
  ValidString
}                                      from "@/modules/shared/domain/value_objects/valid_string"
import {
  WorkerStatus
}                                      from "@/modules/worker/domain/worker_status"
import {
  ValidDecimal
}                                      from "@/modules/shared/domain/value_objects/valid_decimal"
import {
  ValidBool
}                                      from "@/modules/shared/domain/value_objects/valid_bool"
import {
  Speciality
}                                      from "@/modules/speciality/domain/speciality"
import {
  SearchSpeciality
}                                      from "@/modules/speciality/application/search_speciality"
import {
  SpecialityDTO
}                                      from "@/modules/speciality/application/speciality_dto"
import {
  Position
}                                      from "@/modules/shared/domain/value_objects/position"
import {
  UpsertWorkerEmbedding
}                                      from "@/modules/worker_embedding/application/upsert_worker_embedding"
import {
  WorkerMapper
}                                      from "@/modules/worker/application/worker_mapper"
import {
  UUID
}                                      from "@/modules/shared/domain/value_objects/uuid"
import {
  WorkerEmbeddingTypeEnum
}                                      from "@/modules/worker_embedding/domain/worker_embedding_type"
import {
  UploadFileRepository
}                                      from "@/modules/shared/domain/upload_file_repository"

export class UpdateWorker {
  constructor(
    private readonly dao: WorkerDAO,
    private readonly searchSpecialities: SearchSpeciality,
    private readonly embedding: UpsertWorkerEmbedding,
    private readonly uploader: UploadFileRepository
  )
  {
  }

  private async ensureSpecialities( search: SearchSpeciality,
    newSpecialities: SpecialityDTO[] ): Promise<Either<BaseException[], Speciality[]>> {
    const specialitiesResult = await search.execute( {
      ids: newSpecialities.map( ( s ) => s.id.toString() ).join( "," )
    } )

    if ( isLeft( specialitiesResult ) ) {
      return left( specialitiesResult.left )
    }

    return right( specialitiesResult.right )
  }

  async execute( worker: WorkerUpdateDTO ): Promise<Either<BaseException[], Worker>> {
    const errors = []
    const exist  = await ensureWorkerExist( this.dao, worker.user.email )

    if ( isLeft( exist ) ) {
      return left( exist.left )
    }


    const oldWorker          = exist.right
    const updatedDescription = wrapTypeDefault( oldWorker.description,
      ( value ) => ValidString.from( value ), worker.description )

    if ( updatedDescription instanceof BaseException ) {
      errors.push( updatedDescription )
    }

    const updatedLocation = wrapTypeDefault( oldWorker.location,
      ( value ) => Position.fromJSON( value ), worker.location )

    if ( updatedLocation instanceof BaseException ) {
      errors.push( updatedLocation )
    }

    const updatedStatus = wrapTypeDefault( oldWorker.status,
      ( value ) => WorkerStatus.from( value ), worker.status )

    if ( updatedStatus instanceof BaseException ) {
      errors.push( updatedStatus )
    }

    const updatedReviewCount = wrapTypeDefault( oldWorker.reviewCount,
      ( value ) => ValidDecimal.from( value ), worker.review_count )

    if ( updatedReviewCount instanceof BaseException ) {
      errors.push( updatedReviewCount )
    }

    const updatedReviewAverage = wrapTypeDefault( oldWorker.reviewAverage,
      ( value ) => ValidDecimal.from( value ), worker.review_average )

    if ( updatedReviewAverage instanceof BaseException ) {
      errors.push( updatedReviewAverage )
    }

    const updatedVerified = wrapTypeDefault( undefined,
      ( value ) => ValidBool.from( value ), worker.verified )

    if ( updatedVerified instanceof BaseException ) {
      errors.push( updatedVerified )
    }

    let newSpecialities: Speciality[] = []
    if ( worker.specialities ) {
      const specialities = await this.ensureSpecialities(
        this.searchSpecialities, worker.specialities )
      if ( isLeft( specialities ) ) {
        errors.push( ...specialities.left )
      }
      else {
        newSpecialities.push( ...specialities.right )
      }
    }
    else if ( worker.specialities === null ) {
      newSpecialities = []
    }
    else {
      newSpecialities.push( ...oldWorker.specialities )
    }

    if ( errors.length > 0 ) {
      return left( errors )
    }

    const updatedWorker = Worker.fromPrimitives(
      oldWorker.user,
      oldWorker.nationalIdentityId.value,
      oldWorker.nationalIdentityValue.value,
      oldWorker.birthDate.toString(),
      (
        updatedReviewCount as ValidDecimal
      ).value,
      (
        updatedReviewAverage as ValidDecimal
      ).value,
      (
        updatedLocation as Position
      ).toString(),
      (
        updatedStatus as WorkerStatus
      ).value,
      newSpecialities,
      oldWorker.taxes,
      oldWorker.createdAt.toString(),
      updatedVerified instanceof ValidBool
        ? new Date()
        : oldWorker.verifiedAt?.value,
      updatedDescription instanceof ValidString
        ? updatedDescription.value
        : undefined
    )

    if ( updatedWorker instanceof Errors ) {
      return left( updatedWorker.values )
    }

    const updated = await this.dao.update( updatedWorker )

    if ( isLeft( updated ) ) {
      return left( [updated.left] )
    }

    const workerMapped = WorkerMapper.toDTO( updatedWorker )

    const embeddingResult = await this.embedding.execute( {
      id      : UUID.create().toString(),
      location: updatedWorker.location.toString(),
      data    : {
        type: WorkerEmbeddingTypeEnum.WORKER,
        ...workerMapped
      }
    } )

    if ( isLeft( embeddingResult ) ) {
      return left( embeddingResult.left )
    }

    return right( updatedWorker )
  }

}