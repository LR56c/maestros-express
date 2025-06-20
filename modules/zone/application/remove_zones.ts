import { ZoneDAO }      from "@/modules/zone/domain/zone_dao"
import { UUID }         from "@/modules/shared/domain/value_objects/uuid"
import { Either, left } from "fp-ts/Either"
import {
  BaseException
}                       from "@/modules/shared/domain/exceptions/base_exception"
import { wrapType }     from "@/modules/shared/utils/wrap_type"

export class RemoveZones {
  constructor( private readonly dao: ZoneDAO ) {
  }

  async execute( ids: string[] ): Promise<Either<BaseException, boolean>> {
    const uuidArray: UUID[] = []
    for ( const id of ids ) {
      const uuid = wrapType( () => UUID.from( id ) )
      if ( uuid instanceof BaseException ) {
        return left( uuid )
      }
      uuidArray.push( uuid )
    }
    return await this.dao.removeBulk( uuidArray )
  }
}