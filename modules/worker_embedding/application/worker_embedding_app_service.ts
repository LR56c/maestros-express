import {
  WorkerEmbeddingDTO
} from "@/modules/worker_embedding/application/worker_embedding_dto"


export abstract class WorkerEmbeddingAppService {
  abstract add( embed : WorkerEmbeddingDTO ): Promise<void>

  abstract remove( id: string ): Promise<void>

  abstract search( query: string ): Promise<WorkerEmbeddingDTO[]>
}
