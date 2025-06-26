import { ReviewDAO }                   from "@/modules/review/domain/review_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import { ReviewDTO } from "@/modules/review/application/review_dto"
import { ensureReviewExist } from "@/modules/review/utils/ensure_review_exist"
import { Review }               from "@/modules/review/domain/review"
import { Errors }               from "@/modules/shared/domain/exceptions/errors"
import {
  containError
}                                      from "@/modules/shared/utils/contain_error"
import {
  DataNotFoundException
}                                      from "@/modules/shared/domain/exceptions/data_not_found_exception"
import {
  InfrastructureException
}                                      from "@/modules/shared/domain/exceptions/infrastructure_exception"

export class AddReview {
  constructor(private readonly dao: ReviewDAO) {
  }

  async execute( dto : ReviewDTO ): Promise<Either<BaseException[], Review>>{

    if(dto.user_id === dto.service_id){
      return left([new InfrastructureException("User cannot review their own service")])
    }

    const exist = await ensureReviewExist(this.dao, dto.id)

    if ( isLeft( exist ) ) {
      if ( !containError( exist.left, new DataNotFoundException() ) ) {
        return left( exist.left )
      }
    }

    const review = Review.create(
      dto.id,
      dto.user_id,
      dto.service_id,
      dto.service_type,
      dto.description,
      dto.value
    )

    if ( review instanceof Errors ) {
      return left( review.values )
    }

    const result = await this.dao.add( review )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right(review)
  }
}