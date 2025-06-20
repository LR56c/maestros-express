import { type Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                           from "@/modules/shared/domain/exceptions/base_exception"
import {
  ZoneDAO
}                                           from "@/modules/zone/domain/zone_dao"
import { Zone }                             from "@/modules/zone/domain/zone"
import {
  UUID
}                                           from "@/modules/shared/domain/value_objects/uuid"
import {
  wrapType
}                                           from "@/modules/shared/utils/wrap_type"

export class GetZonesByWorker {
  constructor( private readonly dao: ZoneDAO ) {
  }

  async execute( workerId: string ): Promise<Either<BaseException[], Zone[]>> {
    const vwid = wrapType(
      () => UUID.from( workerId )
    )

    if ( vwid instanceof BaseException ) {
      return left( [vwid] )
    }

    const result = await this.dao.getByWorker( vwid )

    if ( isLeft( result ) ) {
      return left( result.left )
    }

    return right( result.right )
  }
}
