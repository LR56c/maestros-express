import { z } from "zod"

import {
  DomainException
} from "@/modules/shared/domain/exceptions/domain_exception"

export class InvalidJSONException extends DomainException {
  constructor( message?: string ) {
    super( message )
    this.name = "InvalidJSONException"
  }
}


const literalSchema = z.union(
  [z.string(), z.number(), z.boolean(), z.null()] )
type Literal = z.infer<typeof literalSchema>;
export type Json = Literal | { [key: string]: Json } | Json[];
export const jsonSchema: z.ZodType<Json> = z.lazy( () =>
  z.union( [literalSchema, z.array( jsonSchema ), z.record( jsonSchema )] )
)

export class ValidJSON {
  readonly value: Record<string, any>

  private constructor( value: Record<string, any> ) {
    this.value = value
  }

  /**
   * Create a ValidJSON instance
   * @throws {InvalidJSONException}
   */
  static from( value: Record<string, any> ): ValidJSON {
    const result = jsonSchema.safeParse( value )
    if ( !result.success ) {
      throw new InvalidJSONException()
    }
    return new ValidJSON( result )
  }

  static fromOrNull( value: Record<string, any> ): ValidJSON | undefined {
    try {
      return ValidJSON.from( value )
    }
    catch {
      return undefined
    }
  }
}
