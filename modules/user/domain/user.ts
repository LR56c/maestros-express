import { Errors }                    from "../../shared/domain/exceptions/errors"
import {
  BaseException
}                                    from "../../shared/domain/exceptions/base_exception"
import { wrapType, wrapTypeDefault } from "../../shared/utils/wrap_type"
import type { Role }                 from "@/modules/role/domain/role"
import {
  ValidString
}                                    from "@/modules/shared/domain/value_objects/valid_string"
import {
  UUID
}                                    from "@/modules/shared/domain/value_objects/uuid"
import {
  ValidDate
}                                    from "@/modules/shared/domain/value_objects/valid_date"
import {
  Email
}                                    from "@/modules/shared/domain/value_objects/email"

export class User {
  private constructor(
    readonly userId: UUID,
    readonly email: Email,
    readonly name: ValidString,
    readonly surname: ValidString,
    readonly roles: Role[],
    readonly createdAt: ValidDate,
    readonly avatar?: ValidString
  )
  {
  }

  static create(
    userId: string,
    email: string,
    name: string,
    surname: string,
    roles: Role[],
    avatar: string | null
  ): User | Errors {
    return User.fromPrimitive( userId, email, name, surname, roles,
      new Date(), avatar )
  }

  static from(
    userId: UUID,
    email: Email,
    name: ValidString,
    surname: ValidString,
    roles: Role[],
    createdAt: ValidDate,
    avatar   ?: ValidString
  ): User {
    return new User( userId, email,name,surname, roles, createdAt, avatar )
  }

  static fromPrimitiveThrow(
    userId: string,
    email: string,
    name: string,
    surname: string,
    roles: Role[],
    createdAt: Date | string,
    avatar?: string
  ): User {
    return new User(
      UUID.from( userId ),
      Email.from( email ),
      ValidString.from( name ),
      ValidString.from( surname ),
      roles,
      ValidDate.from( createdAt ),
      avatar ? ValidString.from( avatar ) : undefined
    )
  }

  static fromPrimitive(
    userId: string,
    email: string,
    name: string,
    surname: string,
    roles: Role[],
    createdAt: Date | string,
    avatar: string | null
  ): User | Errors {
    const errors = []

    const userIdValue = wrapType(
      () => UUID.from( userId ) )

    if ( userIdValue instanceof BaseException ) {
      errors.push( userIdValue )
    }

    const vemail = wrapType(
      () => Email.from( email ) )

    if ( vemail instanceof BaseException ) {
      errors.push( vemail )
    }

    const vname = wrapType(
      () => ValidString.from( name ) )

    if ( vname instanceof BaseException ) {
      errors.push( vname )
    }

    const vsurname = wrapType(
      () => ValidString.from( surname ) )

    if ( vsurname instanceof BaseException ) {
      errors.push( vsurname )
    }

    const vavatar = wrapTypeDefault( undefined,
      ( value ) => ValidString.from( value ), avatar )

    if ( vavatar instanceof BaseException ) {
      errors.push( vavatar )
    }

    const vcreatedAt = wrapType(
      () => ValidDate.from( createdAt ) )

    if ( vcreatedAt instanceof BaseException ) {
      errors.push( vcreatedAt )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new User(
      userIdValue as UUID,
      vemail as Email,
      vname as ValidString,
      vsurname as ValidString,
      roles,
      vcreatedAt as ValidDate,
      vavatar as ValidString | undefined
    )
  }
}

