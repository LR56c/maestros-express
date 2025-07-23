import { UUID }                      from "@/modules/shared/domain/value_objects/uuid"
import {
  ValidDate
}                                    from "@/modules/shared/domain/value_objects/valid_date"
import {
  ValidString
}                                    from "@/modules/shared/domain/value_objects/valid_string"
import {
  ValidInteger
}                                    from "@/modules/shared/domain/value_objects/valid_integer"
import {
  Errors
}                                    from "@/modules/shared/domain/exceptions/errors"
import {
  BaseException
}                                    from "@/modules/shared/domain/exceptions/base_exception"
import { wrapType, wrapTypeDefault } from "@/modules/shared/utils/wrap_type"

export class QuotationDetail {
  private constructor(
    readonly id: UUID,
    readonly quotationId: UUID,
    readonly name: ValidString,
    readonly value: ValidInteger,
    readonly valueFormat: ValidString,
    readonly createdAt: ValidDate,
    readonly description?: ValidString
  )
  {
  }

  static create(
    id: string,
    quotationId: string,
    name: string,
    value: number,
    valueFormat: string,
    description?: string
  ): QuotationDetail | Errors {
    return QuotationDetail.fromPrimitives(
      id,
      quotationId,
      name,
      value,
      valueFormat,
      ValidDate.nowUTC(),
      description
    )
  }

  static fromPrimitivesThrow(
    id: string,
    quotationId: string,
    name: string,
    value: number,
    valueFormat: string,
    createdAt: Date | string,
    description?: string,
  ): QuotationDetail {
    return new QuotationDetail(
      UUID.from( id ),
      UUID.from( quotationId ),
      ValidString.from( name ),
      ValidInteger.from( value ),
      ValidString.from( valueFormat ),
      ValidDate.from( createdAt ),
      description ? ValidString.from( description ) : undefined
    )
  }

  static fromPrimitives(
    id: string,
    quotationId: string,
    name: string,
    value: number,
    valueFormat: string,
    createdAt: Date | string,
    description: string | undefined
  ): QuotationDetail | Errors {
    const errors = []

    const idVO = wrapType( () => UUID.from( id ) )
    if ( idVO instanceof BaseException ) {
      errors.push( idVO )
    }

    const quotationIdVO = wrapType( () => UUID.from( quotationId ) )
    if ( quotationIdVO instanceof BaseException ) {
      errors.push( quotationIdVO )
    }

    const nameVO = wrapType( () => ValidString.from( name ) )
    if ( nameVO instanceof BaseException ) {
      errors.push( nameVO )
    }

    const descriptionVO = wrapTypeDefault(undefined, (value) => ValidString.from( value ),description )
    if ( descriptionVO instanceof BaseException ) {
      errors.push( descriptionVO )
    }

    const valueVO = wrapType( () => ValidInteger.from( value ) )
    if ( valueVO instanceof BaseException ) {
      errors.push( valueVO )
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

    return new QuotationDetail(
      idVO as UUID,
      quotationIdVO as UUID,
      nameVO as ValidString,
      valueVO as ValidInteger,
      valueFormatVO as ValidString,
      createdAtVO as ValidDate,
      descriptionVO as ValidString | undefined
    )
  }
}