import { PrismaClient }        from "@/lib/generated/prisma"
import { WorkerDAO }           from "@/modules/worker/domain/worker_dao"
import { Either, left, right } from "fp-ts/Either"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import {
  ValidString
}                              from "@/modules/shared/domain/value_objects/valid_string"
import {
  ValidInteger
}                              from "@/modules/shared/domain/value_objects/valid_integer"
import * as changeCase         from "change-case"
import {
  InfrastructureException
}                              from "@/modules/shared/domain/exceptions/infrastructure_exception"
import { Worker }              from "@/modules/worker/domain/worker"

export class PrismaWorkerData implements WorkerDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  async add( worker: Worker ): Promise<Either<BaseException, boolean>> {
    try {
      console.log( "Adding worker:", worker.user )
      await this.db.$transaction( [
        this.db.nationalIdentity.create( {
          data: {
            id        : worker.nationalIdentity.id.toString(),
            identifier: worker.nationalIdentity.identifier.value,
            type      : worker.nationalIdentity.type.value,
            countryId : worker.nationalIdentity.country.id.toString()
          }
        } ),
        this.db.worker.create( {
          data: {
            id                : worker.user.userId.toString(),
            birthDate         : worker.birthDate.toString(),
            description       : worker.description.value,
            reviewCount       : worker.reviewCount.value,
            reviewAverage     : worker.reviewAverage.value,
            status            : worker.status.value,
            location          : worker.location.value,
            nationalIdentityId: worker.nationalIdentity.id.toString()
          }
        } )
      ] )
      return right( true )
    }
    catch ( e ) {
      console.log( "Error adding worker:", e )
      return left( new InfrastructureException() )
    }
  }

  async search( query: Record<string, any>, limit?: ValidInteger,
    skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[], Worker[]>> {
    try {
      const where = {}
      if ( query.id ) {
        // @ts-ignore
        where["id"] = {
          equals: query.id
        }
      }
      const orderBy = {}
      if ( sortBy ) {
        const key    = changeCase.camelCase( sortBy.value )
        // @ts-ignore
        orderBy[key] = sortType ? sortType.value : "desc"
      }
      const offset   = skip ? parseInt( skip.value ) : 0
      const response = await this.db.worker.findMany( {
        where  : where,
        orderBy: orderBy,
        skip   : offset,
        take   : limit?.value
        // include: {
        //   Zone            : true,
        //   WorkerEmbedding : true,
        //   WorkerSpeciality: true,
        //   WorkerBooking   : true,
        //   WorkerSchedule  : true,
        //   WorkerTax       : true,
        //   Story           : true,
        //   Package         : true,
        //   Certificate     : true
        // }
      } )
      console.log( "Worker search response:", response )
      const workers: Worker[] = []
      // for ( const w of response ) {
      //
      //   const mapped = Worker.fromPrimitives(
      //   )
      //   if ( mapped instanceof Errors ) {
      //     return left( mapped.values )
      //   }
      //   workers.push( mapped )
      // }
      return right( workers )
    }
    catch ( e ) {
      console.log( "Error searching workers:", e )
      return left( [new InfrastructureException()] )
    }
  }

  async update( worker: Worker ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.worker.update( {
        where: {
          id: worker.user.userId.toString()
        },
        data : {
          description  : worker.description.value,
          reviewCount  : worker.reviewCount.value,
          reviewAverage: worker.reviewAverage.value,
          status       : worker.status.value,
          location     : worker.location.value
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }
}
