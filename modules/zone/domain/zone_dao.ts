import type { Either } from "fp-ts/Either"
import {
  BaseException
}                      from "@/modules/shared/domain/exceptions/base_exception"
import { Zone }        from "@/modules/zone/domain/zone"
import { UUID }        from "@/modules/shared/domain/value_objects/uuid"

export abstract class ZoneDAO {
  abstract removeBulk( ids: UUID[] ): Promise<Either<BaseException, boolean>>
  abstract addBulk( workerId: UUID,
    zones: Zone[] ): Promise<Either<BaseException, boolean>>

  abstract getByWorker( workerId: UUID ): Promise<Either<BaseException[], Zone[]>>
}