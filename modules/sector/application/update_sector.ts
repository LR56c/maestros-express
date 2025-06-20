import { SectorDAO } from "@/modules/sector/domain/sector_dao"
import { Sector } from "@/modules/sector/domain/sector"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
} from "@/modules/shared/domain/exceptions/base_exception"
import { SectorDTO } from "@/modules/sector/application/sector_dto"
import { ensureRegionExist } from "@/modules/region/utils/ensure_region_exist"
import { Region } from "@/modules/region/domain/region"
import {
  Errors
} from "@/modules/shared/domain/exceptions/errors"
import { ensureSectorExist } from "@/modules/sector/utils/ensure_sector_exist"

export class UpdateSector {
  constructor(private  readonly dao : SectorDAO) {
  }

  async execute( sector: SectorDTO ): Promise<Either<BaseException[], boolean>>{
    const exist = await ensureSectorExist(this.dao, sector.id)

    if ( isLeft(exist) ) {
      return left(exist.left)
    }

    const updatedRegion = Sector.fromPrimitives(
      sector.id,
      sector.name,
      exist.right.region,
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