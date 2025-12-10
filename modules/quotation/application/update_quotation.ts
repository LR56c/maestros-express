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
    const details = new Map<string, QuotationDetail>(oldDetails.map(
      detail => [detail.id.toString(), detail]
    ))

    for ( const e of newDetails ) {
      const existingDocIndex = details.get(e.id.toString() )
      if ( !existingDocIndex ) {

        const detail = QuotationDetail.create(
          e.id,
          quotationId,
          e.name,
          e.value,
          e.value_format,
          e.description ?? undefined
        )

        if ( detail instanceof Errors ) {
          return left( detail.values )
        }
        details.set( e.id.toString(), detail )
      }
    }

    return right( Array.from(details.values()) )
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
    if ( quotation.details && quotation.details.length > 0 ) {

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
      quotation.estimated_time ?? undefined
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