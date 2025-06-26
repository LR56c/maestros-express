import { PaymentDAO }                  from "@/modules/payment/domain/payment_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  PaymentUpdateDTO
}                                      from "@/modules/payment/application/payment_update_dto"
import {
  ensurePaymentExist
}                                      from "@/modules/payment/utils/ensure_payment_exist"
import { Payment }                     from "@/modules/payment/domain/payment"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"

export class UpdatePayment {
  constructor( private readonly dao: PaymentDAO ) {
  }

  async execute( dto : PaymentUpdateDTO ): Promise<Either<BaseException[], Payment>>{
    const exist = await ensurePaymentExist( this.dao, dto.id )

    if ( isLeft( exist ) ) {
        return left( exist.left )
    }

    const prevPayment = exist.right

    const updatedPayment = Payment.fromPrimitives(
      dto.id,
      prevPayment.serviceId.toString(),
      prevPayment.serviceType.value,
      prevPayment.clientId.toString(),
      prevPayment.token.value,
      dto.status,
      prevPayment.total.value,
      prevPayment.valueFormat.value,
      prevPayment.createdAt.toString()
    )

    if ( updatedPayment instanceof Errors ) {
      return left( updatedPayment.values )
    }

    const result = await this.dao.update( updatedPayment )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right(updatedPayment)
  }

}