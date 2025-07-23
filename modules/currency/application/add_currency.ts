import { CurrencyDAO }                 from "@/modules/currency/domain/currency_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  CurrencyDTO
}                                      from "@/modules/currency/application/currency_dto"
import {
  ensureCurrencyExist
}                                      from "@/modules/currency/utils/ensure_currency_exist"
import { Currency }                    from "@/modules/currency/domain/currency"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"

export class AddCurrency {
  constructor(
    private readonly dao: CurrencyDAO
  )
  {
  }

  async execute( dto: CurrencyDTO ): Promise<Either<BaseException[], Currency>>{
    const exist = await ensureCurrencyExist(this.dao, dto.code)

    if(isLeft(exist)){
      return left(exist.left)
    }

    const currency = Currency.create(
      dto.code,
      dto.symbol,
      dto.name,
      dto.country_code,
      dto.decimals
    )

    if(currency instanceof Errors){
      return left(currency.values)
    }

    const result = await this.dao.add( currency )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right(currency)
  }

}