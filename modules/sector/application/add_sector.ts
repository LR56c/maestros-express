import { SectorDAO }                   from "@/modules/sector/domain/sector_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  SectorDTO
}                                      from "@/modules/sector/application/sector_dto"
import {
  containError
}                                      from "@/modules/shared/utils/contain_error"
import {
  DataNotFoundException
}                                      from "@/modules/shared/domain/exceptions/data_not_found_exception"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"
import {
  ensureSectorExist
}                                      from "@/modules/sector/utils/ensure_sector_exist"
import {
  SearchRegion
}                                      from "@/modules/region/application/search_region"
import { Sector }                      from "@/modules/sector/domain/sector"

export class AddSector {
  constructor(
    private  readonly dao : SectorDAO,
    private  readonly searchRegion : SearchRegion,
  ) {
  }

  async execute( dto: SectorDTO ): Promise<Either<BaseException[], Sector>>{
    const exist = await ensureSectorExist( this.dao, dto.id )

    if ( isLeft( exist ) ) {
      if ( !containError( exist.left, new DataNotFoundException() ) ) {
        return left( exist.left )
      }
    }

    const region = await this.searchRegion.execute( { id: dto.region.id }, 1 )

    if ( isLeft( region ) ) {
      return left( region.left )
    }

    const sector = Sector.create(
      dto.id,
      dto.name,
      region.right.items[0]!
    )

    if ( sector instanceof Errors ) {
      return left( sector.values )
    }

    const result =  await this.dao.add( sector )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right(sector)
  }
}