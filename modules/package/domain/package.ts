import { UUID }     from "@/modules/shared/domain/value_objects/uuid"
import {
  ValidDate
}                   from "@/modules/shared/domain/value_objects/valid_date"
import {
  ValidString
}                   from "@/modules/shared/domain/value_objects/valid_string"
import { Errors }   from "@/modules/shared/domain/exceptions/errors"
import {
  BaseException
}                   from "@/modules/shared/domain/exceptions/base_exception"
import { wrapType } from "@/modules/shared/utils/wrap_type"
import {
  ValidDecimal
}                   from "@/modules/shared/domain/value_objects/valid_decimal"
import {
  PackageDocument
}                   from "@/modules/package/modules/package_document/domain/package_document"

export class Package {
  private constructor(
    readonly id: UUID,
    readonly workerId: UUID,
    readonly name: ValidString,
    readonly description: ValidString,
    readonly specification: ValidString,
    readonly value: ValidDecimal,
    readonly reviewCount: ValidDecimal,
    readonly reviewAverage: ValidDecimal,
    readonly coverUrl: ValidString,
    readonly valueFormat: ValidString,
    readonly documents: PackageDocument[],
    readonly createdAt: ValidDate
  )
  {
  }

  static create(
    id: string,
    workerId: string,
    name: string,
    description: string,
    specification: string,
    value: number,
    coverUrl: string,
    valueFormat: string,
    documents: PackageDocument[],
  ): Package | Errors {
    return Package.fromPrimitives(
      id, workerId,name, description, specification, value, 0,
      0, coverUrl, valueFormat, documents, ValidDate.nowUTC()
    )
  }

  static fromPrimitives(
    id: string,
    workerId: string,
    name: string,
    description: string,
    specification: string,
    value: number,
    reviewCount: number,
    reviewAverage: number,
    coverUrl: string,
    valueFormat: string,
    documents: PackageDocument[],
    createdAt: Date | string
  ): Package | Errors {
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

    const descriptionVO = wrapType( () => ValidString.from( description ) )
    if ( descriptionVO instanceof BaseException ) {
      errors.push( descriptionVO )
    }

    const specificationVO = wrapType( () => ValidString.from( specification ) )
    if ( specificationVO instanceof BaseException ) {
      errors.push( specificationVO )
    }

    const valueVO = wrapType( () => ValidDecimal.from( value ) )
    if ( valueVO instanceof BaseException ) {
      errors.push( valueVO )
    }

    const reviewCountVO = wrapType( () => ValidDecimal.from( reviewCount ) )
    if ( reviewCountVO instanceof BaseException ) {
      errors.push( reviewCountVO )
    }

    const reviewAverageVO = wrapType( () => ValidDecimal.from( reviewAverage ) )
    if ( reviewAverageVO instanceof BaseException ) {
      errors.push( reviewAverageVO )
    }

    const coverUrlVO = wrapType( () => ValidString.from( coverUrl ) )
    if ( coverUrlVO instanceof BaseException ) {
      errors.push( coverUrlVO )
    }

    const valueFormatVO = wrapType( () => ValidString.from( valueFormat ) )
    if ( valueFormatVO instanceof BaseException ) {
      errors.push( valueFormatVO )
    }

    const createdAtVO = wrapType( () => ValidDate.from( createdAt ) )
    if ( createdAtVO instanceof BaseException ) {
      errors.push( createdAtVO )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new Package(
      idVO as UUID,
      workerIdVO as UUID,
      nameVO as ValidString,
      descriptionVO as ValidString,
      specificationVO as ValidString,
      valueVO as ValidDecimal,
      reviewCountVO as ValidDecimal,
      reviewAverageVO as ValidDecimal,
      coverUrlVO as ValidString,
      valueFormatVO as ValidString,
      documents,
      createdAtVO as ValidDate
    )
  }

  static fromPrimitivesThrow(
    id: string,
    workerId: string,
    name: string,
    description: string,
    specification: string,
    value: number,
    reviewCount: number,
    reviewAverage: number,
    coverUrl: string,
    valueFormat: string,
    documents: PackageDocument[],
    createdAt: Date
  ): Package {
    return new Package(
      UUID.from( id ),
      UUID.from( workerId ),
      ValidString.from( name ),
      ValidString.from( description ),
      ValidString.from( specification ),
      ValidDecimal.from( value ),
      ValidDecimal.from( reviewCount ),
      ValidDecimal.from( reviewAverage ),
      ValidString.from( coverUrl ),
      ValidString.from( valueFormat ),
      documents,
      ValidDate.from( createdAt )
    )
  }
}