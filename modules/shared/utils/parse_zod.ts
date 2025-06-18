import { z, type ZodTypeAny } from "zod"
import type {
  BaseException
}                             from "@/modules/shared/domain/exceptions/base_exception"
import { fromError }          from "zod-validation-error"
import { ZodException }       from "@/modules/shared/utils/zod_exception"

export const parseZod = async <T extends ZodTypeAny>(
  schema: T,
  data: unknown
): Promise<z.infer<T> | BaseException> => {
  const parseResult = schema.safeParse( data )
  if ( !parseResult.success ) {
    const format = fromError( parseResult.error, { prefix: null } )
    return new ZodException( format.toString() )
  }
  return parseResult.data
}
