import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  DataNotFoundException
}                                      from "@/modules/shared/domain/exceptions/data_not_found_exception"
import {
  Quotation
}                                      from "@/modules/quotation/domain/quotation"
import {
  QuotationDAO
}                                      from "@/modules/quotation/domain/quotation_dao"
import {
  ValidInteger
}                                      from "@/modules/shared/domain/value_objects/valid_integer"

export const ensureQuotationExist = async ( dao: QuotationDAO,
  quotationId: string ): Promise<Either<BaseException[], Quotation>> => {
  const quotation = await dao.search( {
    id: quotationId
  }, ValidInteger.from( 1 ) )

  if ( isLeft( quotation ) ) {
    return left( quotation.left )
  }

  if ( quotation.right.length > 0 && quotation.right[0].id.toString() !==
    quotationId )
  {
    return left( [new DataNotFoundException()] )
  }

  return right( quotation.right[0] )
}