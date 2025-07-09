import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import { CurrencyDTO } from "@/modules/currency/application/currency_dto"
import { Currency }    from "@/modules/currency/domain/currency"
import { Errors }      from "@/modules/shared/domain/exceptions/errors"
import {
  ensureCurrencyExist
} from "@/modules/currency/utils/ensure_currency_exist"
import { CurrencyDAO } from "@/modules/currency/domain/currency_dao"

export class UpdateCurrency {
  constructor(
    private readonly dao: CurrencyDAO
  )
  {
  }

  async execute( dto: CurrencyDTO ): Promise<Either<BaseException[], Currency>> {
    const exist = await ensureCurrencyExist( this.dao, dto.code )

    if ( isLeft( exist ) ) {
      return left( exist.left )
    }

    const old = exist.right

    const updated = Currency.fromPrimitives(
      old.codeId.value,
      dto.name,
      dto.symbol,
      dto.country_code,
      dto.decimals,
      old.createdAt.toString()
    )

    if ( updated instanceof Errors ) {
      return left( updated.values )
    }

    const result = await this.dao.update( updated )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( updated )
  }
}