import { type Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  DataAlreadyExistException
}                                      from "@/modules/shared/domain/exceptions/data_already_exist_exception"
import {
  ValidInteger
}                                      from "@/modules/shared/domain/value_objects/valid_integer"
import {
  SpecialityDAO
}                                      from "@/modules/speciality/domain/speciality_dao"
import {
  Speciality
}                                      from "@/modules/speciality/domain/speciality"
import {
  DataNotFoundException
}                                      from "@/modules/shared/domain/exceptions/data_not_found_exception"

export const ensureSpecialityExist = async ( dao: SpecialityDAO,
  name: string ): Promise<Either<BaseException[], Speciality>> => {
  const existResult = await dao.search( { name: name }, ValidInteger.from( 1 ) )

  if ( isLeft( existResult ) ) {
    return left( existResult.left )
  }

  if ( existResult.right.items.length > 0 && existResult.right.items[0]!.name.value !==
    name )
  {
    return left( [new DataNotFoundException()] )
  }

  return right( existResult.right.items[0]! )
}
