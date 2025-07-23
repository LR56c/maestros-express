import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  ValidInteger
}                                      from "@/modules/shared/domain/value_objects/valid_integer"
import {
  DataNotFoundException
}                                      from "@/modules/shared/domain/exceptions/data_not_found_exception"
import {
  WorkerScheduleDAO
}                                      from "@/modules/worker_schedule/domain/worker_schedule_dao"
import {
  WorkerSchedule
}                                      from "@/modules/worker_schedule/domain/worker_schedule"

export const ensureWorkerScheduleExist = async ( dao: WorkerScheduleDAO,
  countryId: string ): Promise<Either<BaseException[], WorkerSchedule>> => {

  const schedule = await dao.search({
    id: countryId
  }, ValidInteger.from(1))

  if ( isLeft(schedule) ) {
    return left(schedule.left)
  }

  if ( schedule.right.length > 0 && schedule.right[0]!.id.value !== countryId ) {
    return left( [new DataNotFoundException()] )
  }

  return right(schedule.right[0])
}