import { RegionDAO }                   from "@/modules/region/domain/region_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  RegionDTO
}                                      from "@/modules/region/application/region_dto"
import {
  ensureRegionExist
}                                      from "@/modules/region/utils/ensure_region_exist"
import {
  containError
}                                      from "@/modules/shared/utils/contain_error"
import {
  DataNotFoundException
}                                      from "@/modules/shared/domain/exceptions/data_not_found_exception"
import { Region }                      from "@/modules/region/domain/region"
import {
  SearchCountry
}                                      from "@/modules/country/application/search_country"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"

export class AddRegion {
  constructor(
    private readonly dao: RegionDAO,
    private readonly searchCountry: SearchCountry
  )
  {
  }

  async execute( dto: RegionDTO ): Promise<Either<BaseException[], Region>> {
    const exist = await ensureRegionExist( this.dao, dto.id )

    if ( isLeft( exist ) ) {
      if ( !containError( exist.left, new DataNotFoundException() ) ) {
        return left( exist.left )
      }
    }

    const country = await this.searchCountry.execute( { id: dto.country.id }, 1 )

    if ( isLeft( country ) ) {
      return left( country.left )
    }

    const region = Region.create(
      dto.id,
      dto.name,
      country.right.items[0]!
    )

    if ( region instanceof Errors ) {
      return left( region.values )
    }

    const result =  await this.dao.add( region )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right(region)
  }
}