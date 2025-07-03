import { Errors }                    from "../../shared/domain/exceptions/errors"
import {
  BaseException
}                                    from "../../shared/domain/exceptions/base_exception"
import { wrapType, wrapTypeDefault } from "../../shared/utils/wrap_type"
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
import { RoleType }                  from "@/modules/user/domain/role_type"

export abstract class User {
  abstract readonly userId: ValidString
  abstract readonly email: Email
  abstract readonly fullName: ValidString
  abstract readonly createdAt: ValidDate
  abstract readonly role: RoleType
  abstract readonly avatar?: ValidString
}

export class UserAnon implements User {
  private constructor(
    readonly userId: ValidString,
    readonly email: Email,
    readonly fullName: ValidString,
    readonly createdAt: ValidDate,
    readonly role: RoleType,
    readonly avatar ?: ValidString
  )
  {
  }

  static fromPrimitives(
    userId: string,
    email: string,
    fullName: string,
    createdAt: Date | string
  ): UserAuth | Errors {
    const errors = []

    const userIdValue = wrapType(
      () => ValidString.from( userId ) )

    if ( userIdValue instanceof BaseException ) {
      errors.push( userIdValue )
    }

    console.log("email", email)
    const vemail = wrapType(
      () => Email.from( email ) )

    if ( vemail instanceof BaseException ) {
      errors.push( vemail )
    }

    const vname = wrapType(
      () => ValidString.from( fullName ) )

    if ( vname instanceof BaseException ) {
      errors.push( vname )
    }

    const vcreatedAt = wrapType(
      () => ValidDate.from( createdAt ) )

    if ( vcreatedAt instanceof BaseException ) {
      errors.push( vcreatedAt )
    }

    const vrole = wrapType(
      () => RoleType.from( "PUBLIC" ) )

    if ( vrole instanceof BaseException ) {
      errors.push( vrole )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new UserAnon(
      userIdValue as UUID,
      vemail as Email,
      vname as ValidString,
      vcreatedAt as ValidDate,
      vrole as RoleType,
      undefined
    )
  }
}


export class UserAuth implements User {
  private constructor(
    readonly userId: ValidString,
    readonly email: Email,
    readonly fullName: ValidString,
    readonly createdAt: ValidDate,
    readonly role: RoleType,
    readonly avatar?: ValidString
  )
  {
  }

  static create(
    userId: string,
    email: string,
    fullName: string,
    role: string,
    avatar: string | null
  ): UserAuth | Errors {
    return UserAuth.fromPrimitives( userId, email, fullName, new Date(), role,
      avatar )
  }

  static from(
    userId: UUID,
    email: Email,
    fullName: ValidString,
    createdAt: ValidDate,
    role: RoleType,
    avatar   ?: ValidString
  ): UserAuth {
    return new UserAuth( userId, email, fullName, createdAt, role, avatar )
  }

  static fromPrimitiveThrow(
    userId: string,
    email: string,
    fullName: string,
    createdAt: Date | string,
    role: string,
    avatar?: string
  ): UserAuth {
    return new UserAuth(
      ValidString.from( userId ),
      Email.from( email ),
      ValidString.from( fullName ),
      ValidDate.from( createdAt ),
      RoleType.from( role ),
      avatar ? ValidString.from( avatar ) : undefined
    )
  }

  static fromPrimitives(
    userId: string,
    email: string,
    fullName: string,
    createdAt: Date | string,
    role: string,
    avatar: string | null
  ): UserAuth | Errors {
    const errors = []

    const userIdValue = wrapType(
      () => ValidString.from( userId ) )

    if ( userIdValue instanceof BaseException ) {
      errors.push( userIdValue )
    }

    const vemail = wrapType(
      () => Email.from( email ) )

    if ( vemail instanceof BaseException ) {
      errors.push( vemail )
    }

    const vname = wrapType(
      () => ValidString.from( fullName ) )

    if ( vname instanceof BaseException ) {
      errors.push( vname )
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

    const vrole = wrapType(
      () => RoleType.from( role ) )

    if ( vrole instanceof BaseException ) {
      errors.push( vrole )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new UserAuth(
      userIdValue as UUID,
      vemail as Email,
      vname as ValidString,
      vcreatedAt as ValidDate,
      vrole as RoleType,
      vavatar as ValidString | undefined
    )
  }
}

