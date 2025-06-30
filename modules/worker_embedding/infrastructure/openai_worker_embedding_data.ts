import {
  InteractionResponse,
  WorkerEmbeddingAI
}                              from "@/modules/worker_embedding/domain/worker_embedding_ai"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import { Either, left, right } from "fp-ts/Either"
import {
  InfrastructureException
}                              from "@/modules/shared/domain/exceptions/infrastructure_exception"
import OpenAI                  from "openai"
import {
  ValidString
}                              from "@/modules/shared/domain/value_objects/valid_string"
import {
  ValidImage
}                              from "@/modules/shared/domain/value_objects/valid_image"

export class OpenaiWorkerEmbeddingData implements WorkerEmbeddingAI {
  constructor(
    private readonly ai: OpenAI
  )
  {
  }

  async generateText( rawContent: ValidString ): Promise<Either<BaseException, number[]>> {
    try {
      const generateEmbedding = await this.ai.embeddings.create( {
        model: "text-embedding-3-small",
        input: rawContent.value
      } )
      return right( generateEmbedding.data[0].embedding )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async generateInfo( userInput: ValidString,
    systemInput: ValidString ): Promise<Either<BaseException, InteractionResponse>> {
    try {
      const response = await this.ai.responses.create( {
        model       : "gpt-4.1-mini",
        instructions: systemInput.value,
        input       : userInput.value
      } )

      const parseResponse = JSON.parse( response.output_text )
      const infoText      = parseResponse.info_text || ""
      const processInput  = parseResponse.process_input || ""
      return right( {
        infoText,
        processInput
      } )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async processImage( image: ValidImage, systemInput: ValidString,
    userInput?: ValidString ): Promise<Either<BaseException, InteractionResponse>> {
    try {
      const response = await this.ai.responses.create( {
        model       : "gpt-4.1-mini",
        instructions: systemInput.value,
        input       : [
          {
            role   : "user",
            content: [
              { type: "input_text", text: userInput?.value ?? "" },
              {
                type     : "input_image",
                image_url: `data:${ image.format };base64,${ image.value }`,
                detail: "high"
              }
            ]
          }
        ]
      } )

      const parseResponse = JSON.parse( response.output_text )
      const infoText      = parseResponse.info_text ?? ""
      const processInput  = parseResponse.process_input ?? ""
      return right( {
        infoText,
        processInput
      } )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }


}