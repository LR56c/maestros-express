import { z } from "zod"

import {
  InvalidDateException
} from "@/modules/shared/domain/exceptions/invalid_date_exception"

export class ValidDate {
  readonly value: Date

  private constructor( value: Date ) {
    this.value = value
  }

  toString(): string {
    return this.value.toISOString()
  }

  static now(): ValidDate {
    return new ValidDate( new Date() )
  }

  /**
   * Create a ValidDate instance
   * @throws {InvalidDateException} - if date is invalid
   */
  static from( value: string | Date | number ): ValidDate {
    const parsedDate = new Date( value )
    const result     = z.date().safeParse( parsedDate )
    if ( !result.success ) {
      throw new InvalidDateException()
    }
    return new ValidDate( parsedDate )
  }

  static fromOrNull( value: string | Date | number ): ValidDate | undefined {
    try {
      return ValidDate.from( value )
    }
    catch {
      return undefined
    }
  }

  static nowUTC(): string {
    return new Date().toISOString()
  }
}
