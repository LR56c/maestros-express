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
  PackageDAO
}                                      from "@/modules/package/domain/package_dao"
import { Package }                     from "@/modules/package/domain/package"

export const ensurePackageExist = async ( dao: PackageDAO,
  countryId: string ): Promise<Either<BaseException[], Package>> => {

  const packageFound = await dao.search({
    id: countryId
  }, ValidInteger.from(1))

  if ( isLeft(packageFound) ) {
    return left(packageFound.left)
  }

  if ( packageFound.right.length > 0 && packageFound.right[0]!.id.value !== countryId ) {
    return left( [new DataNotFoundException()] )
  }

  return right(packageFound.right[0])
}