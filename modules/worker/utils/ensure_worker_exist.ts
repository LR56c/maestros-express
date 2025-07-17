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
import { WorkerDAO }                   from "@/modules/worker/domain/worker_dao"
import { Worker }                      from "@/modules/worker/domain/worker"

export const ensureWorkerExist = async ( dao: WorkerDAO,
  email: string ): Promise<Either<BaseException[], Worker>> => {

  const worker = await dao.search({
    email: email
  }, ValidInteger.from(1))

  if ( isLeft(worker) ) {
    return left(worker.left)
  }

  if ( worker.right.items.length > 0 && worker.right.items[0]!.user.email.value !== email ) {
    return left( [new DataNotFoundException()] )
  }

  return right(worker.right.items[0])
}