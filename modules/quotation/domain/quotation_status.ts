import { z } from "zod"
import {
  InvalidQuotationStatusException
} from "@/modules/quotation/domain/exception/invalid_quotation_status_exception"

export enum QuotationStatusEnum {
  PENDING = "PENDING",
  CANCELED = "CANCELED",
  ACCEPTED = "ACCEPTED",
}

export class QuotationStatus {

  readonly value: QuotationStatusEnum

  private constructor( value: QuotationStatusEnum ) {
    this.value = value
  }

  static create( value: QuotationStatusEnum ): QuotationStatus {
    return new QuotationStatus( value )
  }

  static from( value: string ): QuotationStatus {
    const result = z.nativeEnum( QuotationStatusEnum )
                    .safeParse( value )
    if ( !result.success ) {
      throw new InvalidQuotationStatusException()
    }
    return new QuotationStatus( result.data )
  }

  static fromOrNull( value: string ): QuotationStatus | undefined {
    try {
      return QuotationStatus.from( value )
    }
    catch {
      return undefined
    }
  }
}
