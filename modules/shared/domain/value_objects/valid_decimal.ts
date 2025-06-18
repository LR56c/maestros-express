import { z } from "zod"
import {
  InvalidDecimalException
}            from "@/modules/shared/domain/exceptions/invalid_decimal_exception"

export class ValidDecimal {
  readonly value: number

  private constructor( value: number ) {
    this.value = value
  }

  /**
   * Create a ValidDecimal instance
   * @throws {InvalidDecimalException} - if number is invalid
   */
  static from( value: number | string ): ValidDecimal {
    const result = z.number()
                    .safeParse( value )
    if ( !result.success ) {
      throw new InvalidDecimalException()
    }
    return new ValidDecimal( result.data )
  }

  static fromOrNull( value: number ): ValidDecimal | undefined {
    try {
      return ValidDecimal.from( value )
    }
    catch {
      return undefined
    }
  }
}
