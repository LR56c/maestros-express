import { type Either } from "fp-ts/Either"
import {
  ValidInteger
}                      from "@/modules/shared/domain/value_objects/valid_integer"
import {
  ValidString
}                      from "@/modules/shared/domain/value_objects/valid_string"
import {
  BaseException
}                      from "@/modules/shared/domain/exceptions/base_exception"
import { UUID }        from "@/modules/shared/domain/value_objects/uuid"
import { PhoneFormat } from "@/modules/phone_format/domain/phone_format"

export abstract class PhoneFormatDAO{

  abstract search( query: Record<string, any>, limit ?: ValidInteger,
    skip ?: ValidString, sortBy ?: ValidString,
    sortType ?: ValidString ): Promise<Either<BaseException[], PhoneFormat[]>>
  abstract add( format: PhoneFormat ): Promise<Either<BaseException, boolean>>
  abstract update( format: PhoneFormat ): Promise<Either<BaseException, boolean>>
  abstract remove( id: UUID ): Promise<Either<BaseException, boolean>>
}
