import { type Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                           from "@/modules/shared/domain/exceptions/base_exception"
import {
  CountryDAO
}                                           from "@/modules/country/domain/country_dao"
import {
  Country
}                                           from "@/modules/country/domain/country"
import {
  ValidInteger
}                                           from "@/modules/shared/domain/value_objects/valid_integer"
import {
  DataNotFoundException
}                                           from "@/modules/shared/domain/exceptions/data_not_found_exception"

export const ensureCountryExist = async ( dao: CountryDAO,
  countryId: string ): Promise<Either<BaseException[], Country>> => {

  const country = await dao.search({
    id: countryId
  }, ValidInteger.from(1))

  if ( isLeft(country) ) {
    return left(country.left)
  }

  if ( country.right.items.length > 0 && country.right.items[0]!.id.value !== countryId ) {
    return left( [new DataNotFoundException()] )
  }

  return right(country.right.items[0])
}