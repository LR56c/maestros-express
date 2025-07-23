import {
  InvalidReviewTypeException
}            from "@/modules/review/domain/exception/invalid_review_type_exception"
import { z } from "zod"

export enum ReviewTypeEnum {
  SERVICE = "SERVICE",
  PACKAGE = "PACKAGE"
}

export class ReviewType {

  readonly value: ReviewTypeEnum

  private constructor( value: ReviewTypeEnum ) {
    this.value = value
  }

  static create( value: ReviewTypeEnum ): ReviewType {
    return new ReviewType( value )
  }

  static from( value: string ): ReviewType {
    const result = z.nativeEnum( ReviewTypeEnum )
                    .safeParse( value )
    if ( !result.success ) {
      throw new InvalidReviewTypeException()
    }
    return new ReviewType( result.data )
  }

  static fromOrNull( value: string ): ReviewType | undefined {
    try {
      return ReviewType.from( value )
    }
    catch {
      return undefined
    }
  }
}
