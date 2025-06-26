import { Prisma, PrismaClient }        from "@/lib/generated/prisma"
import {
  WorkerEmbeddingRepository
}                                      from "@/modules/worker_embedding/domain/worker_embedding_repository"
import {
  WorkerEmbedding
}                                      from "@/modules/worker_embedding/domain/worker_embedding"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  UUID
}                                      from "@/modules/shared/domain/value_objects/uuid"
import {
  ValidInteger
}                                      from "@/modules/shared/domain/value_objects/valid_integer"
import {
  ValidString
}                                      from "@/modules/shared/domain/value_objects/valid_string"
import {
  InfrastructureException
}                                      from "@/modules/shared/domain/exceptions/infrastructure_exception"
import {
  WorkerEmbeddingAI
}                                      from "@/modules/worker_embedding/domain/worker_embedding_ai"
import * as changeCase                 from "change-case"
import { Country }                     from "@/modules/country/domain/country"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"

export class PrismaWorkerEmbeddingData implements WorkerEmbeddingRepository {
  constructor(
    private readonly db: PrismaClient,
    private readonly ai: WorkerEmbeddingAI
  )
  {
  }

  async add( embed: WorkerEmbedding ): Promise<Either<BaseException, boolean>> {
    try {
      const embedding = await this.ai.generate( embed )

      if ( isLeft( embedding ) ) {
        return left( embedding.left )
      }

      await this.db.$executeRaw`INSERT INTO worker_embedding (${ embed.id.toString() }, ${ embed.type.value }, ${ embed.content.value }, ${ embedding.right }, ${ embed.createdAt.toString() })`
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async remove( id: UUID ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.workerEmbedding.delete( {
        where: {
          id: id.toString()
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async search( query: Record<string, any>, limit?: ValidInteger,
    skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[], WorkerEmbedding[]>> {
    // try {
    //   const where = {}
    //   if ( query.id ) {
    //     // @ts-ignore
    //     where["id"] = {
    //       equals: query.id
    //     }
    //   }
    //   const orderBy = {}
    //   if ( sortBy ) {
    //     const key    = changeCase.camelCase( sortBy.value )
    //     // @ts-ignore
    //     orderBy[key] = sortType ? sortType.value : "desc"
    //   }
    //   const offset               = skip ? parseInt( skip.value ) : 0
    //   const response             = await this.db.worker.findMany( {
    //     where  : where,
    //     orderBy: orderBy,
    //     skip   : offset,
    //     take   : limit?.value
    //   } )
    //   const countries: Country[] = []
    //   for ( const country of response ) {
    //     const mapped = Country.fromPrimitives(
    //       country.id.toString(),
    //       country.name,
    //       country.code,
    //       country.createdAt
    //     )
    //     if ( mapped instanceof Errors ) {
    //       return left( mapped.values )
    //     }
    //     countries.push( mapped )
    //   }
    //   return right( countries )
    // }
    // catch ( e ) {
    //   return left( [new InfrastructureException()] )
    // }
      return left( [new InfrastructureException()] )
  }
}