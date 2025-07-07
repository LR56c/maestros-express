import { WorkerTaxDAO }                from "@/modules/worker_tax/domain/worker_tax_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  WorkerTaxDTO
}                                      from "@/modules/worker_tax/application/worker_tax_dto"
import {
  WorkerTax
}                                      from "@/modules/worker_tax/domain/worker_tax"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"
import {
  GetByWorkerTax
}                                      from "@/modules/worker_tax/application/get_by_worker_tax"
import { wrapType }                    from "@/modules/shared/utils/wrap_type"
import {
  UUID
}                                      from "@/modules/shared/domain/value_objects/uuid"

export class UpsertWorkerTax {
  constructor(
    private readonly dao: WorkerTaxDAO,
    private readonly getTaxes: GetByWorkerTax
  )
  {
  }

  private async ensureWorkerTaxes( workerId: string,
    tax: WorkerTaxDTO[] ): Promise<Either<BaseException[], WorkerTax[]>> {

    const exist = await this.getTaxes.execute( workerId )

    if ( isLeft( exist ) ) {
      return left( exist.left )
    }

    const existMap = new Map<string, WorkerTax>(
      exist.right.map( t => [t.id.toString(), t] ) )

    const taxes: WorkerTax[] = []

    for ( const t of tax ) {
      const taxExist = existMap.get( t.id )
      if ( taxExist ) {
        const updatedTax = WorkerTax.fromPrimitives(
          t.id, workerId, t.name, t.value, t.value_format,
          taxExist.createdAt.toString()
        )

        if ( updatedTax instanceof Errors ) {
          return left( updatedTax.values )
        }
        taxes.push( updatedTax )
      }
      else {
        const newTax = WorkerTax.create( t.id, workerId, t.name, t.value,
          t.value_format )

        if ( newTax instanceof Errors ) {
          return left( newTax.values )
        }
        taxes.push( newTax )
      }
    }
    return right( taxes )
  }

  async execute( workerId: string,
    tax: WorkerTaxDTO[] ): Promise<Either<BaseException[], WorkerTax[]>> {

    const wId = wrapType( () => UUID.from( workerId ) )

    if ( wId instanceof BaseException ) {
      return left( [wId] )
    }

    const updatedTaxes = await this.ensureWorkerTaxes( workerId, tax )

    if ( isLeft( updatedTaxes ) ) {
      return left( updatedTaxes.left )
    }

    const result = await this.dao.upsert( wId, updatedTaxes.right )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( updatedTaxes.right )
  }
}