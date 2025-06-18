import { z } from "zod"
import {
  InvalidIntegerException
}            from "@/modules/shared/domain/exceptions/invalid_integer_exception"

export class ValidInteger {
  readonly value: number

  private constructor( value: number ) {
    this.value = value
  }

  /**
   * Create a ValidInteger instance
   * @throws {InvalidIntegerException} - if number is invalid
   */
  static from( value: number ): ValidInteger {
    const n      = Number( value )
    const result = z.number()
                    .min( 0 )
                    .int()
                    .safeParse( n )
    if ( !result.success ) {
      throw new InvalidIntegerException()
    }
    return new ValidInteger( n )
  }

  static fromOrNull( value: number ): ValidInteger | undefined {
    try {
      return ValidInteger.from( value )
    }
    catch {
      return undefined
    }
  }
}
