import { UUID }                      from "@/modules/shared/domain/value_objects/uuid"
import { Sector }                    from "@/modules/sector/domain/sector"
import {
  ValidDate
}                                    from "@/modules/shared/domain/value_objects/valid_date"
import {
  ValidString
}                                    from "@/modules/shared/domain/value_objects/valid_string"
import {
  ValidDecimal
}                                    from "@/modules/shared/domain/value_objects/valid_decimal"
import {
  QuotationStatus
}                                    from "@/modules/quotation/domain/quotation_status"
import {
  Errors
}                                    from "@/modules/shared/domain/exceptions/errors"
import {
  BaseException
}                                    from "@/modules/shared/domain/exceptions/base_exception"
import { wrapType, wrapTypeDefault } from "@/modules/shared/utils/wrap_type"
import {
  QuotationDetail
}                                    from "@/modules/quotation/modules/quotation_detail/domain/quotation_detail"

export class Quotation {
  private constructor(
    readonly id: UUID,
    readonly userId: UUID,
    readonly chatId: UUID,
    readonly workerId: UUID,
    readonly title: ValidString,
    readonly total: ValidDecimal,
    readonly status: QuotationStatus,
    readonly valueFormat: ValidString,
    readonly createdAt: ValidDate,
    readonly details: QuotationDetail[],
    readonly estimatedTime ?: ValidDate
  )
  {
  }

  static create(
    id: string,
    userId: string,
    chatId: string,
    workerId: string,
    title: string,
    total: number,
    status: string,
    valueFormat: string,
    details: QuotationDetail[],
    estimatedTime ?: Date | string
  ): Quotation | Errors {
    return Quotation.fromPrimitives(
      id,
      userId,
      chatId,
      workerId,
      title,
      total,
      status,
      valueFormat,
      ValidDate.nowUTC(),
      details,
      estimatedTime
    )
  }

  static fromPrimitivesThrow(
    id: string,
    userId: string,
    chatId: string,
    workerId: string,
    title: string,
    total: number,
    status: string,
    valueFormat: string,
    createdAt: Date | string,
    details: QuotationDetail[],
    estimatedTime ?: Date | string
  ): Quotation {
    return new Quotation(
      UUID.from( id ),
      UUID.from( userId ),
      UUID.from( chatId ),
      UUID.from( workerId ),
      ValidString.from( title ),
      ValidDecimal.from( total ),
      QuotationStatus.from( status ),
      ValidString.from( valueFormat ),
      ValidDate.from( createdAt ),
      details,
      estimatedTime ? ValidDate.from( estimatedTime ) : undefined
    )
  }

  static fromPrimitives(
    id: string,
    userId: string,
    chatId: string,
    workerId: string,
    title: string,
    total: number,
    status: string,
    valueFormat: string,
    createdAt: Date | string,
    details: QuotationDetail[],
    estimatedTime : Date | string | undefined
  ): Quotation | Errors {
    const errors = []

    const idValue = wrapType( () => UUID.from( id ) )
    if ( idValue instanceof BaseException ) {
      errors.push( idValue )
    }

    const userIdValue = wrapType( () => UUID.from( userId ) )
    if ( userIdValue instanceof BaseException ) {
      errors.push( userIdValue )
    }

    const chatIdValue = wrapType( () => UUID.from( chatId ) )
    if ( chatIdValue instanceof BaseException ) {
      errors.push( chatIdValue )
    }

    const workerIdValue = wrapType( () => UUID.from( workerId ) )
    if ( workerIdValue instanceof BaseException ) {
      errors.push( workerIdValue )
    }

    const titleValue = wrapType( () => ValidString.from( title ) )
    if ( titleValue instanceof BaseException ) {
      errors.push( titleValue )
    }

    const totalValue = wrapType( () => ValidDecimal.from( total ) )
    if ( totalValue instanceof BaseException ) {
      errors.push( totalValue )
    }

    const statusValue = wrapType( () => QuotationStatus.from( status ) )
    if ( statusValue instanceof BaseException ) {
      errors.push( statusValue )
    }

    const valueFormatValue = wrapType( () => ValidString.from( valueFormat ) )
    if ( valueFormatValue instanceof BaseException ) {
      errors.push( valueFormatValue )
    }

    const createdAtValue = wrapType( () => ValidDate.from( createdAt ) )
    if ( createdAtValue instanceof BaseException ) {
      errors.push( createdAtValue )
    }

    const estimatedTimeValue = wrapTypeDefault( undefined,
      ( value ) => ValidDate.from( value ), estimatedTime )
    if ( estimatedTimeValue instanceof BaseException ) {
      errors.push( estimatedTimeValue )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new Quotation(
      idValue as UUID,
      userIdValue as UUID,
      chatIdValue as UUID,
      workerIdValue as UUID,
      titleValue as ValidString,
      totalValue as ValidDecimal,
      statusValue as QuotationStatus,
      valueFormatValue as ValidString,
      createdAtValue as ValidDate,
      details,
      estimatedTimeValue as ValidDate | undefined
    )
  }
}