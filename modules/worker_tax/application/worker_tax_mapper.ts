import { WorkerTax }    from "@/modules/worker_tax/domain/worker_tax"
import { WorkerTaxDTO } from "@/modules/worker_tax/application/worker_tax_dto"
import { Errors }       from "@/modules/shared/domain/exceptions/errors"
import { wrapType }     from "@/modules/shared/utils/wrap_type"
import { UUID }         from "@/modules/shared/domain/value_objects/uuid"
import {
  BaseException
}                       from "@/modules/shared/domain/exceptions/base_exception"
import {
  ValidString
}                       from "@/modules/shared/domain/value_objects/valid_string"
import {
  ValidInteger
}                       from "@/modules/shared/domain/value_objects/valid_integer"

export class WorkerTaxMapper {
  static toDTO( workerTax: WorkerTax ): WorkerTaxDTO {
    return {
      id          : workerTax.id.toString(),
      value       : workerTax.value.value,
      name        : workerTax.name.value,
      value_format: workerTax.valueFormat.value
    }
  }

  static toJSON( workerTax: WorkerTaxDTO ): Record<string, any> {
    return {
      id          : workerTax.id,
      value       : workerTax.value,
      name        : workerTax.name,
      value_format: workerTax.value_format
    }
  }

  static fromJSON( workerTax: Record<string, any> ): WorkerTaxDTO | Errors {
    const errors = []

    const id = wrapType(
      () => UUID.from( workerTax.id ) )

    if ( id instanceof BaseException ) {
      errors.push( id )
    }

    const value = wrapType(
      () => ValidInteger.from( workerTax.value ) )

    if ( value instanceof BaseException ) {
      errors.push( value )
    }

    const name = wrapType(
      () => ValidString.from( workerTax.name ) )

    if ( name instanceof BaseException ) {
      errors.push( name )
    }

    const valueFormat = wrapType(
      () => ValidString.from( workerTax.value_format ) )

    if ( valueFormat instanceof BaseException ) {
      errors.push( valueFormat )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      id          : ( id as UUID ).toString(),
      value       : ( value as ValidInteger ).value,
      name        : ( name as ValidString ).value,
      value_format: ( valueFormat as ValidString ).value
    }
  }

  static toDomain( json: Record<string, any> ): WorkerTax | Errors {
    return WorkerTax.fromPrimitives(
      json.id,
      json.worker_id,
      json.value,
      json.name,
      json.value_format,
      json.created_at
    )
  }
}