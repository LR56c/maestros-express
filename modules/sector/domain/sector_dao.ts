import { Sector }       from "./sector"
import { ValidString }  from "../../shared/domain/value_objects/valid_string"
import { ValidInteger } from "../../shared/domain/value_objects/valid_integer"
import { type Either }  from "fp-ts/Either"
import {
  BaseException
}                       from "@/modules/shared/domain/exceptions/base_exception"
import { Country }      from "@/modules/country/domain/country"
import { UUID }         from "@/modules/shared/domain/value_objects/uuid"

export abstract class SectorDAO {
  abstract search( query: Record<string, any>, limit?: ValidInteger,
    skip ?: ValidString, sortBy ?: ValidString,
    sortType ?: ValidString ): Promise<Either<BaseException[], Sector[]>>
  abstract add( sector: Sector ): Promise<Either<BaseException, boolean>>
  abstract update( sector: Sector ): Promise<Either<BaseException, boolean>>
  abstract remove( id: UUID ): Promise<Either<BaseException, boolean>>
}
