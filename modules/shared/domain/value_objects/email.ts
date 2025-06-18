import { z } from "zod"
import {
  EmailException
}            from "@/modules/shared/domain/exceptions/email_exception"

export class Email {
  readonly value: string

  private constructor( value: string ) {
    this.value = value
  }

  /**
   * Create an Email instance
   * @throws {EmailException} - if string is invalid
   */
  static from( value: string ): Email {
    const parseValue = z.string()
                        .email()
                        .safeParse( value )
    if ( !parseValue.success ) {
      throw new EmailException()
    }
    return new Email( parseValue.data )
  }
}
