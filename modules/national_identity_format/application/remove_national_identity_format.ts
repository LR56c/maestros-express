import { type Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                           from "@/modules/shared/domain/exceptions/base_exception"
import {
  NationalIdentityFormatDAO
}                                           from "@/modules/national_identity_format/domain/national_identity_format_dao"
import {
  ensureNationalIdentityFormatExist
}                                           from "@/modules/national_identity_format/utils/ensure_national_identity_format_exist"

export class RemoveNationalIdentityFormat {
  constructor( private readonly dao: NationalIdentityFormatDAO ) {
  }

  async execute( id: string ): Promise<Either<BaseException[], boolean>> {
    const exist = await ensureNationalIdentityFormatExist( this.dao, id )

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