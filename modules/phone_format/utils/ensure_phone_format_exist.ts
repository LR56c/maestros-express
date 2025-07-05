import { CountryDAO } from "@/modules/country/domain/country_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
} from "@/modules/shared/domain/exceptions/base_exception"
import { Country } from "@/modules/country/domain/country"
import {
  ValidInteger
} from "@/modules/shared/domain/value_objects/valid_integer"
import {
  DataNotFoundException
} from "@/modules/shared/domain/exceptions/data_not_found_exception"
import {
  NationalIdentityFormatDAO
} from "@/modules/national_identity_format/domain/national_identity_format_dao"
import {
  NationalIdentityFormat
} from "@/modules/national_identity_format/domain/national_identity_format"
import { PhoneFormatDAO } from "@/modules/phone_format/domain/phone_format_dao"
import { PhoneFormat } from "@/modules/phone_format/domain/phone_format"

export const ensurePhoneFormatExist = async ( dao: PhoneFormatDAO,
  formatId: string ): Promise<Either<BaseException[], PhoneFormat>> => {

  const format = await dao.search({
    id: formatId
  }, ValidInteger.from(1))

  if ( isLeft(format) ) {
    return left(format.left)
  }

  if ( format.right.length > 0 && format.right[0]!.id.value !== formatId ) {
    return left( [new DataNotFoundException()] )
  }

  return right(format.right[0])
}