import type { Either } from "fp-ts/Either"
import {
  BaseException
}                      from "@/modules/shared/domain/exceptions/base_exception"
import { UUID }        from "@/modules/shared/domain/value_objects/uuid"
import { Review }      from "@/modules/review/domain/review"

export abstract class ReviewDAO {
  abstract add( review : Review ): Promise<Either<BaseException, boolean>>
  abstract getByUserId( id: UUID ): Promise<Either<BaseException[], Review[]>>
  abstract getById( id: UUID ): Promise<Either<BaseException[], Review>>
}
