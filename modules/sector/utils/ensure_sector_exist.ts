import { SectorDAO }                   from "@/modules/sector/domain/sector_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import { Sector }                      from "@/modules/sector/domain/sector"
import {
  ValidInteger
}                                      from "@/modules/shared/domain/value_objects/valid_integer"
import {
  DataNotFoundException
}                                      from "@/modules/shared/domain/exceptions/data_not_found_exception"

export const ensureSectorExist = async ( dao: SectorDAO,
  sectorId: string ): Promise<Either<BaseException[], Sector>> => {

  const sector = await dao.search( {
    id: sectorId
  }, ValidInteger.from( 1 ) )

  if ( isLeft( sector ) ) {
    return left( sector.left )
  }

  if ( sector.right.items.length > 0 && sector.right.items[0]!.id.value !== sectorId ) {
    return left( [new DataNotFoundException()] )
  }

  return right( sector.right.items[0] )
}