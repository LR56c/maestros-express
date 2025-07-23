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
  PhoneFormatDAO
}                                      from "@/modules/phone_format/domain/phone_format_dao"
import {
  PhoneFormat
}                                      from "@/modules/phone_format/domain/phone_format"

export const ensurePhoneFormatExist = async ( dao: PhoneFormatDAO,
  formatId: string ): Promise<Either<BaseException[], PhoneFormat>> => {

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