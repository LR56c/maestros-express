import { ZoneDAO } from "@/modules/zone/domain/zone_dao"
import { UUID } from "@/modules/shared/domain/value_objects/uuid"
import { Zone }                        from "@/modules/zone/domain/zone"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import { ZoneDTO } from "@/modules/zone/application/zone_dto"
import { wrapType } from "@/modules/shared/utils/wrap_type"
import { ZoneMapper } from "@/modules/zone/application/zone_mapper"
import { Errors } from "@/modules/shared/domain/exceptions/errors"

export class AddZones {
  constructor( private readonly dao: ZoneDAO ) {
  }

  async addBulk( workerId: string,
    zones: ZoneDTO[] ): Promise<Either<BaseException[], boolean>>{
    const vWorkerId = wrapType(()=> UUID.from( workerId ))

    if ( vWorkerId instanceof BaseException ) {
      return left( [vWorkerId] )
    }

    const validZones : Zone[] = []

    for ( const zone of zones ) {
      const validZone = ZoneMapper.toDomain( zone )
      if ( validZone instanceof Errors ) {
        return left( validZone.values )
      }
      validZones.push( validZone )
    }

    const result = await this.dao.addBulk(
      vWorkerId as UUID,
      validZones as Zone[]
    )

    if ( isLeft(result) ) {
      return left( [result.left] )
    }

    return right( true )
  }
}