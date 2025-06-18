import { z } from "zod"
import {
  InvalidStringException
}            from "@/modules/shared/domain/exceptions/invalid_string_exception"

export class ValidString {
  readonly value: string

  private constructor( value: string ) {
    this.value = value
  }

  /**
   * Create a ValidString instance
   * @throws {InvalidStringException} - if string is invalid
   */
  static from( value: string ): ValidString {
    const result = z.string()
                    .min( 1 )
                    .safeParse( value )
    if ( !result.success ) {
      throw new InvalidStringException()
    }
    return new ValidString( result.data )
  }

  static fromOrNull( value: string ): ValidString | undefined {
    try {
      return ValidString.from( value )
    }
    catch {
      return undefined
    }
  }
}
