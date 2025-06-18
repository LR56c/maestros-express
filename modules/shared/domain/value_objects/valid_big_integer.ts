import { z } from "zod"
import {
  InvalidBigIntegerException
}            from "@/modules/shared/domain/exceptions/invalid_big_integer_exception"

export class ValidBigInteger {
  readonly value: bigint

  private constructor( value: bigint ) {
    this.value = value
  }

  /**
   * Create a ValidBigInteger instance
   * @throws {InvalidBigIntegerException} - if bigint is invalid
   */
  static from( value: bigint ): ValidBigInteger {
    const n      = BigInt( value )
    const result = z.bigint()
                    .nonnegative()
                    .safeParse( n )
    if ( !result.success ) {
      throw new InvalidBigIntegerException()
    }
    return new ValidBigInteger( n )
  }

  static fromOrNull( value: bigint ): ValidBigInteger | undefined {
    try {
      return ValidBigInteger.from( value )
    }
    catch {
      return undefined
    }
  }
}
