import { RegionDAO }                   from "@/modules/region/domain/region_dao"
import { Region }                      from "@/modules/region/domain/region"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import { RegionDTO }                   from "@/modules/region/application/region_dto"
import {
  ensureCountryExist
}                                      from "@/modules/country/utils/ensure_country_exist"
import { Country }                     from "@/modules/country/domain/country"
import {
  ensureRegionExist
}                                      from "@/modules/region/utils/ensure_region_exist"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"

export class UpdateRegion {
  constructor(
    private readonly dao: RegionDAO,
  ) {
  }

  async execute( region: RegionDTO ): Promise<Either<BaseException[], boolean>>{
    const exist = await ensureRegionExist(this.dao, region.id)

    if ( isLeft(exist) ) {
      return left(exist.left)
    }

    const updatedRegion = Region.fromPrimitives(
      region.id,
      region.name,
      exist.right.country,
      exist.right.createdAt.toString()
    )

    if( updatedRegion instanceof Errors ) {
      return left(updatedRegion.values)
    }

    const result = await this.dao.update(updatedRegion)

    if ( isLeft(result) ) {
      return left([result.left])
    }

    return right(true)


  }

}