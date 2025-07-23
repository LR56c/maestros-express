import { z } from "zod"
import {
  InvalidWorkerEmbeddingTypeException
}            from "@/modules/worker_embedding/domain/exception/invalid_worker_embedding_type_exception"

export enum WorkerEmbeddingTypeEnum {
  STORY = "STORY",
  WORKER = "WORKER"
}

export class WorkerEmbeddingType {

  readonly value: WorkerEmbeddingTypeEnum

  private constructor( value: WorkerEmbeddingTypeEnum ) {
    this.value = value
  }

  static create( value: WorkerEmbeddingTypeEnum ): WorkerEmbeddingType {
    return new WorkerEmbeddingType( value )
  }

  static from( value: string ): WorkerEmbeddingType {
    const result = z.nativeEnum( WorkerEmbeddingTypeEnum )
                    .safeParse( value )
    if ( !result.success ) {
      throw new InvalidWorkerEmbeddingTypeException()
    }
    return new WorkerEmbeddingType( result.data )
  }

  static fromOrNull( value: string ): WorkerEmbeddingType | undefined {
    try {
      return WorkerEmbeddingType.from( value )
    }
    catch {
      return undefined
    }
  }
}
