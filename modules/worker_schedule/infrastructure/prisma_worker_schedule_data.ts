import {
  WorkerScheduleDAO
}                       from "@/modules/worker_schedule/domain/worker_schedule_dao"
import { PrismaClient } from "@/lib/generated/prisma"
import {
  BaseException
}                       from "@/modules/shared/domain/exceptions/base_exception"
import { undefined }    from "zod"
import {
  ValidInteger
}                       from "@/modules/shared/domain/value_objects/valid_integer"
import {
  ValidString
}                       from "@/modules/shared/domain/value_objects/valid_string"
import {
  WorkerSchedule
}                              from "@/modules/worker_schedule/domain/worker_schedule"
import { Either, left, right } from "fp-ts/Either"
import {
  UUID
}                              from "@/modules/shared/domain/value_objects/uuid"
import {
  InfrastructureException
}                       from "@/modules/shared/domain/exceptions/infrastructure_exception"
import * as changeCase  from "change-case"
import { Country }      from "@/modules/country/domain/country"
import { Errors }       from "@/modules/shared/domain/exceptions/errors"

export class PrismaWorkerScheduleData implements WorkerScheduleDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  async add( schedule: WorkerSchedule ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.workerSchedule.create( {
        data: {
          id                : schedule.id.toString(),
          workerId          : schedule.workerId.toString(),
          weekDay           : schedule.weekDay.value,
          status            : schedule.status.value,
          startTime         : schedule.startDate.toString(),
          endTime           : schedule.endDate.toString(),
          recurrentStartTime: schedule.recurrentStartDate?.toString(),
          recurrentEndTime  : schedule.recurrentEndDate?.toString(),
          createdAt         : schedule.createdAt.toString()
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async remove( id: UUID ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.workerSchedule.delete( {
        where: {
          id: id.toString()
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async search( query: Record<string, any>, limit?: ValidInteger,
    skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[], WorkerSchedule[]>> {
    try {
      const where = {}
      if ( query.id ) {
        // @ts-ignore
        where["id"] = {
          equals: query.id
        }
      }
      const orderBy = {}
      if ( sortBy ) {
        const key    = changeCase.camelCase( sortBy.value )
        // @ts-ignore
        orderBy[key] = sortType ? sortType.value : "desc"
      }
      const offset               = skip ? parseInt( skip.value ) : 0
      const response             = await this.db.workerSchedule.findMany( {
        where  : where,
        orderBy: orderBy,
        skip   : offset,
        take   : limit?.value
      } )
      const schedule: WorkerSchedule[] = []
      for ( const s of response ) {
        const mapped = WorkerSchedule.fromPrimitives(
          s.id.toString(),
          s.workerId.toString(),
          s.weekDay,
          s.status,
          s.startTime,
          s.endTime,
          s.createdAt,
          s.recurrentStartTime,
          s.recurrentEndTime,
        )
        if ( mapped instanceof Errors ) {
          return left( mapped.values )
        }
        schedule.push( mapped )
      }
      return right( schedule )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }

  async update( schedule: WorkerSchedule ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.workerSchedule.update( {
        where: {
          id: schedule.id.toString()
        },
        data : {
          weekDay           : schedule.weekDay.value,
          status            : schedule.status.value,
          startTime         : schedule.startDate.toString(),
          endTime           : schedule.endDate.toString(),
          recurrentStartTime: schedule.recurrentStartDate?.toString(),
          recurrentEndTime  : schedule.recurrentEndDate?.toString(),
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

}