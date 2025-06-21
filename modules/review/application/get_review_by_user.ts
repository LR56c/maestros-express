import { ReviewDAO }    from "@/modules/review/domain/review_dao"
import { UUID }         from "@/modules/shared/domain/value_objects/uuid"
import { Either, left } from "fp-ts/Either"
import {
  BaseException
}                       from "@/modules/shared/domain/exceptions/base_exception"
import { Review }       from "@/modules/review/domain/review"
import { wrapType }     from "@/modules/shared/utils/wrap_type"

export class GetReviewByUser {
  constructor(private readonly dao: ReviewDAO) {
  }

  async execute( id: string ): Promise<Either<BaseException[], Review[]>>{
    const vid = wrapType( () => UUID.from( id ) )

    if ( vid instanceof BaseException ) {
      return left( [vid] )
    }

    return this.dao.getByUserId( vid )
  }
}