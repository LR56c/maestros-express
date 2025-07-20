import { SpecialityDAO }               from "@/modules/speciality/domain/speciality_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  ensureSpecialityExist
}                                      from "@/modules/speciality/utils/ensure_speciality_exist"
import {
  Speciality
}                                      from "@/modules/speciality/domain/speciality"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"
import {
  SpecialityDTO
}                                      from "@/modules/speciality/application/speciality_dto"

export class UpdateSpeciality {
  constructor( private readonly dao: SpecialityDAO ) {
  }


  async execute(dto : SpecialityDTO): Promise<Either<BaseException[], Speciality>>{
    const existResult = await ensureSpecialityExist(this.dao, dto.id )

    if ( isLeft(existResult) ) {
      return left( existResult.left )
    }

    const newSpeciality = Speciality.fromPrimitives(
      existResult.right.id.toString(),
      dto.name,
      existResult.right.createdAt.toString()
    )

    if(newSpeciality instanceof Errors) {
      return left(newSpeciality.values)
    }

    const updateResult = await this.dao.update( newSpeciality )

    if ( isLeft( updateResult ) ) {
      return left( [updateResult.left] )
    }

    return right( newSpeciality )
  }
}