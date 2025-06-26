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

export class UpdateSpeciality {
  constructor( private readonly dao: SpecialityDAO ) {
  }


  async execute( prevName: string, newName :string ): Promise<Either<BaseException[], Speciality>>{
    const existResult = await ensureSpecialityExist(this.dao, prevName )

    if ( isLeft(existResult) ) {
      return left( existResult.left )
    }

    const newSpeciality = Speciality.fromPrimitives(
      existResult.right.id.toString(),
      newName,
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