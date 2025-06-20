import { CountryDAO }                  from "@/modules/country/domain/country_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  ensureCountryExist
} from "@/modules/country/utils/ensure_country_exist"
import { CountryDTO } from "@/modules/country/application/country_dto"
import { Country }              from "@/modules/country/domain/country"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"

export class UpdateCountry {
  constructor(private readonly dao : CountryDAO) {
  }

  async execute( country: CountryDTO ): Promise<Either<BaseException[], boolean>>{
    const exist = await ensureCountryExist(this.dao, country.id)

    if ( isLeft(exist) ) {
      return left(exist.left)
    }

    const updatedCountry = Country.fromPrimitives(
      country.id,
      country.name,
      country.code,
      exist.right.createdAt.toString()
    )

    if( updatedCountry instanceof Errors ) {
      return left(updatedCountry.values)
    }

    const result = await this.dao.update(updatedCountry)

    if ( isLeft(result) ) {
      return left([result.left])
    }

    return right(true)
  }
}