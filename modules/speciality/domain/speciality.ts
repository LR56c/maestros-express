import { UUID } from "@/modules/shared/domain/value_objects/uuid"
import { ValidDate } from "@/modules/shared/domain/value_objects/valid_date"
import { ValidString } from "@/modules/shared/domain/value_objects/valid_string"
import { Errors } from "@/modules/shared/domain/exceptions/errors"
import { wrapType } from "@/modules/shared/utils/wrap_type"
import {
  BaseException
} from "@/modules/shared/domain/exceptions/base_exception"

export class Speciality {
 private constructor(
   readonly id: UUID,
   readonly name: ValidString,
   readonly createdAt: ValidDate,
 ) {
 }

  static create(
    id: string,
    name: string,
  ): Speciality | Errors {
    return Speciality.fromPrimitives(id, name, ValidDate.nowUTC())
  }

  static from(
    id: UUID,
    name: ValidString,
    createdAt: ValidDate,
  ): Speciality {
    return new Speciality(id, name, createdAt)
  }

  static fromPrimitivesThrow(
    id: string,
    name: string,
    createdAt: Date | string,
  ): Speciality {
    return new Speciality(
      UUID.from(id),
      ValidString.from(name),
      ValidDate.from(createdAt),
    )
  }

  static fromPrimitives(
    id: string,
    name: string,
    createdAt: Date | string,
  ): Speciality | Errors {
    const errors = []

    const idVO = wrapType(
      () => UUID.from(id))

    if (idVO instanceof BaseException) {
      errors.push(idVO)
    }

    const nameVO = wrapType(() => ValidString.from(name))

    if (nameVO instanceof BaseException) {
      errors.push(nameVO)
    }

    const createdAtVO = wrapType(() => ValidDate.from(createdAt))

    if (createdAtVO instanceof BaseException) {
      errors.push(createdAtVO)
    }

    if (errors.length > 0) {
      return new Errors( errors )
    }

    return new Speciality(
      idVO as UUID,
      nameVO as ValidString,
      createdAtVO as ValidDate,
    )
  }
}