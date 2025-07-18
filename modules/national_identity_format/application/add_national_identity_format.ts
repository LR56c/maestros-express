
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  containError
}                                      from "@/modules/shared/utils/contain_error"
import {
  DataNotFoundException
}                                      from "@/modules/shared/domain/exceptions/data_not_found_exception"
import {
  Errors
} from "@/modules/shared/domain/exceptions/errors"
import {
  NationalIdentityFormatDAO
} from "@/modules/national_identity_format/domain/national_identity_format_dao"
import {
  NationalIdentityFormat
} from "@/modules/national_identity_format/domain/national_identity_format"
import {
  NationalIdentityFormatDTO
} from "@/modules/national_identity_format/application/national_identity_format_dto"
import {
  ensureNationalIdentityFormatExist
} from "@/modules/national_identity_format/utils/ensure_national_identity_format_exist"
import {
  SearchCountry
} from "@/modules/country/application/search_country"

export class AddNationalIdentityFormat {
  constructor(
    private readonly dao: NationalIdentityFormatDAO,
    private readonly searchCountry : SearchCountry
  ) {
  }

  async execute( format: NationalIdentityFormatDTO ): Promise<Either<BaseException[], NationalIdentityFormat>> {
    const exist = await ensureNationalIdentityFormatExist( this.dao, format.id )

    if ( isLeft( exist ) ) {
      if ( !containError( exist.left, new DataNotFoundException() ) ) {
        return left( exist.left )
      }
    }

    const countryResult = await this.searchCountry.execute( { id: format.country.id }, 1 )

    if ( isLeft( countryResult ) ) {
      return left( countryResult.left )
    }

    const country = countryResult.right.items[0]

    const newFormat = NationalIdentityFormat.create(
      format.id,
      format.name,
      format.regex,
      country
    )

    if ( newFormat instanceof Errors ) {
      return left( newFormat.values )
    }

    const result = await this.dao.add( newFormat )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( newFormat )
  }
}