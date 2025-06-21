import { UUID }        from "@/modules/shared/domain/value_objects/uuid"
import { ValidDate }   from "@/modules/shared/domain/value_objects/valid_date"
import { ValidString } from "@/modules/shared/domain/value_objects/valid_string"
import { Errors }      from "@/modules/shared/domain/exceptions/errors"
import {
  BaseException
}                      from "@/modules/shared/domain/exceptions/base_exception"
import { wrapType }    from "@/modules/shared/utils/wrap_type"

export class Report {
  private constructor(
    readonly id: UUID,
    readonly fromUserId: UUID,
    readonly toUserId: UUID,
    readonly reason: ValidString,
    readonly createdAt: ValidDate
  )
  {
  }

  static create(
    id: string,
    fromUserId: string,
    toUserId: string,
    reason: string
  ): Report | Errors {
    return Report.fromPrimitives(
      id,
      fromUserId,
      toUserId,
      reason,
      ValidDate.nowUTC()
    )
  }

  static fromPrimitives(
    id: string,
    fromUserId: string,
    toUserId: string,
    reason: string,
    createdAt: Date | string
  ): Report | Errors {
    const errors = []

    const idVO = wrapType( () => UUID.from( id ) )
    if ( idVO instanceof BaseException ) {
      errors.push( idVO )
    }

    const fromUserIdVO = wrapType( () => UUID.from( fromUserId ) )
    if ( fromUserIdVO instanceof BaseException ) {
      errors.push( fromUserIdVO )
    }

    const toUserIdVO = wrapType( () => UUID.from( toUserId ) )
    if ( toUserIdVO instanceof BaseException ) {
      errors.push( toUserIdVO )
    }

    const reasonVO = wrapType( () => ValidString.from( reason ) )
    if ( reasonVO instanceof BaseException ) {
      errors.push( reasonVO )
    }

    const createdAtVO = wrapType( () => ValidDate.from( createdAt ) )
    if ( createdAtVO instanceof BaseException ) {
      errors.push( createdAtVO )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new Report(
      idVO as UUID,
      fromUserIdVO as UUID,
      toUserIdVO as UUID,
      reasonVO as ValidString,
      createdAtVO as ValidDate
    )
  }

  static fromPrimitivesThrow(
    id: string,
    fromUserId: string,
    toUserId: string,
    reason: string,
    createdAt: Date | string
  ): Report {
    return new Report(
      UUID.from( id ),
      UUID.from( fromUserId ),
      UUID.from( toUserId ),
      ValidString.from( reason ),
      ValidDate.from( createdAt )
    )
  }
}