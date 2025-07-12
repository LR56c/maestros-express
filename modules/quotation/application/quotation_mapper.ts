import {
  QuotationResponse
}                                    from "@/modules/quotation/application/quotation_response"
import { Quotation }                 from "@/modules/quotation/domain/quotation"
import {
  Errors
}                                    from "@/modules/shared/domain/exceptions/errors"
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
import {
  QuotationDetail
}                                    from "@/modules/quotation/modules/quotation_detail/domain/quotation_detail"
import {
  QuotationDetailMapper
}                                    from "@/modules/quotation/modules/quotation_detail/application/quotation_detail_mapper"
import {
  QuotationDetailDTO
}                                    from "@/modules/quotation/modules/quotation_detail/application/quotation_detail_dto"

export class QuotationMapper {
  static toDTO( quotation: Quotation ): QuotationResponse {
    return {
      id            : quotation.id.value,
      status        : quotation.status.value,
      title         : quotation.title.value,
      total         : quotation.total.value,
      estimated_time: quotation.estimatedTime?.toString(),
      value_format  : quotation.valueFormat.value,
      details       : quotation.details.map( QuotationDetailMapper.toDTO )
    }
  }

  static toJSON( quotation: QuotationResponse ): Record<string, any> {
    return {
      id            : quotation.id,
      status        : quotation.status,
      title         : quotation.title,
      total         : quotation.total,
      estimated_time: quotation.estimated_time,
      value_format  : quotation.value_format,
      details       : quotation.details.map( QuotationDetailMapper.toJSON )
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

    const details: QuotationDetailDTO[] = []
    for ( const detail of quotation.details ) {
      const detailMapped = QuotationDetailMapper.fromJSON( detail )
      if ( detailMapped instanceof Errors ) {
        errors.push( ...detailMapped.values )
      }
      else {
        details.push( detailMapped )
      }
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
      estimated_time: estimatedTime instanceof ValidDate
        ? estimatedTime.toString()
        : undefined,
      details
    }
  }

  static toDomain( json: Record<string, any> ): Quotation | Errors {
    const details: QuotationDetail[] = []

    for ( const detail of json.details ) {
      const detailMapped = QuotationDetailMapper.toDomain( detail )
      if ( detailMapped instanceof Errors ) {
        return detailMapped
      }
      details.push( detailMapped )
    }

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
      details,
      json.estimated_time
    )
  }
}