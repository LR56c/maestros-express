import { WorkerDAO }                   from "@/modules/worker/domain/worker_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import { ensureWorkerExist } from "@/modules/worker/utils/ensure_worker_exist"
import { Worker }     from "@/modules/worker/domain/worker"
import {
  NationalIdentity
}                     from "@/modules/national_identity/domain/national_identity"
import {
  SearchCountry
}                               from "@/modules/country/application/search_country"
import { Errors }               from "@/modules/shared/domain/exceptions/errors"
import { WorkerRequest } from "@/modules/worker/application/worker_request"
import { containError } from "@/modules/shared/utils/contain_error"
import {
  DataNotFoundException
} from "@/modules/shared/domain/exceptions/data_not_found_exception"
import {
  RegisterUser
}                               from "@/modules/user/application/auth_use_cases/register_user"

export class AddWorker {
  constructor(
    private readonly dao: WorkerDAO,
    private readonly searchCountry: SearchCountry,
    private readonly register: RegisterUser,

  ) {
  }

  async execute( worker: WorkerRequest ): Promise<Either<BaseException[], Worker>>{
    const exist = await ensureWorkerExist(this.dao, worker.user.email)

    if ( isLeft( exist ) ) {
      if ( !containError( exist.left, new DataNotFoundException() ) ) {
        return left( exist.left )
      }
    }

    const userResult = await this.register.execute(worker.user)

    if ( isLeft(userResult) ) {
      return left(userResult.left)
    }

    const countryResult = await this.searchCountry.execute({
      id: worker.national_identity.country.id
    }, 1)

    if ( isLeft(countryResult) ) {
      return left(countryResult.left)
    }


    const nationalIdentity = NationalIdentity.create(
      worker.national_identity.id,
      worker.national_identity.identifier,
      worker.national_identity.type,
      countryResult.right[0],
    )

    if ( nationalIdentity instanceof Errors ) {
      return left(nationalIdentity.values)
    }

    const newWorker = Worker.create(
      userResult.right,
      nationalIdentity,
      worker.birth_date,
      worker.location,
      worker.status,
      worker.description,
    )

    if ( newWorker instanceof Errors ) {
      return left(newWorker.values)
    }

    const result = await this.dao.add(newWorker)

    if ( isLeft(result) ) {
      return left([result.left])
    }

    return right(newWorker)
  }
}