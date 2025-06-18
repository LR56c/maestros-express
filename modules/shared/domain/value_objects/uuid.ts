import { v4 as uuidv4 } from "uuid"
import { z }            from "zod"
import {
  InvalidUUIDException
}                       from "@/modules/shared/domain/exceptions/invalid_uuid_exception"

export class UUID {
  readonly value: string

  private constructor( value: string ) {
    this.value = value
  }

  toString(): string {
    return this.value.toString()
  }

  static create(): UUID {
    return new UUID( uuidv4() )
  }

  /**
   * Create a UUID instance
   * @throws {InvalidUUIDException} - if uuid is invalid
   */
  static from( value: string ): UUID {
    const result = z.string()
                    .uuid()
                    .safeParse( value )
    if ( !result.success ) {
      throw new InvalidUUIDException()
    }

    return new UUID( result.data )
  }

  static fromOrNull( value: string ): UUID | undefined {
    try {
      return UUID.from( value )
    }
    catch {
      return undefined
    }
  }
}
