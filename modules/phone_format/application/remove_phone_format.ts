import { type Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                           from "@/modules/shared/domain/exceptions/base_exception"
import {
  PhoneFormatDAO
}                                           from "@/modules/phone_format/domain/phone_format_dao"
import {
  ensurePhoneFormatExist
}                                           from "@/modules/phone_format/utils/ensure_phone_format_exist"

export class RemovePhoneFormat {
  constructor( private readonly dao: PhoneFormatDAO ) {
  }

  async execute( id: string ): Promise<Either<BaseException[], boolean>> {
    const exist = await ensurePhoneFormatExist( this.dao, id )

    if ( isLeft( exist ) ) {
      return left( exist.left )
    }

    const result = await this.dao.remove( exist.right.id )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }
}