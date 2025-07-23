import { Either }        from "fp-ts/Either"
import {
  BaseException
}                        from "@/modules/shared/domain/exceptions/base_exception"
import {
  ValidString
}                        from "@/modules/shared/domain/value_objects/valid_string"
import {
  ValidImage
}                        from "@/modules/shared/domain/value_objects/valid_image"
import { UploadRequest } from "@/modules/worker_embedding/domain/upload_request"

export type InteractionResponse = {
  infoText ?: string
  processInput ?: string
}

export abstract class WorkerEmbeddingAI {
  abstract generateText( rawContent : ValidString ): Promise<Either<BaseException, number[]>>
  abstract processImage( image : ValidImage, systemInput : ValidString,  userInput ?: ValidString ): Promise<Either<BaseException[], UploadRequest>>
  abstract generateInfo( userInput : ValidString, systemInput : ValidString ): Promise<Either<BaseException[], UploadRequest>>
}
