import { CountryDAO }                  from "@/modules/country/domain/country_dao"
import { Country }                     from "@/modules/country/domain/country"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  CountryDTO
}                                      from "@/modules/country/application/country_dto"
import {
  ensureCountryExist
}                                      from "@/modules/country/utils/ensure_country_exist"
import {
  containError
}                                      from "@/modules/shared/utils/contain_error"
import {
  DataNotFoundException
}                                      from "@/modules/shared/domain/exceptions/data_not_found_exception"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"

export class AddCountry {
  constructor( private readonly dao: CountryDAO ) {
  }

  async execute( country: CountryDTO ): Promise<Either<BaseException[], Country>> {
    const exist = await ensureCountryExist( this.dao, country.id )

    if ( isLeft( exist ) ) {
      if ( !containError( exist.left, new DataNotFoundException() ) ) {
        return left( exist.left )
      }
    }

    const newCountry = Country.create(
      country.id,
      country.name,
      country.code
    )

    if ( newCountry instanceof Errors ) {
      return left( newCountry.values )
    }

    const result = await this.dao.add( newCountry )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( newCountry )
  }
}