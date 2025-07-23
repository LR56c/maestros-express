import { Currency }    from "@/modules/currency/domain/currency"
import { CurrencyDTO } from "@/modules/currency/application/currency_dto"
import { Errors }      from "@/modules/shared/domain/exceptions/errors"
import { wrapType }    from "@/modules/shared/utils/wrap_type"
import {
  ValidString
}                      from "@/modules/shared/domain/value_objects/valid_string"
import {
  BaseException
}                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  ValidInteger
}                      from "@/modules/shared/domain/value_objects/valid_integer"

export class CurrencyMapper {
  static toDTO(currency: Currency): CurrencyDTO {
    return {
      code: currency.codeId.value,
      country_code: currency.countryCode.value,
      decimals: currency.decimals.value,
      name: currency.name.value,
      symbol: currency.symbol.value,
    }
  }

  static toJSON(currency: CurrencyDTO): Record<string, any> {
    return{
      code: currency.code,
      country_code: currency.country_code,
      decimals: currency.decimals,
      name: currency.name,
      symbol: currency.symbol,
    }
  }

  static fromJSON(currency : Record<string, any>) : CurrencyDTO | Errors {
    const errors = []

    const code = wrapType(()=>ValidString.from(currency.code))

    if (code instanceof BaseException) {
      errors.push(code)
    }

    const countryCode = wrapType(() => ValidString.from(currency.country_code))

    if (countryCode instanceof BaseException) {
      errors.push(countryCode)
    }

    const decimals = wrapType(() => ValidInteger.from(currency.decimals))

    if (decimals instanceof BaseException) {
      errors.push(decimals)
    }

    const symbol = wrapType(() => ValidString.from(currency.symbol))

    if (symbol instanceof BaseException) {
      errors.push(symbol)
    }

    const name = wrapType(() => ValidString.from(currency.name))

    if (name instanceof BaseException) {
      errors.push(name)
    }

    if (errors.length > 0) {
      return new Errors(errors)
    }

    return {
      code: (code as ValidString).value,
      country_code: (countryCode as ValidString).value,
      decimals:  (decimals as ValidInteger).value,
      symbol: (symbol as ValidString).value,
      name: (name as ValidString).value,
    }
  }

  static toDomain(json : Record<string, any>) : Currency | Errors {
    return Currency.fromPrimitives(
      json.code,
      json.symbol,
      json.name,
      json.country_code,
      json.decimals,
      json.created_at,
    )
  }
}