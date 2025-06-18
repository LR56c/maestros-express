import { ValidString }               from "../../shared/domain/value_objects/valid_string"
import {
  ValidDate
}                                    from "../../shared/domain/value_objects/valid_date"
import {
  Errors
}                                    from "../../shared/domain/exceptions/errors"
import {
  BaseException
}                                    from "../../shared/domain/exceptions/base_exception"
import { wrapType, wrapTypeDefault } from "../../shared/utils/wrap_type"
import {
  UUID
}                                    from "@/modules/shared/domain/value_objects/uuid"

export class Role {
  private constructor(
    readonly id: UUID,
    readonly name: ValidString,
    readonly createdAt: ValidDate,
    readonly updatedAt?: ValidDate
  )
  {
  }

  static create(
    id: string,
    name: string
  ): Role | Errors {
    return Role.fromPrimitives( id, name, ValidDate.nowUTC(), null )
  }

  static from(
    id: UUID,
    name: ValidString,
    createdAt: ValidDate,
    updatedAt?: ValidDate
  ): Role {
    return new Role( id, name, createdAt, updatedAt )
  }

  static fromPrimitivesThrow(
    id: string,
    name: string,
    createdAt: Date,
    updatedAt: Date | null
  ): Role {
    return new Role(
      UUID.from( id ),
      ValidString.from( name ),
      ValidDate.from( createdAt ),
      updatedAt ? ValidDate.from( updatedAt ) : undefined
    )
  }

  static fromPrimitives(
    id: string,
    name: string,
    createdAt: Date | string,
    updatedAt: Date | string | null
  ): Role | Errors {
    const errors = []

    const idVO = wrapType( () => UUID.from( id ) )

    if ( idVO instanceof BaseException ) {
      errors.push( idVO )
    }

    const nameVO = wrapType( () => ValidString.from( name ) )

    if ( nameVO instanceof BaseException ) {
      errors.push( nameVO )
    }

    const createdAtVO = wrapType( () => ValidDate.from( createdAt ) )

    if ( createdAtVO instanceof BaseException ) {
      errors.push( createdAtVO )
    }

    const vupdatedAt = wrapTypeDefault( undefined,
      ( value ) => ValidDate.from( value ), updatedAt )

    if ( vupdatedAt instanceof BaseException ) {
      errors.push( vupdatedAt )
    }

    if ( errors.length ) {
      return new Errors( errors )
    }

    return new Role(
      idVO as UUID,
      nameVO as ValidString,
      createdAtVO as ValidDate,
      vupdatedAt as ValidDate | undefined
    )
  }
}
