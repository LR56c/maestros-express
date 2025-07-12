import { Payment }         from "@/modules/payment/domain/payment"
import { PaymentResponse } from "@/modules/payment/application/payment_response"
import { Errors }        from "@/modules/shared/domain/exceptions/errors"
import { wrapType }      from "@/modules/shared/utils/wrap_type"
import { UUID }          from "@/modules/shared/domain/value_objects/uuid"
import {
  BaseException
}                        from "@/modules/shared/domain/exceptions/base_exception"
import { PaymentType }   from "@/modules/payment/domain/payment_type"
import { PaymentStatus } from "@/modules/payment/domain/payment_status"
import {
  ValidInteger
}                        from "@/modules/shared/domain/value_objects/valid_integer"
import { ValidDate }     from "@/modules/shared/domain/value_objects/valid_date"
import {
  ValidString
}                        from "@/modules/shared/domain/value_objects/valid_string"

export class PaymentMapper {
  static toDTO( payment: Payment ): PaymentResponse {
    return {
      id          : payment.id.toString(),
      service_type: payment.serviceType.value,
      status      : payment.status.value,
      total       : payment.total.value,
      value_format: payment.valueFormat.value,
      created_at  : payment.createdAt.toString()
    }
  }

  static toJSON( payment: PaymentResponse ): Record<string, any> {
    return {
      id          : payment.id,
      service_type: payment.service_type,
      status      : payment.status,
      total       : payment.total,
      value_format: payment.value_format,
      created_at  : payment.created_at
    }
  }

  static fromJSON( payment: Record<string, any> ): PaymentResponse | Errors {
    const errors = []

    const id = wrapType(
      () => UUID.from( payment.id ) )

    if ( id instanceof BaseException ) {
      errors.push( id )
    }
    const serviceType = wrapType(
      () => PaymentType.from( payment.service_type ) )

    if ( serviceType instanceof BaseException ) {
      errors.push( serviceType )
    }

    const status = wrapType(
      () => PaymentStatus.from( payment.status ) )

    if ( status instanceof BaseException ) {
      errors.push( status )
    }

    const total = wrapType(
      () => ValidInteger.from( payment.total ) )

    if ( total instanceof BaseException ) {
      errors.push( total )
    }

    const valueFormat = wrapType(
      () => ValidString.from( payment.value_format ) )

    if ( valueFormat instanceof BaseException ) {
      errors.push( valueFormat )
    }

    const createdAt = wrapType(
      () => ValidDate.from( payment.created_at ) )

    if ( createdAt instanceof BaseException ) {
      errors.push( createdAt )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      id          : (id as UUID).toString(),
      service_type: (serviceType as PaymentType).value,
      status      : (status as PaymentStatus).value,
      total       : (total as ValidInteger).value,
      value_format: (valueFormat as ValidString).value,
      created_at  : (createdAt as ValidDate).toString()
    }
  }

  static toDomain( json: Record<string, any> ): Payment | Errors {
    return Payment.fromPrimitives(
      json.id,
      json.service_id,
      json.service_type,
      json.client_id,
      json.token,
      json.status,
      json.total,
      json.value_format,
      json.created_at
    )
  }

}