import { QuotationDAO }                from "@/modules/quotation/domain/quotation_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  ensureQuotationExist
}                                      from "@/modules/quotation/utils/ensure_quotation_exist"
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
  QuotationDetailDTO
}                                      from "@/modules/quotation/modules/quotation_detail/application/quotation_detail_dto"
import {
  QuotationUpdateDTO
}                                      from "@/modules/quotation/application/quotation_update_dto"

export class UpdateQuotation {
  constructor( private readonly dao: QuotationDAO ) {
  }

  private async combineDetails(
    quotationId: string,
    oldDetails: QuotationDetail[],
    newDetails: QuotationDetailDTO[]
  ): Promise<Either<BaseException[], QuotationDetail[]>> {
    const details: QuotationDetail[] = [...oldDetails]

    for ( const e of newDetails ) {
      const existingDocIndex = details.findIndex(
        doc => doc.id.toString() === e.id
      )
      if ( existingDocIndex === -1 ) {

        const detail = QuotationDetail.create(
          e.id,
          quotationId,
          e.name,
          e.value,
          e.value_format,
          e.description
        )

        if ( detail instanceof Errors ) {
          return left( detail.values )
        }
        details.push( detail )
      }
    }

    return right( details )
  }

  async execute(
    quotation: QuotationUpdateDTO ): Promise<Either<BaseException[], Quotation>> {

    const exist = await ensureQuotationExist( this.dao, quotation.id )

    if ( isLeft( exist ) ) {
      return left( exist.left )
    }

    const oldQuotation = exist.right

    let details: QuotationDetail[] = []
    let total: number | undefined  = undefined
    if ( quotation.details ) {

      const detailsResult = await this.combineDetails(
        oldQuotation.id.toString(),
        oldQuotation.details,
        quotation.details
      )

      if ( isLeft( detailsResult ) ) {
        return left( detailsResult.left )
      }
      details = detailsResult.right
      total = details.reduce( ( acc, detail ) => acc + detail.value.value, 0 )
    }
    else {
      details = oldQuotation.details
    }

    const updatedQuotation = Quotation.fromPrimitives(
      oldQuotation.id.toString(),
      oldQuotation.userId.toString(),
      oldQuotation.chatId.toString(),
      oldQuotation.workerId.toString(),
      quotation.title ? quotation.title : oldQuotation.title.value,
      total ? total : oldQuotation.total.value,
      quotation.status ? quotation.status : oldQuotation.status.value,
      details[0]!.valueFormat.value,
      oldQuotation.createdAt.toString(),
      details,
      quotation.estimated_time
    )

    if ( updatedQuotation instanceof Errors ) {
      return left( updatedQuotation.values )
    }

    const result = await this.dao.update( updatedQuotation )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( updatedQuotation )
  }
}