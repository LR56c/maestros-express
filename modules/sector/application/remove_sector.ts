import { SectorDAO } from "@/modules/sector/domain/sector_dao"
import { UUID }                        from "@/modules/shared/domain/value_objects/uuid"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import { ensureSectorExist } from "@/modules/sector/utils/ensure_sector_exist"

export class RemoveSector {
  constructor(private  readonly dao : SectorDAO) {
  }

  async execute( id: string ): Promise<Either<BaseException[], boolean>>{
    const exist = await ensureSectorExist(this.dao, id)

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