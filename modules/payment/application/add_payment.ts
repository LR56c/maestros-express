import { PaymentDAO }                  from "@/modules/payment/domain/payment_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  ensurePaymentExist
}                                      from "@/modules/payment/utils/ensure_payment_exist"
import {
  containError
}                                      from "@/modules/shared/utils/contain_error"
import {
  DataNotFoundException
}                                      from "@/modules/shared/domain/exceptions/data_not_found_exception"
import { Payment }                     from "@/modules/payment/domain/payment"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"
import {
  UUID
}                                      from "@/modules/shared/domain/value_objects/uuid"
import {
  PaymentRequest
}                                      from "@/modules/payment/application/payment_request"
import {
  InfrastructureException
}                                      from "@/modules/shared/domain/exceptions/infrastructure_exception"

export class AddPayment {
  constructor( private readonly dao: PaymentDAO ) {
  }

  async execute(
    dto: PaymentRequest ): Promise<Either<BaseException[], Payment>> {
    if ( dto.client_id === dto.service_id ) {
      return left( [
        new InfrastructureException(
          "Client ID cannot be the same as Service ID" )
      ] )
    }
    const exist = await ensurePaymentExist( this.dao, dto.id )

    if ( isLeft( exist ) ) {
      if ( !containError( exist.left, new DataNotFoundException() ) ) {
        return left( exist.left )
      }
    }

    const tempToken = UUID.create()

    const newPayment = Payment.create(
      dto.id,
      dto.service_id,
      dto.service_type,
      dto.client_id,
      tempToken.value,
      dto.status,
      dto.total,
      dto.value_format
    )

    if ( newPayment instanceof Errors ) {
      return left( newPayment.values )
    }

    const result = await this.dao.add( newPayment )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( newPayment )
  }
}