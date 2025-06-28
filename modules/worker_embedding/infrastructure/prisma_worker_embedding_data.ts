import { PrismaClient } from "@/lib/generated/prisma"
import {
  WorkerEmbeddingRepository
}                       from "@/modules/worker_embedding/domain/worker_embedding_repository"

import * as changeCase from "change-case"

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
import { Worker }                      from "@/modules/worker/domain/worker"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"
import {
  mapWorkerRelations
}                                      from "@/modules/worker/infrastructure/prisma_worker_data"
import {
  DataNotFoundException
}                                      from "@/modules/shared/domain/exceptions/data_not_found_exception"
import { wrapType }                    from "@/modules/shared/utils/wrap_type"

export class PrismaWorkerEmbeddingData implements WorkerEmbeddingRepository {
  constructor(
    private readonly db: PrismaClient,
    private readonly ai: WorkerEmbeddingAI
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
          worker: {
            include: {
              user            : {
                include: {
                  usersRoles: {
                    include: {
                      role: true
                    }
                  }
                }
              },
              nationalIdentity: {
                include: {
                  country: true
                }
              },
              WorkerSpeciality: {
                include: {
                  speciality: true
                }
              },
              WorkerTax       : true
            }
          }
        }
      } )
      if ( !embed ) {
        return left( [new DataNotFoundException()] )
      }

      const workerEmbed = WorkerEmbedding.fromPrimitives(
        embed.id,
        embed.workerId,
        embed.content,
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
      const embedding = await this.ai.generate( embed.content )
      if ( isLeft( embedding ) ) {
        return left( embedding.left )
      }

      await this.db.$executeRaw`INSERT INTO worker_embedding (id, type, content, embedding, created_at, worker_id)
                                VALUES (${ embed.id.toString() }::uuid,
                                        ${ embed.type.value.toLowerCase() }
                                        ::"WorkerEmbeddingType",
                                        ${ embed.content.value }::text,
                                        ${ embedding.right }::vector,
                                        ${ embed.createdAt.toString() }
                                        ::timestamp,
                                        ${ embed.workerId.toString() }::uuid)`
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
    sortType?: ValidString ): Promise<Either<BaseException[], Worker[]>> {
    try {
      const vInput = wrapType( () => ValidString.from( query.input ) )

      if ( vInput instanceof BaseException ) {
        return left( [vInput] )
      }

      const vectorSearch = await this.ai.search( vInput, limit )
      if ( isLeft( vectorSearch ) ) {
        return left( vectorSearch.left )
      }

      const workersIds = vectorSearch.right.map( e => e.workerId.toString() )

      const where    = {}
      const idsCount = workersIds.length
      // @ts-ignore
      where["id"]    = {
        in: workersIds
      }
      const orderBy  = {}
      if ( sortBy ) {
        const key    = changeCase.camelCase( sortBy.value )
        // @ts-ignore
        orderBy[key] = sortType ? sortType.value : "desc"
      }
      const response = await this.db.worker.findMany( {
        where  : where,
        orderBy: orderBy,
        include: {
          user            : {
            include: {
              usersRoles: {
                include: {
                  role: true
                }
              }
            }
          },
          nationalIdentity: {
            include: {
              country: true
            }
          },
          WorkerSpeciality: {
            include: {
              speciality: true
            }
          },
          WorkerTax       : true
        }
      } )
      if ( idsCount && response.length !== idsCount ) {
        return left( [new InfrastructureException( "Not all workers found" )] )
      }

      const workers: Worker[] = []
      for ( const w of response ) {
        const relationMapped = await mapWorkerRelations( w )
        if ( isLeft( relationMapped ) ) {
          return left( relationMapped.left )
        }

        const mapped = Worker.fromPrimitives(
          relationMapped.right.user,
          relationMapped.right.nationalIdentity,
          w.birthDate,
          w.reviewCount,
          w.reviewAverage,
          w.location,
          w.status,
          relationMapped.right.specialities,
          relationMapped.right.taxes,
          w.createdAt,
          w.verifiedAt ? w.verifiedAt : undefined,
          w.description ? w.description : undefined
        )
        if ( mapped instanceof Errors ) {
          return left( mapped.values )
        }
        workers.push( mapped )
      }
      return right( workers )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }
}