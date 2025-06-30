import {
  WorkerEmbeddingRepository
}                                      from "@/modules/worker_embedding/domain/worker_embedding_repository"
import {
  WorkerEmbeddingAI
}                                      from "@/modules/worker_embedding/domain/worker_embedding_ai"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  WorkerRequestInteractionDTO
}                                      from "@/modules/worker_embedding/application/worker_embedding_request_interaction_dto"
import { wrapTypeDefault }             from "@/modules/shared/utils/wrap_type"
import {
  ValidImage
}                                      from "@/modules/shared/domain/value_objects/valid_image"
import {
  ValidString
}                                      from "@/modules/shared/domain/value_objects/valid_string"

export class UploadRequestWorkerEmbedding {
  constructor(
    private readonly repo: WorkerEmbeddingRepository,
    private readonly ai: WorkerEmbeddingAI
  )
  {
  }

  async execute( base64Image ?: string,
    input ?: string ): Promise<Either<BaseException[], WorkerRequestInteractionDTO>> {

    const errors = []

    const vImage = await wrapTypeDefault( undefined,
      async ( value ) => await ValidImage.from( value ), base64Image )

    if ( vImage instanceof BaseException ) {
      errors.push( vImage )
    }

    const vInput = wrapTypeDefault( undefined,
      ( value ) => ValidString.from( value ), input )

    if ( vInput instanceof BaseException ) {
      errors.push( vInput )
    }

    if ( errors.length > 0 ) {
      return left( errors )
    }

    if ( vImage !== undefined ) {
      const imageSystemPrompt  = ""
      const processInputResult = await this.ai.processImage(
        vImage as ValidImage, ValidString.from( imageSystemPrompt ),
        vInput as ValidString | undefined )

      if ( isLeft( processInputResult ) ) {
        return left( [processInputResult.left] )
      }

      return right( {
          info_text    : processInputResult.right.infoText ?? "",
          process_input: processInputResult.right.processInput ?? ""
        }
      )
    }

    const textSystemPrompt = ""
    const infoInputResult  = await this.ai.generateInfo( vInput as ValidString,
      ValidString.from( textSystemPrompt ) )

    if ( isLeft( infoInputResult ) ) {
      return left( [infoInputResult.left] )
    }

    return right( {
        info_text    : infoInputResult.right.infoText ?? "",
        process_input: infoInputResult.right.processInput ?? ""
      }
    )
  }
}