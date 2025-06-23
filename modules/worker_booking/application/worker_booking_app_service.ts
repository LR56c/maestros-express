import {
  WorkerBookingDTO
} from "@/modules/worker_booking/application/worker_booking_dto"

export abstract class WorkerBookingAppService {
  abstract search( query:string): Promise<WorkerBookingDTO[]>

  abstract request( book: WorkerBookingDTO ): Promise<void>

  abstract update( book: WorkerBookingDTO ): Promise<void>

  abstract cancel( id: string ): Promise<void>
}