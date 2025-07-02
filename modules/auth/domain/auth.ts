import { Email }                     from "../../shared/domain/value_objects/email"
import {
  ValidString
}                                    from "../../shared/domain/value_objects/valid_string"
import { AuthMethod }                from "./auth_method"
import {
  ValidDate
}                                    from "../../shared/domain/value_objects/valid_date"
import {
  Errors
}                                    from "../../shared/domain/exceptions/errors"
import { wrapType, wrapTypeDefault } from "../../shared/utils/wrap_type"
import {
  BaseException
}                                    from "../../shared/domain/exceptions/base_exception"
import {
  UUID
}                                    from "@/modules/shared/domain/value_objects/uuid"

export class Auth {
  private constructor(
    readonly userId: ValidString,
    readonly email: Email,
    readonly metadata: Record<string, any>,
    readonly authMethod: AuthMethod,
    readonly createdAt: ValidDate,
    readonly updatedAt ?: ValidDate,
  )
  {
  }

  static create(
    userId: string,
    email: string,
    metadata: Record<string, any>,
    authMethod: string,
  ): Auth | Errors {
    return Auth.fromPrimitives( userId, email, metadata, authMethod,
      ValidDate.nowUTC(), undefined )
  }

  static fromPrimitivesThrow(
    userId: string,
    email: string,
    metadata: Record<string, any>,
    authMethod: string,
    createdAt: Date | string,
    updatedAt ?: Date | string,
  ): Auth {
    return new Auth(
      ValidString.from( userId ),
      Email.from( email ),
      metadata,
      AuthMethod.from( authMethod ),
      ValidDate.from( createdAt ),
      updatedAt ? ValidDate.from( updatedAt ) : undefined,
    )
  }

  static fromPrimitives(
    userId: string,
    email: string,
    metadata: Record<string, any>,
    authMethod: string,
    createdAt: Date | string,
    updatedAt ?: Date | string,
  ): Auth | Errors {
    const errors  = []
    const vuserId = wrapType(
      () => ValidString.from( userId ) )
    if ( vuserId instanceof BaseException ) {
      errors.push( vuserId )
    }

    const vemail = wrapType( () => Email.from( email ) )

    if ( vemail instanceof BaseException ) {
      errors.push( vemail )
    }

    const vmethod = wrapType(
      () => AuthMethod.from( authMethod ) )

    if ( vmethod instanceof BaseException ) {
      errors.push( vmethod )
    }

    const vcreatedAt = wrapType(
      () => ValidDate.from( createdAt ) )

    if ( vcreatedAt instanceof BaseException ) {
      errors.push( vcreatedAt )
    }

    const vupdatedAt = wrapTypeDefault(
      undefined,
      ( value ) => ValidDate.from( value ),
      updatedAt
    )

    if ( vupdatedAt instanceof BaseException ) {
      errors.push( vupdatedAt )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new Auth(
      vuserId as ValidString,
      vemail as Email,
      metadata,
      vmethod as AuthMethod,
      vcreatedAt as ValidDate,
      vupdatedAt as ValidDate | undefined,
    )

  }
}
