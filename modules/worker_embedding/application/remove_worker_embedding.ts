import {
  WorkerEmbeddingRepository
}                                      from "@/modules/worker_embedding/domain/worker_embedding_repository"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  ensureWorkerEmbeddingExist
}                                      from "@/modules/worker_embedding/utils/ensure_worker_embedding_exist"

export class RemoveWorkerEmbedding {
  constructor( private readonly repo: WorkerEmbeddingRepository ) {
  }

  async execute( id: string ): Promise<Either<BaseException[], boolean>> {
    const exist = await ensureWorkerEmbeddingExist( this.repo, id )

    if ( isLeft( exist ) ) {
      return left( exist.left )
    }

    const result = await this.repo.remove( exist.right.id )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }
    return right( true )
  }
}