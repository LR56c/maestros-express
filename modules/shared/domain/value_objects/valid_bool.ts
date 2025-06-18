import { z } from "zod"
import {
  InvalidBooleanException
}            from "@/modules/shared/domain/exceptions/invalid_boolean_exception"

export class ValidBool {
  readonly value: boolean

  private constructor( value: boolean ) {
    this.value = value
  }

  /**
   * Create a ValidBool instance
   * @throws {InvalidBooleanException} - if number is invalid
   */
  static from( value: boolean ): ValidBool {
    const result = z.boolean()
                    .safeParse( value )
    if ( !result.success ) {
      throw new InvalidBooleanException()
    }
    return new ValidBool( result.data )
  }

  static fromOrNull( value: boolean ): ValidBool | undefined {
    try {
      return ValidBool.from( value )
    }
    catch {
      return undefined
    }
  }
}
