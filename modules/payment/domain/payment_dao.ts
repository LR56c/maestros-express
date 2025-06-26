import {
  ValidInteger
} from "@/modules/shared/domain/value_objects/valid_integer"
import { ValidString } from "@/modules/shared/domain/value_objects/valid_string"
import { Either } from "fp-ts/Either"
import {
  BaseException
} from "@/modules/shared/domain/exceptions/base_exception"
import { Payment } from "@/modules/payment/domain/payment"

export abstract class PaymentDAO {
  abstract search( query: Record<string, any>, limit?: ValidInteger,
    skip ?: ValidString, sortBy ?: ValidString,
    sortType ?: ValidString ): Promise<Either<BaseException[], Payment[]>>
  abstract add( payment : Payment ): Promise<Either<BaseException, boolean>>
  abstract update( payment : Payment ): Promise<Either<BaseException, boolean>>
}
