import {
  InvalidQueryException
}               from "@/modules/shared/infrastructure/exceptions/invalid_query_exception"
import { defu } from "defu"

export function queryMerger( original: Record<string, any>,
  toAdd: Record<string, any> ): Record<string, any> {
  return defu( original, toAdd )
}

export function extractOperator( entry: string ): {
  value?: string,
  operator: string
}
{
  const [operatorPart, valuePart] = entry.split( ";", 2 )

  if ( !operatorPart || !valuePart ) {
    throw new InvalidQueryException()
  }

  const prismaDefault = "equals"

  const operators = ["gt", "lt", "gte", "lte", "eq", "st"]

  let operator = operators.includes( operatorPart )
    ? operatorPart
    : prismaDefault
  if ( operatorPart === "eq" ) {
    operator = prismaDefault
  }
  if ( operatorPart === "st" ) {
    operator = "startsWith"
  }
  const value = valuePart.toLowerCase() === "null" ? undefined : valuePart
  return { value, operator }
}
