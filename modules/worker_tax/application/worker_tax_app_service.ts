import { WorkerTaxDTO } from "@/modules/worker_tax/application/worker_tax_dto"

export abstract class WorkerTaxAppService {
  abstract upsert( tax : WorkerTaxDTO ): Promise<void>
  abstract getByWorker( workerId: string ): Promise<WorkerTaxDTO[]>
}
