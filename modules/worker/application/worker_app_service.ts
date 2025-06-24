import { WorkerResponse } from "@/modules/worker/application/worker_response"

export abstract class WorkerAppService {
  abstract search( query: string ): Promise< WorkerResponse[]>

  abstract add( worker: WorkerResponse ): Promise<void>

  abstract update( worker: WorkerResponse ): Promise<void>

  abstract draft( worker: WorkerResponse ): Promise<void>
}
