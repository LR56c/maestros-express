import { RegionDAO }                   from "@/modules/region/domain/region_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  ValidInteger
}                                      from "@/modules/shared/domain/value_objects/valid_integer"
import { Region }                      from "@/modules/region/domain/region"
import {
  DataNotFoundException
}                                      from "@/modules/shared/domain/exceptions/data_not_found_exception"

export const ensureRegionExist = async ( dao: RegionDAO,
  regionId: string ): Promise<Either<BaseException[], Region>> => {

  const region = await dao.search( {
    id: regionId
  }, ValidInteger.from( 1 ) )

  if ( isLeft( region ) ) {
    return left( region.left )
  }

  if ( region.right.items.length > 0 && region.right.items[0]!.id.value !== regionId ) {
    return left( [new DataNotFoundException()] )
  }

  return right( region.right.items[0] )
}