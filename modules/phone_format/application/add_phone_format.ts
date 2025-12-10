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
}                                      from "@/modules/shared/domain/exceptions/errors"
import {
  SearchCountry
}                                      from "@/modules/country/application/search_country"
import {
  PhoneFormatDAO
}                                      from "@/modules/phone_format/domain/phone_format_dao"
import {
  PhoneFormatDTO
}                                      from "@/modules/phone_format/application/phone_format_dto"
import {
  PhoneFormat
}                                      from "@/modules/phone_format/domain/phone_format"
import {
  ensurePhoneFormatExist
}                                      from "@/modules/phone_format/utils/ensure_phone_format_exist"

export class AddPhoneFormat {
  constructor(
    private readonly dao: PhoneFormatDAO,
    private readonly searchCountry: SearchCountry
  )
  {
  }

  async execute( format: PhoneFormatDTO ): Promise<Either<BaseException[], PhoneFormat>> {
    const exist = await ensurePhoneFormatExist( this.dao, format.id )

    if ( isLeft( exist ) ) {
      if ( !containError( exist.left, new DataNotFoundException() ) ) {
        return left( exist.left )
      }
    }

    const countryResult = await this.searchCountry.execute(
      { id: format.country.id }, 1 )

    if ( isLeft( countryResult ) ) {
      return left( countryResult.left )
    }

    const country = countryResult.right.items[0]

    const newFormat = PhoneFormat.create(
      format.id,
      format.prefix,
      format.regex,
      country,
      format.example ?? undefined
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