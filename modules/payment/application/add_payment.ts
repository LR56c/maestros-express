import { PaymentDAO } from "@/modules/payment/domain/payment_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
} from "@/modules/shared/domain/exceptions/base_exception"
import {
  PaymentDTO
} from "@/modules/payment/application/payment_dto"
import {
  ensurePaymentExist
} from "@/modules/payment/utils/ensure_payment_exist"
import {
  containError
} from "@/modules/shared/utils/contain_error"
import {
  DataNotFoundException
} from "@/modules/shared/domain/exceptions/data_not_found_exception"
import { Payment } from "@/modules/payment/domain/payment"
import {
  Errors
} from "@/modules/shared/domain/exceptions/errors"
import { UUID } from "@/modules/shared/domain/value_objects/uuid"

export class AddPayment {
  constructor( private readonly dao: PaymentDAO ) {
  }

  async execute(
    serviceId: string,
    clientId: string,
    payment: PaymentDTO ): Promise<Either<BaseException[], boolean>> {
    const exist = await ensurePaymentExist( this.dao, payment.id )

    if ( isLeft( exist ) ) {
      if ( !containError( exist.left, new DataNotFoundException() ) ) {
        return left( exist.left )
      }
    }

    const tempToken = UUID.create()

    const newPayment = Payment.create(
      payment.id,
      serviceId,
      payment.service_type,
      clientId,
      tempToken.value,
      payment.status,
      payment.total,
      payment.value_format,
    )

    if ( newPayment instanceof Errors ) {
      return left( newPayment.values )
    }

    const result = await this.dao.add( newPayment )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }
}