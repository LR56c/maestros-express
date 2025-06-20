import { SpecialityDAO } from "@/modules/speciality/domain/speciality_dao"
import type {
  UUID
} from "@/modules/shared/domain/value_objects/uuid"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
} from "@/modules/shared/domain/exceptions/base_exception"
import {
  ValidInteger
} from "@/modules/shared/domain/value_objects/valid_integer"

export class RemoveSpeciality {
  constructor( private readonly dao: SpecialityDAO ) {
  }

  async execute( id: string ): Promise<Either<BaseException[], boolean>> {
    const existResult = await this.dao.search( { id: id },
      ValidInteger.from( 1 ) )

    if ( isLeft( existResult ) ) {
      return left( existResult.left )
    }

    const result = await this.dao.remove( existResult.right[0]!.id )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }

}