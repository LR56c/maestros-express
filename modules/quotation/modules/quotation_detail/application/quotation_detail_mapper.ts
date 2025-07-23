import {
  QuotationDetail
}                                    from "@/modules/quotation/modules/quotation_detail/domain/quotation_detail"
import {
  QuotationDetailDTO
}                                    from "@/modules/quotation/modules/quotation_detail/application/quotation_detail_dto"
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

export class QuotationDetailMapper {
  static toDTO( quotation: QuotationDetail ): QuotationDetailDTO {
    return {
      id          : quotation.id.toString(),
      description : quotation.description?.value,
      value       : quotation.value.value,
      name        : quotation.name.value,
      value_format: quotation.valueFormat.value
    }
  }

  static toJSON( quotation: QuotationDetailDTO ): Record<string, any> {
    return {
      id          : quotation.id,
      description : quotation.description,
      value       : quotation.value,
      name        : quotation.name,
      value_format: quotation.value_format
    }
  }

  static fromJSON( json: Record<string, any> ): QuotationDetailDTO | Errors {
    const errors = []

    const id = wrapType(
      () => UUID.from( json.id ) )

    if ( id instanceof BaseException ) {
      errors.push( id )
    }

    const name = wrapType(
      () => ValidString.from( json.name ) )

    if ( name instanceof BaseException ) {
      errors.push( name )
    }

    const description = wrapTypeDefault(undefined,
      (value) => ValidString.from( value ),json.description )

    if ( description instanceof BaseException ) {
      errors.push( description )
    }

    const value = wrapType(
      () => ValidInteger.from( json.value ) )

    if ( value instanceof BaseException ) {
      errors.push( value )
    }

    const valueFormat = wrapType(
      () => ValidString.from( json.value_format ) )

    if ( valueFormat instanceof BaseException ) {
      errors.push( valueFormat )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      id          : (id as UUID).toString(),
      name        : (name as ValidString).value,
      description : (description as ValidString).value,
      value       : (value as ValidInteger).value,
      value_format: (valueFormat as ValidString).value
    }
  }

  static toDomain( json: Record<string, any> ): QuotationDetail | Errors {
    return QuotationDetail.fromPrimitives(
      json.id,
      json.quotation_id,
      json.name,
      json.value,
      json.value_format,
      json.created_at,
      json.description,
    )
  }
}