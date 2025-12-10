import { z }                   from "zod"
import { Either, left, right } from "fp-ts/Either"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import {
  DomainException
}                              from "@/modules/shared/domain/exceptions/domain_exception"

export class InvalidParseException extends DomainException {
  constructor( message?: string ) {
    super( message )
    this.name = "InvalidParseException"
  }
}


export function parseData<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): Either<BaseException, z.infer<T>> {
  const parsedData = schema.safeParse( data )
  if ( !parsedData.success ) {
    const format = z.prettifyError(parsedData.error);
    return left( new InvalidParseException( format.toString() ) )
  }
  return right( parsedData.data )
}
