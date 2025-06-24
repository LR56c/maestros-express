import { CountryDAO } from "@/modules/country/domain/country_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
} from "@/modules/shared/domain/exceptions/base_exception"
import { Country } from "@/modules/country/domain/country"
import {
  ValidInteger
} from "@/modules/shared/domain/value_objects/valid_integer"
import {
  DataNotFoundException
} from "@/modules/shared/domain/exceptions/data_not_found_exception"
import { WorkerDAO }                   from "@/modules/worker/domain/worker_dao"
import { Worker } from "@/modules/worker/domain/worker"

export const ensureWorkerExist = async ( dao: WorkerDAO,
  workerId: string ): Promise<Either<BaseException[], Worker>> => {

  const worker = await dao.search({
    id: workerId
  }, ValidInteger.from(1))

  if ( isLeft(worker) ) {
    return left(worker.left)
  }

  if ( worker.right.length > 0 && worker.right[0]!.user.userId.value !== workerId ) {
    return left( [new DataNotFoundException()] )
  }

  return right(worker.right[0])
}