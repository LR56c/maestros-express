import { z } from "zod"
import {
  InvalidWorkerScheduleStatusException
}            from "@/modules/worker_schedule/domain/exception/invalid_worker_schedule_status_exception"

export enum WorkerScheduleStatusEnum {
  ACTIVE    = "ACTIVE",
  INACTIVE    = "INACTIVE"
}

export class WorkerScheduleStatus {

  readonly value: WorkerScheduleStatusEnum

  private constructor( value: WorkerScheduleStatusEnum ) {
    this.value = value
  }

  static create( value: WorkerScheduleStatusEnum ): WorkerScheduleStatus {
    return new WorkerScheduleStatus( value )
  }

  static from( value: string ): WorkerScheduleStatus {
    const result = z.nativeEnum( WorkerScheduleStatusEnum )
                    .safeParse( value )
    if ( !result.success ) {
      throw new InvalidWorkerScheduleStatusException()
    }
    return new WorkerScheduleStatus( result.data )
  }

  static fromOrNull( value: string ): WorkerScheduleStatus | undefined {
    try {
      return WorkerScheduleStatus.from( value )
    }
    catch {
      return undefined
    }
  }
}
