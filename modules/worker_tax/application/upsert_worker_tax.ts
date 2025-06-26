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
import { wrapType }                    from "@/modules/shared/utils/wrap_type"
import {
  UUID
}                                      from "@/modules/shared/domain/value_objects/uuid"
import {
  containError
}                                      from "@/modules/shared/utils/contain_error"
import {
  DataNotFoundException
}                                      from "@/modules/shared/domain/exceptions/data_not_found_exception"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"

export class UpsertWorkerTax {
  constructor( private readonly dao: WorkerTaxDAO ) {
  }

  private async ensureWorkerTaxExist( id: string ): Promise<Either<BaseException[], WorkerTax>> {

    const vId = wrapType( () => UUID.from( id ) )

    if ( vId instanceof BaseException ) {
      return left( [vId] )
    }

    return await this.dao.getById( vId )
  }

  async execute( workerId: string,
    tax: WorkerTaxDTO ): Promise<Either<BaseException[], WorkerTax>> {

    const existResult = await this.ensureWorkerTaxExist( tax.id )

    let workerTax: WorkerTax
    if ( isLeft( existResult ) ) {
      const notFound = containError( existResult.left,
        new DataNotFoundException() )
      if ( !notFound ) {
        return left( existResult.left )
      }
      const newTax = WorkerTax.create( tax.id, workerId, tax.name, tax.value,
        tax.value_format )

      if ( newTax instanceof Errors ) {
        return left( newTax.values )
      }

      workerTax = newTax
    }
    else {
      const updateTax = WorkerTax.fromPrimitives(
        tax.id,
        workerId,
        tax.name,
        tax.value,
        tax.value_format,
        existResult.right.createdAt.toString()
      )

      if ( updateTax instanceof Errors ) {
        return left( updateTax.values )
      }
      workerTax = updateTax
    }
    const result = await this.dao.upsert( workerTax )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( workerTax )
  }
}