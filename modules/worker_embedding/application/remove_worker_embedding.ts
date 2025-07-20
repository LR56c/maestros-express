import {
  WorkerEmbeddingRepository
}                                      from "@/modules/worker_embedding/domain/worker_embedding_repository"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  UUID
}                                      from "@/modules/shared/domain/value_objects/uuid"
import { wrapType }                    from "@/modules/shared/utils/wrap_type"

export class RemoveWorkerEmbedding {
  constructor( private readonly repo: WorkerEmbeddingRepository ) {
  }

  async execute( ids: string[] ): Promise<Either<BaseException[], boolean>> {

    const validIds: UUID[] = []

    for ( const id of ids ) {
      const uuid = wrapType( () => UUID.from( id ) )

      if ( uuid instanceof BaseException ) {
        return left( [uuid] )
      }

      validIds.push( uuid )
    }

    const result = await this.repo.remove( validIds )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }
    return right( true )
  }
}