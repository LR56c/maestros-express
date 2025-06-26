import { QuotationResponse } from "@/modules/quotation/application/quotation_response"
import { Quotation }         from "@/modules/quotation/domain/quotation"
import {
  Errors
}                                    from "@/modules/shared/domain/exceptions/errors"
import { Zone }                      from "@/modules/zone/domain/zone"
import { wrapType, wrapTypeDefault } from "@/modules/shared/utils/wrap_type"
import {
  UUID
}                                    from "@/modules/shared/domain/value_objects/uuid"
import {
  BaseException
}                                    from "@/modules/shared/domain/exceptions/base_exception"
import {
  ValidString
}                                    from "@/modules/shared/domain/value_objects/valid_string"
import {
  ValidInteger
}                                    from "@/modules/shared/domain/value_objects/valid_integer"
import {
  ValidDate
}                                    from "@/modules/shared/domain/value_objects/valid_date"
import {
  QuotationStatus
}                                    from "@/modules/quotation/domain/quotation_status"

export class QuotationMapper {
  static toDTO( quotation: Quotation ): QuotationResponse {
    return {
      id            : quotation.id.value,
      status        : quotation.status.value,
      title         : quotation.title.value,
      total         : quotation.total.value,
      estimated_time: quotation.estimatedTime?.value,
      value_format  : quotation.valueFormat.value
    }
  }

  static toJSON( quotation: QuotationResponse ): Record<string, any> {
    return {
      id            : quotation.id,
      status        : quotation.status,
      title         : quotation.title,
      total         : quotation.total,
      estimated_time: quotation.estimated_time,
      value_format  : quotation.value_format
    }
  }

  static fromJSON( quotation: Record<string, any> ): QuotationResponse | Errors {
    const errors = []

    const id = wrapType(
      () => UUID.from( quotation.id ) )

    if ( id instanceof BaseException ) {
      errors.push( id )
    }

    const title = wrapType(
      () => ValidString.from( quotation.title ) )

    if ( title instanceof BaseException ) {
      errors.push( title )
    }

    const total = wrapType(
      () => ValidInteger.from( quotation.total ) )

    if ( total instanceof BaseException ) {
      errors.push( total )
    }

    const status = wrapType(
      () => QuotationStatus.from( quotation.status ) )

    if ( status instanceof BaseException ) {
      errors.push( status )
    }

    const valueFormat = wrapType(
      () => ValidString.from( quotation.value_format ) )

    if ( valueFormat instanceof BaseException ) {
      errors.push( valueFormat )
    }

    const estimatedTime = wrapTypeDefault( undefined,
      ( value ) => ValidDate.from( value ), quotation.estimated_time )

    if ( estimatedTime instanceof BaseException ) {
      errors.push( estimatedTime )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      id            : (
        id as UUID
      ).value,
      title         : (
        title as ValidString
      ).value,
      total         : (
        total as ValidInteger
      ).value,
      status        : (
        status as QuotationStatus
      ).value,
      value_format  : (
        valueFormat as ValidString
      ).value,
      estimated_time: estimatedTime === undefined ? undefined : (
        estimatedTime as ValidDate
      ).value
    }
  }

  static toDomain( json: Record<string, any> ): Quotation | Errors {
    return Quotation.fromPrimitives(
      json.id,
      json.user_id,
      json.chat_id,
      json.worker_id,
      json.title,
      json.total,
      json.status,
      json.value_format,
      json.created_at,
      json.estimated_time
    )
  }
}