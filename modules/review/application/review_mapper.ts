import { Review }     from "@/modules/review/domain/review"
import { ReviewDTO }  from "@/modules/review/application/review_dto"
import { Errors }     from "@/modules/shared/domain/exceptions/errors"
import { wrapType }   from "@/modules/shared/utils/wrap_type"
import { UUID }       from "@/modules/shared/domain/value_objects/uuid"
import { ReviewType } from "@/modules/review/domain/review_type"
import {
  BaseException
}                     from "@/modules/shared/domain/exceptions/base_exception"
import {
  ValidString
}                     from "@/modules/shared/domain/value_objects/valid_string"
import {
  ValidInteger
}                     from "@/modules/shared/domain/value_objects/valid_integer"

export class ReviewMapper {
  static toDTO(review : Review): ReviewDTO {
    return {
      id: review.id.value,
      user_id: review.userId.toString(),
      service_id: review.serviceId.value,
      service_type: review.serviceType.value,
      description: review.description.value,
      value: review.value.value
    }
  }

  static toJSON(review : ReviewDTO): Record<string, any> {
    return {
      id: review.id,
      user_id: review.user_id,
      service_id: review.service_id,
      service_type: review.service_type,
      description: review.description,
      value: review.value
    }
  }
  static fromJSON( json: Record<string, any> ): ReviewDTO | Errors {
    const errors = []

    const id = wrapType(()=>UUID.from(json.id))

    if (id instanceof BaseException) {
      errors.push(id)
    }

    const userId = wrapType(()=>UUID.from(json.user_id))

    if (userId instanceof BaseException) {
      errors.push(userId)
    }

    const serviceId = wrapType(()=>UUID.from(json.service_id))

    if (serviceId instanceof BaseException) {
      errors.push(serviceId)
    }

    const serviceType = wrapType(()=>ReviewType.from(json.service_type))

    if (serviceType instanceof BaseException) {
      errors.push(serviceType)
    }

    const description = wrapType(()=>ValidString.from(json.description))

    if (description instanceof BaseException) {
      errors.push(description)
    }

    const value = wrapType(()=>ValidInteger.from(json.value))

    if (value instanceof BaseException) {
      errors.push(value)
    }

    if (errors.length > 0) {
      return new Errors(errors)
    }

    return {
      id: (id as UUID).value,
      user_id: (userId as UUID).value,
      service_id: (serviceId as UUID).value,
      service_type: (serviceType as ReviewType).value,
      description: (description as ValidString).value,
      value: (value as ValidInteger).value
    }
  }

  static toDomain(json: Record<string, any>): Review | Errors {
    return Review.fromPrimitives(
      json.id,
      json.user_id,
      json.service_id,
      json.service_type,
      json.description,
      json.value,
      json.created_at
    )
  }
}