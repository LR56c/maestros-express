import { WorkerTaxDAO } from "@/modules/worker_tax/domain/worker_tax_dao"
import { Either, left } from "fp-ts/Either"
import {
  BaseException
}                       from "@/modules/shared/domain/exceptions/base_exception"
import { WorkerTax }    from "@/modules/worker_tax/domain/worker_tax"
import { wrapType }     from "@/modules/shared/utils/wrap_type"
import { UUID }         from "@/modules/shared/domain/value_objects/uuid"

export class GetByWorkerTax {
  constructor( private readonly dao: WorkerTaxDAO ) {
  }

  async execute( workerId: string ): Promise<Either<BaseException[], WorkerTax[]>> {
    const vWorkerId = wrapType( () => UUID.from( workerId ) )

    if ( vWorkerId instanceof BaseException ) {
      return left( [vWorkerId] )
    }

    return await this.dao.getByWorker( vWorkerId )
  }
}