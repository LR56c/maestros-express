import { QuotationDAO } from "@/modules/quotation/domain/quotation_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
} from "@/modules/shared/domain/exceptions/base_exception"
import { Quotation } from "@/modules/quotation/domain/quotation"
import {
  ValidInteger
} from "@/modules/shared/domain/value_objects/valid_integer"
import {
  DataNotFoundException
} from "@/modules/shared/domain/exceptions/data_not_found_exception"
import {
  CurrencyDAO
}                                      from "@/modules/currency/domain/currency_dao"
import { Currency } from "@/modules/currency/domain/currency"

export const ensureCurrencyExist = async ( dao: CurrencyDAO,
  code: string ): Promise<Either<BaseException[], Currency>> => {
  const currency = await dao.search( {
    code: code
  }, ValidInteger.from( 1 ) )

  if ( isLeft( currency ) ) {
    return left( currency.left )
  }

  if ( currency.right.items.length > 0 && currency.right.items[0].codeId.value !==
    code )
  {
    return left( [new DataNotFoundException()] )
  }

  return right( currency.right.items[0] )
}