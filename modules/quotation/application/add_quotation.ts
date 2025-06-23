import { QuotationDAO }                from "@/modules/quotation/domain/quotation_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  QuotationDTO
}                                      from "@/modules/quotation/application/quotation_dto"
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

export class AddQuotation {
  constructor( private readonly dao: QuotationDAO ) {
  }

  async execute(
    userId: string,
    chatId: string,
    workerId: string,
    quotation: QuotationDTO ): Promise<Either<BaseException[], boolean>> {
    const exist = await ensureQuotationExist( this.dao, quotation.id )

    if ( isLeft( exist ) ) {
      if ( !containError( exist.left, new DataNotFoundException() ) ) {
        return left( exist.left )
      }
    }

    const details : QuotationDetail[] = []

    for ( const e of quotation.details ) {
      const detail = QuotationDetail.create(
        e.id,
        quotation.id,
        e.name,
        e.value,
        e.value_format,
        e.description,
      )

      if ( detail instanceof Errors ) {
        return left( detail.values )
      }

      details.push( detail )
    }

    const newQuotation = Quotation.create(
      quotation.id,
      userId,
      chatId,
      workerId,
      quotation.title,
      quotation.total,
      quotation.status,
      quotation.value_format,
      details,
      quotation.estimated_time
    )

    if ( newQuotation instanceof Errors ) {
      return left( newQuotation.values )
    }

    const result = await this.dao.add( newQuotation )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }

}