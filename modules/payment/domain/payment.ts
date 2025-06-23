import { UUID }          from "@/modules/shared/domain/value_objects/uuid"
import { ValidDate }     from "@/modules/shared/domain/value_objects/valid_date"
import {
  ValidString
}                        from "@/modules/shared/domain/value_objects/valid_string"
import {
  ValidInteger
}                        from "@/modules/shared/domain/value_objects/valid_integer"
import { PaymentStatus } from "@/modules/payment/domain/payment_status"
import { PaymentType }   from "@/modules/payment/domain/payment_type"
import { Errors }        from "@/modules/shared/domain/exceptions/errors"
import {
  BaseException
}                        from "@/modules/shared/domain/exceptions/base_exception"
import { wrapType }      from "@/modules/shared/utils/wrap_type"

export class Payment {
  private constructor(
    readonly id: UUID,
    readonly serviceId: UUID,
    readonly serviceType: PaymentType,
    readonly clientId: UUID,
    readonly token: ValidString,
    readonly status: PaymentStatus,
    readonly total: ValidInteger,
    readonly valueFormat: ValidString,
    readonly createdAt: ValidDate
  )
  {
  }

  static create(
    id: string,
    serviceId: string,
    serviceType: string,
    clientId: string,
    token: string,
    status: string,
    total: number,
    valueFormat: string
  ): Payment | Errors {
    return Payment.fromPrimitives(
      id,
      serviceId,
      serviceType,
      clientId,
      token,
      status,
      total,
      valueFormat,
      new Date()
    )
  }

  static fromPrimitivesThrow(
    id: string,
    serviceId: string,
    serviceType: string,
    clientId: string,
    token: string,
    status: string,
    total: number,
    valueFormat: string,
    createdAt: Date | string
  ): Payment {
    return new Payment(
      UUID.from( id ),
      UUID.from( serviceId ),
      PaymentType.from( serviceType ),
      UUID.from( clientId ),
      ValidString.from( token ),
      PaymentStatus.from( status ),
      ValidInteger.from( total ),
      ValidString.from( valueFormat ),
      ValidDate.from( createdAt )
    )
  }

  static fromPrimitives(
    id: string,
    serviceId: string,
    serviceType: string,
    clientId: string,
    token: string,
    status: string,
    total: number,
    valueFormat: string,
    createdAt: Date | string
  ): Payment | Errors {
    const errors = []

    const idValue = wrapType( () => UUID.from( id ) )
    if ( idValue instanceof BaseException ) {
      errors.push( idValue )
    }

    const serviceIdValue = wrapType( () => UUID.from( serviceId ) )
    if ( serviceIdValue instanceof BaseException ) {
      errors.push( serviceIdValue )
    }

    const serviceTypeValue = wrapType( () => PaymentType.from( serviceType ) )
    if ( serviceTypeValue instanceof BaseException ) {
      errors.push( serviceTypeValue )
    }

    const clientIdValue = wrapType( () => UUID.from( clientId ) )
    if ( clientIdValue instanceof BaseException ) {
      errors.push( clientIdValue )
    }

    const tokenValue = wrapType( () => ValidString.from( token ) )
    if ( tokenValue instanceof BaseException ) {
      errors.push( tokenValue )
    }

    const statusValue = wrapType( () => PaymentStatus.from( status ) )
    if ( statusValue instanceof BaseException ) {
      errors.push( statusValue )
    }

    const totalValue = wrapType( () => ValidInteger.from( total ) )
    if ( totalValue instanceof BaseException ) {
      errors.push( totalValue )
    }

    const valueFormatValue = wrapType( () => ValidString.from( valueFormat ) )
    if ( valueFormatValue instanceof BaseException ) {
      errors.push( valueFormatValue )
    }

    const createdAtValue = wrapType( () => ValidDate.from( createdAt ) )
    if ( createdAtValue instanceof BaseException ) {
      errors.push( createdAtValue )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new Payment(
      idValue as UUID,
      serviceIdValue as UUID,
      serviceTypeValue as PaymentType,
      clientIdValue as UUID,
      tokenValue as ValidString,
      statusValue as PaymentStatus,
      totalValue as ValidInteger,
      valueFormatValue as ValidString,
      createdAtValue as ValidDate
    )
  }
}