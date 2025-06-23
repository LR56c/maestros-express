import { z } from "zod"
import {
  InvalidPaymentTypeException
} from "@/modules/payment/domain/exception/invalid_payment_type_exception"

export enum PaymentTypeEnum {
  SERVICE = "SERVICE",
  PACKAGE = "PACKAGE"
}

export class PaymentType {

  readonly value: PaymentTypeEnum

  private constructor( value: PaymentTypeEnum ) {
    this.value = value
  }

  static create( value: PaymentTypeEnum ): PaymentType {
    return new PaymentType( value )
  }

  static from( value: string ): PaymentType {
    const result = z.nativeEnum( PaymentTypeEnum )
                    .safeParse( value )
    if ( !result.success ) {
      throw new InvalidPaymentTypeException()
    }
    return new PaymentType( result.data )
  }

  static fromOrNull( value: string ): PaymentType | undefined {
    try {
      return PaymentType.from( value )
    }
    catch {
      return undefined
    }
  }
}
