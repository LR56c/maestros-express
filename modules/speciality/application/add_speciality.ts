import { SpecialityDAO }               from "@/modules/speciality/domain/speciality_dao"
import {
  Speciality
}                                      from "@/modules/speciality/domain/speciality"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  SpecialityDTO
}                                      from "@/modules/speciality/application/speciality_dto"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"
import {
  ensureSpecialityExist
}                                      from "@/modules/speciality/utils/ensure_speciality_exist"
import {
  containError
}                                      from "@/modules/shared/utils/contain_error"
import {
  DataNotFoundException
}                                      from "@/modules/shared/domain/exceptions/data_not_found_exception"

export class AddSpeciality {
  constructor( private readonly dao: SpecialityDAO ) {
  }


  async execute( speciality: SpecialityDTO ): Promise<Either<BaseException[], Speciality>> {
    const existResult = await ensureSpecialityExist( this.dao, speciality.name )
    if ( isLeft( existResult ) ) {
      if ( !containError( existResult.left, new DataNotFoundException() ) ) {
        return left( existResult.left )
      }
    }

    const newSpeciality = Speciality.create(
      speciality.id,
      speciality.name
    )

    if ( newSpeciality instanceof Errors ) {
      return left( newSpeciality.values )
    }

    const result = await this.dao.add( newSpeciality )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( newSpeciality )
  }

}