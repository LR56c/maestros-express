import { PrismaClient } from "@/lib/generated/prisma"
import {
  WorkerEmbeddingRepository
}                       from "@/modules/worker_embedding/domain/worker_embedding_repository"

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
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"
import {
  DataNotFoundException
}                                      from "@/modules/shared/domain/exceptions/data_not_found_exception"
import {
  Position
}                                      from "@/modules/shared/domain/value_objects/position"

export class PrismaWorkerEmbeddingData
  implements WorkerEmbeddingRepository {
  constructor(
    private readonly db: PrismaClient,
    private readonly ai: WorkerEmbeddingAI,
  )
  {
  }

  async getById( embedId: UUID ): Promise<Either<BaseException[], WorkerEmbedding>> {
    try {
      const embed = await this.db.workerEmbedding.findUnique( {
        where  : {
          id: embedId.toString()
        },
        include: {
          worker: true
        }
      } )
      if ( !embed ) {
        return left( [new DataNotFoundException()] )
      }

      const workerEmbed = WorkerEmbedding.fromPrimitives(
        embed.id,
        embed.workerId,
        embed.content,
        embed.worker.location,
        embed.type,
        embed.createdAt
      )

      if ( workerEmbed instanceof Errors ) {
        return left( workerEmbed.values )
      }
      return right( workerEmbed )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }

  async upsert( embed: WorkerEmbedding ): Promise<Either<BaseException, boolean>> {
    try {
      const embedding = await this.ai.generateText( embed.content )
      if ( isLeft( embedding ) ) {
        return left( embedding.left )
      }

      const longitude = embed.location.value.longitude
      const latitude  = embed.location.value.latitude

      await this.db.$executeRaw`INSERT INTO worker_embedding (id, type, content, embedding, created_at, worker_id, location)
                                VALUES (${ embed.id.toString() }::uuid,
                                        ${ embed.type.value.toLowerCase() }
                                        ::"WorkerEmbeddingType",
                                        ${ embed.content.value }::text,
                                        ${ embedding.right }::vector,
                                        ${ embed.createdAt.toString() }
                                        ::timestamp,
                                        ${ embed.workerId.toString() }::uuid,
                                        ST_SetSRID(ST_MakePoint(${ longitude }, ${ latitude }), 4326)::geography)`
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

  async search( rawContent: ValidString, targetLocation: Position,
    radius: ValidInteger,
    limit?: ValidInteger ): Promise<Either<BaseException[], WorkerEmbedding[]>> {
    return left( [new InfrastructureException()] )

  }
}