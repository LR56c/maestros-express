import { UUID }            from "@/modules/shared/domain/value_objects/uuid"
import { Sector }          from "@/modules/sector/domain/sector"
import {
  ValidDate
}                          from "@/modules/shared/domain/value_objects/valid_date"
import {
  ValidString
}                          from "@/modules/shared/domain/value_objects/valid_string"
import { CertificateType } from "@/modules/certificate/domain/certificate_type"
import { Errors }          from "@/modules/shared/domain/exceptions/errors"
import {
  BaseException
}                          from "@/modules/shared/domain/exceptions/base_exception"
import { wrapType }        from "@/modules/shared/utils/wrap_type"

export class Certificate {
  private constructor(
    readonly id: UUID,
    readonly workerId: UUID,
    readonly name: ValidString,
    readonly url: ValidString,
    readonly type: CertificateType,
    readonly createdAt: ValidDate
  )
  {
  }

  static create(
    id: string,
    workerId: string,
    name: string,
    url: string,
    type: string
  ): Certificate | Errors {
    return Certificate.fromPrimitives(
      id,
      workerId,
      name,
      url,
      type,
      ValidDate.nowUTC()
    )
  }

  static fromPrimitivesThrow(
    id: string,
    workerId: string,
    name: string,
    url: string,
    type: CertificateType,
    createdAt: Date | string
  ): Certificate {
    return new Certificate(
      UUID.from( id ),
      UUID.from( workerId ),
      ValidString.from( name ),
      ValidString.from( url ),
      type,
      ValidDate.from( createdAt )
    )
  }

  static fromPrimitives(
    id: string,
    workerId: string,
    name: string,
    url: string,
    type: string,
    createdAt: Date | string
  ): Certificate | Errors {
    const errors = []

    const idVO = wrapType( () => UUID.from( id ) )
    if ( idVO instanceof BaseException ) {
      errors.push( idVO )
    }

    const workerIdVO = wrapType( () => UUID.from( workerId ) )

    if ( workerIdVO instanceof BaseException ) {
      errors.push( workerIdVO )
    }

    const nameVO = wrapType( () => ValidString.from( name ) )
    if ( nameVO instanceof BaseException ) {
      errors.push( nameVO )
    }

    const urlVO = wrapType( () => ValidString.from( url ) )
    if ( urlVO instanceof BaseException ) {
      errors.push( urlVO )
    }

    const typeV0 = wrapType( () => CertificateType.from( type.toUpperCase() ) )

    if ( typeV0 instanceof BaseException ) {
      errors.push( typeV0 )
    }

    const createdAtVO = wrapType( () => ValidDate.from( createdAt ) )

    if ( createdAtVO instanceof BaseException ) {
      errors.push( createdAtVO )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new Certificate(
      idVO as UUID,
      workerIdVO as UUID,
      nameVO as ValidString,
      urlVO as ValidString,
      typeV0 as CertificateType,
      createdAtVO as ValidDate
    )
  }
}