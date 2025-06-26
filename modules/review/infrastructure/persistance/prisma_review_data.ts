import { ReviewDAO }           from "@/modules/review/domain/review_dao"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import { PrismaClient }        from "@/lib/generated/prisma"
import { Review }              from "@/modules/review/domain/review"
import { Either, left, right } from "fp-ts/Either"
import { UUID }                from "@/modules/shared/domain/value_objects/uuid"
import {
  InfrastructureException
}                              from "@/modules/shared/domain/exceptions/infrastructure_exception"
import { Errors }              from "@/modules/shared/domain/exceptions/errors"
import {
  DataNotFoundException
} from "@/modules/shared/domain/exceptions/data_not_found_exception"

export class PrismaReviewData implements ReviewDAO {

  constructor( private readonly db: PrismaClient ) {
  }

  async add( review: Review ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.review.create( {
        data: {
          id         : review.id.toString(),
          userId     : review.userId.toString(),
          serviceId  : review.serviceId.toString(),
          value      : review.value.value,
          description: review.description.value,
          serviceType: review.serviceType.value,
          createdAt  : review.createdAt.toString()
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async getById( id: UUID ): Promise<Either<BaseException[], Review>> {
    try {
      const response = await this.db.review.findUnique( {
        where: {
          id: id.toString()
        }
      } )

      if ( !response ) {
        return left( [new DataNotFoundException()] )
      }

      const mapped = Review.fromPrimitives(
        response.id,
        response.userId,
        response.serviceId,
        response.serviceType,
        response.description,
        response.value,
        response.createdAt
      )

      if ( mapped instanceof Errors ) {
        return left( mapped.values )
      }

      return right( mapped )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }



  async getByUserId( id: UUID ): Promise<Either<BaseException[], Review[]>> {
    try {
      const response = await this.db.review.findMany( {
        where: {
          userId: id.toString()
        }
      } )

      const result: Review[] = []
      for ( const element of response ) {
        const mapped = Review.fromPrimitives(
          element.id,
          element.userId,
          element.serviceId,
          element.serviceType,
          element.description,
          element.value,
          element.createdAt
        )

        if ( mapped instanceof Errors ) {
          return left( mapped.values )
        }

        result.push( mapped )
      }

      return right( result )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }

}