import { z } from "zod"
import {
  InvalidPaymentStatusException
}            from "@/modules/payment/domain/exception/invalid_payment_status_exception"

export enum PaymentStatusEnum {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED"
}

export class PaymentStatus {

  readonly value: PaymentStatusEnum

  private constructor( value: PaymentStatusEnum ) {
    this.value = value
  }

  static create( value: PaymentStatusEnum ): PaymentStatus {
    return new PaymentStatus( value )
  }

  static from( value: string ): PaymentStatus {
    const result = z.nativeEnum( PaymentStatusEnum )
                    .safeParse( value )
    if ( !result.success ) {
      throw new InvalidPaymentStatusException()
    }
    return new PaymentStatus( result.data )
  }

  static fromOrNull( value: string ): PaymentStatus | undefined {
    try {
      return PaymentStatus.from( value )
    }
    catch {
      return undefined
    }
  }
}
