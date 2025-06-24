import { z } from "zod"
import {
  InvalidWorkerStatusException
}            from "@/modules/worker/domain/exception/invalid_worker_status_exception"

export enum WorkerStatusEnum {
  INCOMPLETE = "INCOMPLETE",
  PENDING    = "PENDING",
  VERIFIED   = "VERIFIED",
}

export class WorkerStatus {

  readonly value: WorkerStatusEnum

  private constructor( value: WorkerStatusEnum ) {
    this.value = value
  }

  static create( value: WorkerStatusEnum ): WorkerStatus {
    return new WorkerStatus( value )
  }

  static from( value: string ): WorkerStatus {
    const result = z.nativeEnum( WorkerStatusEnum )
                    .safeParse( value )
    if ( !result.success ) {
      throw new InvalidWorkerStatusException()
    }
    return new WorkerStatus( result.data )
  }

  static fromOrNull( value: string ): WorkerStatus | undefined {
    try {
      return WorkerStatus.from( value )
    }
    catch {
      return undefined
    }
  }
}
