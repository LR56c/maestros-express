import { ReviewDAO }                   from "@/modules/review/domain/review_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import { Review }                      from "@/modules/review/domain/review"
import { wrapType }                    from "@/modules/shared/utils/wrap_type"
import {
  UUID
}                                      from "@/modules/shared/domain/value_objects/uuid"
import {
  DataNotFoundException
}                                      from "@/modules/shared/domain/exceptions/data_not_found_exception"

export const ensureReviewExist = async ( dao: ReviewDAO,
  reviewId: string ): Promise<Either<BaseException[], Review>> => {
  const vid = wrapType( () => UUID.from( reviewId ) )

  if ( vid instanceof BaseException ) {
    return left( [vid] )
  }

  const review = await dao.getById( vid )

  if ( isLeft( review ) ) {
    return left( review.left )
  }

  if ( review.right.id.value !== reviewId ) {
    return left( [new DataNotFoundException()] )
  }

  return right( review.right )
}