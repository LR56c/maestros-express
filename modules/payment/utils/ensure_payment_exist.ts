import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  ValidInteger
}                                      from "@/modules/shared/domain/value_objects/valid_integer"
import {
  DataNotFoundException
}                                      from "@/modules/shared/domain/exceptions/data_not_found_exception"
import {
  PaymentDAO
}                                      from "@/modules/payment/domain/payment_dao"
import { Payment }                     from "@/modules/payment/domain/payment"

export const ensurePaymentExist = async ( dao: PaymentDAO,
  paymentId: string ): Promise<Either<BaseException[], Payment>> => {

  const payment = await dao.search({
    id: paymentId
  }, ValidInteger.from(1))

  if ( isLeft(payment) ) {
    return left(payment.left)
  }

  if ( payment.right.items.length > 0 && payment.right.items[0]!.id.value !== paymentId ) {
    return left( [new DataNotFoundException()] )
  }

  return right(payment.right.items[0])
}