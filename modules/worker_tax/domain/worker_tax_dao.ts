import { UUID }        from "@/modules/shared/domain/value_objects/uuid"
import type { Either } from "fp-ts/Either"
import {
  BaseException
}                      from "@/modules/shared/domain/exceptions/base_exception"
import { WorkerTax }   from "@/modules/worker_tax/domain/worker_tax"

export abstract class WorkerTaxDAO {
  abstract upsert( workerId: UUID, tax : WorkerTax[] ): Promise<Either<BaseException, boolean>>
  abstract getByWorker( workerId: UUID ): Promise<Either<BaseException[], WorkerTax[]>>
}