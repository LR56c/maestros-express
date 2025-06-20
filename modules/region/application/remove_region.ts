import { RegionDAO }                   from "@/modules/region/domain/region_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import { ensureRegionExist } from "@/modules/region/utils/ensure_region_exist"

export class RemoveRegion {
  constructor(
    private readonly dao: RegionDAO,
  ) {
  }

  async execute( id: string ): Promise<Either<BaseException[], boolean>>{
    const exist = await ensureRegionExist(this.dao, id)

    if ( isLeft( exist ) ) {
      return left( exist.left )
    }

    const result = await this.dao.remove( exist.right.id )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }
}