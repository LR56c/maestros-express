import {
  WorkerEmbeddingResponse
} from "@/modules/worker_embedding/application/worker_embedding_response"
import {
  WorkerEmbeddingRequest
} from "@/modules/worker_embedding/application/worker_embedding_request"


export abstract class WorkerEmbeddingAppService {
  abstract add( embed: WorkerEmbeddingRequest ): Promise<void>

  abstract remove( id: string ): Promise<void>

  abstract search( query: string ): Promise<WorkerEmbeddingResponse[]>
}
