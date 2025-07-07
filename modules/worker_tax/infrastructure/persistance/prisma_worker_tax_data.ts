import { WorkerTaxDAO }        from "@/modules/worker_tax/domain/worker_tax_dao"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import { PrismaClient }        from "@/lib/generated/prisma"
import { WorkerTax }           from "@/modules/worker_tax/domain/worker_tax"
import { Either, left, right } from "fp-ts/Either"
import {
  UUID
}                              from "@/modules/shared/domain/value_objects/uuid"
import {
  InfrastructureException
}                              from "@/modules/shared/domain/exceptions/infrastructure_exception"
import {
  Errors
}                              from "@/modules/shared/domain/exceptions/errors"

export class PrismaWorkerTaxData implements WorkerTaxDAO {

  constructor( private readonly db: PrismaClient ) {
  }

  async getByWorker( workerId: UUID ): Promise<Either<BaseException[], WorkerTax[]>> {
    try {
      const response = await this.db.workerTax.findMany( {
        where: {
          workerId: workerId.toString()
        }
      } )

      const result: WorkerTax[] = []
      for ( const element of response ) {
        const mapped = WorkerTax.fromPrimitives(
          element.id,
          element.workerId,
          element.name,
          element.value,
          element.valueFormat,
          element.createdAt
        )

        if ( mapped instanceof Errors ) {
          return left( mapped.values )
        }

        result.push( mapped )
      }

      return right( result )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }

  async upsert( workerId: UUID,
    tax: WorkerTax[] ): Promise<Either<BaseException, boolean>> {
    try {
      this.db.$transaction( [
        this.db.workerTax.deleteMany( {
          where: {
            workerId: workerId.toString()
          }
        } ),
        this.db.workerTax.createMany( {
          data: tax.map( ( t ) => (
            {
              id         : t.id.toString(),
              workerId   : workerId.toString(),
              name       : t.name.value,
              value      : t.value.value,
              valueFormat: t.valueFormat.value,
              createdAt  : t.createdAt.toString()
            }
          ) )
        } )
      ] )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

}