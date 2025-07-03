import { WorkerDAO }                   from "@/modules/worker/domain/worker_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import { ensureWorkerExist } from "@/modules/worker/utils/ensure_worker_exist"
import { Worker }     from "@/modules/worker/domain/worker"
import { SearchUser } from "@/modules/user/backup_application/search_user"
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

export class AddWorker {
  constructor(
    private readonly dao: WorkerDAO,
    private readonly searchUser: SearchUser,
    private readonly searchCountry: SearchCountry,
  ) {
  }

  async execute( worker: WorkerRequest ): Promise<Either<BaseException[], Worker>>{
    const exist = await ensureWorkerExist(this.dao, worker.user.user_id)

    if ( isLeft( exist ) ) {
      if ( !containError( exist.left, new DataNotFoundException() ) ) {
        return left( exist.left )
      }
    }

    const userSearchResult = await this.searchUser.execute({
      id: worker.user.user_id
    },1)

    if ( isLeft(userSearchResult) ) {
      return left(userSearchResult.left)
    }

    const countryResult = await this.searchCountry.execute({
      id: worker.national_identity.country.id
    }, 1)

    if ( isLeft(countryResult) ) {
      return left(countryResult.left)
    }

    const user = userSearchResult.right[0]

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
      user,
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