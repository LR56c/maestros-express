import { UUID }     from "@/modules/shared/domain/value_objects/uuid"
import { Errors }   from "@/modules/shared/domain/exceptions/errors"
import { wrapType } from "@/modules/shared/utils/wrap_type"
import {
  InvalidUUIDException
}                   from "@/modules/shared/domain/exceptions/invalid_uuid_exception"
import {
  BaseException
}                   from "@/modules/shared/domain/exceptions/base_exception"
import {
  ValidDate
}                   from "@/modules/shared/domain/value_objects/valid_date"
import { Sector }   from "@/modules/sector/domain/sector"

export class Zone {
  private constructor(
    readonly id: UUID,
    readonly workerId: UUID,
    readonly sector: Sector,
    readonly createdAt: ValidDate
  )
  {
  }

  static create(
    id: string,
    workerId: string,
    sector: Sector
  ): Zone | Errors {
    return Zone.fromPrimitives( id, workerId, sector, ValidDate.nowUTC() )
  }

  static fromPrimitivesThrow(
    id: string,
    workerId: string,
    sector: Sector,
    createdAt: Date
  ): Zone {
    return new Zone(
      UUID.from( id ),
      UUID.from( workerId ),
      sector,
      ValidDate.from( createdAt )
    )
  }

  static fromPrimitives(
    id: string,
    workerId: string,
    sector: Sector,
    createdAt: Date | string
  ): Zone | Errors {
    const errors = []

    const idVO = wrapType<UUID, InvalidUUIDException>(
      () => UUID.from( id ) )

    if ( idVO instanceof BaseException ) {
      errors.push( idVO )
    }

    const workerIdVO = wrapType<UUID, InvalidUUIDException>(
      () => UUID.from( workerId ) )

    if ( workerIdVO instanceof BaseException ) {
      errors.push( workerIdVO )
    }

    const createdAtVO = wrapType( () => ValidDate.from( createdAt ) )

    if ( createdAtVO instanceof BaseException ) {
      errors.push( createdAtVO )
    }

    if ( errors.length ) {
      return new Errors( errors )
    }

    return new Zone(
      idVO as UUID,
      workerIdVO as UUID,
      sector,
      createdAtVO as ValidDate
    )
  }
}