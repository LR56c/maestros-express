import { CurrencyDAO }                 from "@/modules/currency/domain/currency_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  ensureCurrencyExist
}                                      from "@/modules/currency/utils/ensure_currency_exist"

export class RemoveCurrency {
  constructor(
    private readonly dao: CurrencyDAO
  )
  {
  }

  async execute( code: string ): Promise<Either<BaseException[], boolean>> {
    const exist = await ensureCurrencyExist( this.dao, code )

    if ( isLeft( exist ) ) {
      return left( exist.left )
    }

    const result = await this.dao.remove( exist.right.codeId)

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }

}