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
  Quotation
}                                      from "@/modules/quotation/domain/quotation"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"
import {
  StoryDocument
}                                      from "@/modules/story/modules/story_document/domain/story_document"
import {
  StoryDocumentDTO
}                                      from "@/modules/story/modules/story_document/application/story_document_dto"
import {
  QuotationDetail
}                                      from "@/modules/quotation/modules/quotation_detail/domain/quotation_detail"
import {
  QuotationDetailDTO
}                                      from "@/modules/quotation/modules/quotation_detail/application/quotation_detail_dto"

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
    quotation: QuotationDTO ): Promise<Either<BaseException[], boolean>> {

    const exist = await ensureQuotationExist( this.dao, quotation.id )

    if ( isLeft( exist ) ) {
      return left( exist.left )
    }

    const oldQuotation = exist.right

    const details = await this.combineDetails(
      oldQuotation.id.toString(),
      oldQuotation.details,
      quotation.details
    )

    if ( isLeft( details ) ) {
      return left( details.left )
    }

    const updatedQuotation = Quotation.fromPrimitives(
      oldQuotation.id.toString(),
      oldQuotation.userId.toString(),
      oldQuotation.chatId.toString(),
      oldQuotation.workerId.toString(),
      quotation.title,
      quotation.total,
      quotation.status,
      quotation.value_format,
      oldQuotation.createdAt.toString(),
      details.right,
      quotation.estimated_time
    )

    if ( updatedQuotation instanceof Errors ) {
      return left( updatedQuotation.values )
    }

    const result = await this.dao.update( updatedQuotation )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }
}