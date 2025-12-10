import { QuotationDAO }                from "@/modules/quotation/domain/quotation_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  ensureQuotationExist
}                                      from "@/modules/quotation/utils/ensure_quotation_exist"
import {
  containError
}                                      from "@/modules/shared/utils/contain_error"
import {
  DataNotFoundException
}                                      from "@/modules/shared/domain/exceptions/data_not_found_exception"
import {
  Quotation
}                                      from "@/modules/quotation/domain/quotation"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"
import {
  QuotationDetail
}                                      from "@/modules/quotation/modules/quotation_detail/domain/quotation_detail"
import {
  QuotationRequest
}                                      from "@/modules/quotation/application/quotation_request"
import {
  QuotationStatusEnum
}                                      from "@/modules/quotation/domain/quotation_status"

export class AddQuotation {
  constructor( private readonly dao: QuotationDAO ) {
  }

  async execute(dto: QuotationRequest ): Promise<Either<BaseException[], Quotation>> {
    const exist = await ensureQuotationExist( this.dao, dto.id )

    if ( isLeft( exist ) ) {
      if ( !containError( exist.left, new DataNotFoundException() ) ) {
        return left( exist.left )
      }
    }

    const details : QuotationDetail[] = []

    let total = 0
    for ( const e of dto.details ) {
      const detail = QuotationDetail.create(
        e.id,
        dto.id,
        e.name,
        e.value,
        e.value_format,
        e.description ?? undefined,
      )

      if ( detail instanceof Errors ) {
        return left( detail.values )
      }

      total += detail.value.value
      details.push( detail )
    }

    const newQuotation = Quotation.create(
      dto.id,
      dto.user_id,
      dto.chat_id,
      dto.worker_id,
      dto.title,
      total,
      QuotationStatusEnum.PENDING,
      details[0]!.valueFormat.value,
      details,
      dto.estimated_time ?? undefined,
    )

    if ( newQuotation instanceof Errors ) {
      return left( newQuotation.values )
    }

    const result = await this.dao.add( newQuotation )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( newQuotation )
  }

}