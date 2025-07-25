import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  ValidInteger
}                                      from "@/modules/shared/domain/value_objects/valid_integer"
import {
  DataNotFoundException
}                                      from "@/modules/shared/domain/exceptions/data_not_found_exception"
import {
  NationalIdentityFormatDAO
}                                      from "@/modules/national_identity_format/domain/national_identity_format_dao"
import {
  NationalIdentityFormat
}                                      from "@/modules/national_identity_format/domain/national_identity_format"

export const ensureNationalIdentityFormatExist = async ( dao: NationalIdentityFormatDAO,
  formatId: string ): Promise<Either<BaseException[], NationalIdentityFormat>> => {

  const format = await dao.search({
    id: formatId
  }, ValidInteger.from(1))

  if ( isLeft(format) ) {
    return left(format.left)
  }

  if ( format.right.items.length > 0 && format.right.items[0]!.id.value !== formatId ) {
    return left( [new DataNotFoundException()] )
  }

  return right(format.right.items[0])
}