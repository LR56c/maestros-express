import {
  WorkerScheduleDTO
} from "@/modules/worker_schedule/application/worker_schedule_dto"

export abstract class WorkerScheduleAppService{
  abstract search( query: string ): Promise<WorkerScheduleDTO[]>
  abstract add( schedule: WorkerScheduleDTO ): Promise<void>
  abstract update( schedule: WorkerScheduleDTO ): Promise<void>
  abstract remove( id: string ): Promise<void>
}
