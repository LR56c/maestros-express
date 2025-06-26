import {
  WorkerEmbeddingRepository
}                                      from "@/modules/worker_embedding/domain/worker_embedding_repository"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  WorkerEmbeddingDTO
}                                      from "@/modules/worker_embedding/application/worker_embedding_dto"
import {
  containError
}                                      from "@/modules/shared/utils/contain_error"
import {
  DataNotFoundException
}                                      from "@/modules/shared/domain/exceptions/data_not_found_exception"
import {
  ensureWorkerEmbeddingExist
}                                      from "@/modules/worker_embedding/utils/ensure_worker_embedding_exist"
import {
  WorkerEmbedding
}                                      from "@/modules/worker_embedding/domain/worker_embedding"
import {
  SearchWorker
}                                      from "@/modules/worker/application/search_worker"
import {
  GetStoryById
}                                      from "@/modules/story/application/get_story_by_id"
import { Worker }                      from "@/modules/worker/domain/worker"
import { Story }                       from "@/modules/story/domain/story"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"

export class AddWorkerEmbedding {
  constructor(
    private readonly repo: WorkerEmbeddingRepository,
    private readonly searchWorker: SearchWorker,
    private readonly getStory: GetStoryById
  )
  {
  }

  async execute( embed: WorkerEmbeddingDTO ): Promise<Either<BaseException[], boolean>> {
    const existResult = await ensureWorkerEmbeddingExist( this.repo, embed.id )

    if ( isLeft( existResult ) ) {
      if ( !containError( existResult.left, new DataNotFoundException() ) ) {
        return left( existResult.left )
      }
    }

    let data: Worker | Story

    if ( embed.data.type === "WORKER" ) {
      const workerResult = await this.searchWorker.execute( {
        id: embed.data.user.user_id
      }, 1 )

      if ( isLeft( workerResult ) ) {
        return left( workerResult.left )
      }
      data = workerResult.right[0]
    }
    else {
      const storyResult = await this.getStory.execute( embed.data.id )

      if ( isLeft( storyResult ) ) {
        return left( storyResult.left )
      }
      data = storyResult.right
    }
    const content  = ""
    const newEmbed = WorkerEmbedding.create(
      embed.id,
      content,
      embed.data.type,
      data
    )

    if ( newEmbed instanceof Errors ) {
      return left( newEmbed.values )
    }

    const result = await this.repo.add( newEmbed )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }
}