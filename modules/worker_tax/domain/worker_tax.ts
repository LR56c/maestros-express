import { UUID }      from "@/modules/shared/domain/value_objects/uuid"
import {
  ValidString
}                    from "@/modules/shared/domain/value_objects/valid_string"
import {
  ValidInteger
}                    from "@/modules/shared/domain/value_objects/valid_integer"
import { ValidDate } from "@/modules/shared/domain/value_objects/valid_date"
import { Errors }    from "@/modules/shared/domain/exceptions/errors"
import { wrapType }  from "@/modules/shared/utils/wrap_type"
import {
  BaseException
}                    from "@/modules/shared/domain/exceptions/base_exception"

export class WorkerTax {
  private constructor(
    readonly id: UUID,
    readonly workerId: UUID,
    readonly name: ValidString,
    readonly value: ValidInteger,
    readonly valueFormat: ValidString,
    readonly createdAt: ValidDate,
  ){}

  static create(
    id: string,
    workerId: string,
    name: string,
    value: number,
    valueFormat: string
  ): WorkerTax | Errors {
    return WorkerTax.fromPrimitives(
      id, workerId, name, value, valueFormat, ValidDate.nowUTC()
    )
  }

  static fromPrimitivesThrow(
    id: string,
    workerId: string,
    name: string,
    value: number,
    valueFormat: string,
    createdAt: Date | string
  ): WorkerTax {
    return new WorkerTax(
      UUID.from(id),
      UUID.from(workerId),
      ValidString.from(name),
      ValidInteger.from(value),
      ValidString.from(valueFormat),
      ValidDate.from(createdAt)
    )
  }

  static fromPrimitives(
    id: string,
    workerId: string,
    name: string,
    value: number,
    valueFormat: string,
    createdAt: Date | string
  ): WorkerTax | Errors {
    const errors = []

    const idVO = wrapType(
      () => UUID.from(id)
    )

    if (idVO instanceof BaseException) {
      errors.push(idVO)
    }

    const workerIdVO = wrapType(
      () => UUID.from(workerId)
    )

    if (workerIdVO instanceof BaseException) {
      errors.push(workerIdVO)
    }

    const nameVO = wrapType(
      () => ValidString.from(name)
    )

    if (nameVO instanceof BaseException) {
      errors.push(nameVO)
    }

    const valueVO = wrapType(
      () => ValidInteger.from(value)
    )

    if (valueVO instanceof BaseException) {
      errors.push(valueVO)
    }

    const valueFormatVO = wrapType(
      () => ValidString.from(valueFormat)
    )

    if (valueFormatVO instanceof BaseException) {
      errors.push(valueFormatVO)
    }

    const createdAtVO = wrapType( () => ValidDate.from(createdAt) )

    if ( createdAtVO instanceof BaseException ) {
      errors.push( createdAtVO )
    }

    if (errors.length > 0) {
      return new Errors(errors)
    }

    return new WorkerTax(
      idVO as UUID,
      workerIdVO as UUID,
      nameVO as ValidString,
      valueVO as ValidInteger,
      valueFormatVO as ValidString,
      createdAtVO as ValidDate
    )
  }
}