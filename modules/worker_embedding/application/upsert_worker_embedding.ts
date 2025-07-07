import {
  WorkerEmbeddingRepository
} from "@/modules/worker_embedding/domain/worker_embedding_repository"
import {
  Either,
  isLeft,
  left,
  right
} from "fp-ts/Either"
import {
  BaseException
} from "@/modules/shared/domain/exceptions/base_exception"
import {
  containError
} from "@/modules/shared/utils/contain_error"
import {
  DataNotFoundException
} from "@/modules/shared/domain/exceptions/data_not_found_exception"
import {
  ensureWorkerEmbeddingExist
} from "@/modules/worker_embedding/utils/ensure_worker_embedding_exist"
import {
  WorkerEmbedding
} from "@/modules/worker_embedding/domain/worker_embedding"
import {
  SearchWorker
} from "@/modules/worker/application/search_worker"
import {
  GetStoryById
} from "@/modules/story/application/get_story_by_id"
import {
  Errors
} from "@/modules/shared/domain/exceptions/errors"
import {
  InfrastructureException
} from "@/modules/shared/domain/exceptions/infrastructure_exception"
import {
  StoryEmbedRequest,
  WorkerEmbeddingRequest,
  WorkerEmbedRequest
} from "@/modules/worker_embedding/application/worker_embedding_request"
import {
  WorkerEmbeddingTypeEnum
} from "@/modules/worker_embedding/domain/worker_embedding_type"

type DataType = {
  content: string
  workerId: string
}

export class UpsertWorkerEmbedding {
  constructor(
    private readonly repo: WorkerEmbeddingRepository,
    private readonly searchWorker: SearchWorker,
    private readonly getStory: GetStoryById
  )
  {
  }

  private workerPrompt( dto: WorkerEmbedRequest ): string {
    return `Trabajador de especialidades: ${ dto.specialities.map(
      e => e.name ) }\nSe describe: ${ dto.description }\nSus tarifas son: ${ dto.taxes.map(
      e => `(${ e.name }:${ e.value } ${ e.value_format })` ).join( "," ) }`
  }

  private storyPrompt( dto: StoryEmbedRequest ): string {
    return `Historia: ${ dto.name }\nTrata sobre: ${ dto.description }`
  }

  private async recoverData( dto: WorkerEmbeddingRequest ): Promise<Either<BaseException[], DataType>> {
    let workerId: string
    let content: string
    if ( dto.data.type === WorkerEmbeddingTypeEnum.WORKER ) {
      const workerResult = await this.searchWorker.execute( {
        id: dto.data.user.user_id
      }, 1 )
      if ( isLeft( workerResult ) ) {
        return left( workerResult.left )
      }
      workerId = workerResult.right[0].user_id
      content  = this.workerPrompt( dto.data )
    }
    else if ( dto.data.type === WorkerEmbeddingTypeEnum.STORY ) {
      const storyResult = await this.getStory.execute( dto.data.id )

      if ( isLeft( storyResult ) ) {
        return left( storyResult.left )
      }
      workerId = storyResult.right.workerId.toString()
      content  = this.storyPrompt( dto.data )
    }
    else {
      return left( [new InfrastructureException( `Invalid data type` )] )
    }
    return right( {
      content,
      workerId
    } )
  }

  private async create( dto: WorkerEmbeddingRequest ): Promise<Either<BaseException[], WorkerEmbedding>> {
    const dataResult = await this.recoverData( dto )

    if ( isLeft( dataResult ) ) {
      return left( dataResult.left )
    }

    const newEmbed = WorkerEmbedding.create(
      dto.id,
      dataResult.right.workerId,
      dataResult.right.content,
      dto.location,
      dto.data.type,
    )

    if ( newEmbed instanceof Errors ) {
      return left( newEmbed.values )
    }

    return right( newEmbed )
  }

  private async update( dto: WorkerEmbeddingRequest,
    existEmbed: WorkerEmbedding ): Promise<Either<BaseException[], WorkerEmbedding>> {
    const dataResult = await this.recoverData( dto )

    if ( isLeft( dataResult ) ) {
      return left( dataResult.left )
    }

    const updatedEmbed = WorkerEmbedding.fromPrimitives(
      existEmbed.id.toString(),
      dataResult.right.workerId,
      dataResult.right.content,
      dto.location,
      dto.data.type,
      existEmbed.createdAt.toString()
    )

    if ( updatedEmbed instanceof Errors ) {
      return left( updatedEmbed.values )
    }

    return right( updatedEmbed )
  }

  async execute( dto: WorkerEmbeddingRequest ): Promise<Either<BaseException[], WorkerEmbedding>> {
    const existResult = await ensureWorkerEmbeddingExist( this.repo, dto.id )

    let embed: WorkerEmbedding
    if ( isLeft( existResult ) ) {
      if ( !containError( existResult.left, new DataNotFoundException() ) ) {
        return left( existResult.left )
      }
      const createResult = await this.create( dto )
      if ( isLeft( createResult ) ) {
        return left( createResult.left )
      }

      embed = createResult.right
    }
    else {
      const updateResult = await this.update( dto, existResult.right )

      if ( isLeft( updateResult ) ) {
        return left( updateResult.left )
      }

      embed = updateResult.right
    }
    const result = await this.repo.upsert( embed )
    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( embed )
  }
}