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
import {
  DataNotFoundException
} from "@/modules/shared/domain/exceptions/data_not_found_exception"

export class PrismaWorkerTaxData implements WorkerTaxDAO {

  constructor( private readonly db: PrismaClient ) {
  }

  async getById( id: UUID ): Promise<Either<BaseException[], WorkerTax>> {
    try {
      const response = await this.db.workerTax.findUnique( {
        where: {
          id: id.toString()
        }
      } )

      if ( !response ) {
        return left( [new DataNotFoundException()] )
      }

      const mapped = WorkerTax.fromPrimitives(
        response.id,
        response.workerId,
        response.name,
        response.value,
        response.valueFormat,
        response.createdAt
      )
      if ( mapped instanceof Errors ) {
        return left( mapped.values )
      }

      return right( mapped )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
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

  async upsert( tax: WorkerTax ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.workerTax.upsert( {
        where : {
          id: tax.id.value
        },
        create: {
          id         : tax.id.value,
          workerId   : tax.workerId.value,
          name       : tax.name.value,
          value      : tax.value.value,
          valueFormat: tax.valueFormat.value,
          createdAt  : tax.createdAt.toString()
        },
        update: {
          name       : tax.name.value,
          value      : tax.value.value,
          valueFormat: tax.valueFormat.value
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

}