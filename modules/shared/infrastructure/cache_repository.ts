import type { Either } from "fp-ts/Either"
import type {
  BaseException
}                      from "@/modules/shared/domain/exceptions/base_exception"

export abstract class CacheRepository<T> {
  abstract search( query: Record<string, any> ): Promise<Either<BaseException[], T[]>>

  abstract insert( data: T ): Promise<Either<BaseException, boolean>>

  abstract replace( data: T ): Promise<Either<BaseException, boolean>>

  abstract remove( data: T ): Promise<Either<BaseException, boolean>>
}
