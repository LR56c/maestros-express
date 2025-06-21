import { UUID }       from "@/modules/shared/domain/value_objects/uuid"
import { ValidDate }  from "@/modules/shared/domain/value_objects/valid_date"
import {
  ValidString
}                     from "@/modules/shared/domain/value_objects/valid_string"
import {
  ValidInteger
}                     from "@/modules/shared/domain/value_objects/valid_integer"
import { ReviewType } from "@/modules/review/domain/review_type"
import { Errors }     from "@/modules/shared/domain/exceptions/errors"
import { wrapType }   from "@/modules/shared/utils/wrap_type"
import {
  BaseException
}                     from "@/modules/shared/domain/exceptions/base_exception"

export class Review {
  private constructor(
    readonly id: UUID,
    readonly userId: UUID,
    readonly serviceId: UUID,
    readonly serviceType: ReviewType,
    readonly description: ValidString,
    readonly value: ValidInteger,
    readonly createdAt: ValidDate
  )
  {
  }

  static create(
    id: string,
    userId: string,
    serviceId: string,
    serviceType: string,
    description: string,
    value: number
  ): Review | Errors {
    return Review.fromPrimitives(
      id,
      userId,
      serviceId,
      serviceType,
      description,
      value,
      ValidDate.nowUTC()
    )
  }

  static fromPrimitivesThrow(
    id: string,
    userId: string,
    serviceId: string,
    serviceType: string,
    description: string,
    value: number,
    createdAt: Date | string
  ): Review {
    return new Review(
      UUID.from( id ),
      UUID.from( userId ),
      UUID.from( serviceId ),
      ReviewType.from( serviceType ),
      ValidString.from( description ),
      ValidInteger.from( value ),
      ValidDate.from( createdAt )
    )
  }

  static fromPrimitives(
    id: string,
    userId: string,
    serviceId: string,
    serviceType: string,
    description: string,
    value: number,
    createdAt: Date | string
  ): Review | Errors {
    const errros = []

    const vId = wrapType( () => UUID.from( id ) )

    if ( vId instanceof BaseException ) {
      errros.push( vId )
    }

    const vType = wrapType( () => ReviewType.from( serviceType ) )

    if ( vType instanceof BaseException ) {
      errros.push( vType )
    }

    const vUserId = wrapType( () => UUID.from( userId ) )

    if ( vUserId instanceof BaseException ) {
      errros.push( vUserId )
    }

    const vServiceId = wrapType( () => UUID.from( serviceId ) )

    if ( vServiceId instanceof BaseException ) {
      errros.push( vServiceId )
    }

    const vDescription = wrapType( () => ValidString.from( description ) )

    if ( vDescription instanceof BaseException ) {
      errros.push( vDescription )
    }

    const vValue = wrapType( () => ValidInteger.from( value ) )

    if ( vValue instanceof BaseException ) {
      errros.push( vValue )
    }

    const vCreatedAt = wrapType( () => ValidDate.from( createdAt ) )

    if ( vCreatedAt instanceof BaseException ) {
      errros.push( vCreatedAt )
    }

    if ( errros.length > 0 ) {
      return new Errors( errros )
    }

    return new Review(
      vId as UUID,
      vUserId as UUID,
      vServiceId as UUID,
      vType as ReviewType,
      vDescription as ValidString,
      vValue as ValidInteger,
      vCreatedAt as ValidDate
    )


  }
}