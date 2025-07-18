import { WorkerDAO }                   from "@/modules/worker/domain/worker_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  ensureWorkerExist
}                                      from "@/modules/worker/utils/ensure_worker_exist"
import { Worker }                      from "@/modules/worker/domain/worker"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"
import {
  WorkerRequest
}                                      from "@/modules/worker/application/worker_request"
import {
  containError
}                                      from "@/modules/shared/utils/contain_error"
import {
  DataNotFoundException
}                                      from "@/modules/shared/domain/exceptions/data_not_found_exception"
import {
  RegisterAuth
}                                      from "@/modules/user/application/auth_use_cases/register_auth"
import {
  SearchNationalIdentityFormat
}                                      from "@/modules/national_identity_format/application/search_national_identity_format"
import {
  WorkerStatusEnum
}                                      from "@/modules/worker/domain/worker_status"
import { RoleLevelType }               from "@/modules/user/domain/role_type"

export class AddWorker {
  constructor(
    private readonly dao: WorkerDAO,
    private readonly searchNationalIdentity: SearchNationalIdentityFormat,
    private readonly register: RegisterAuth
  )
  {
  }

  async execute( worker: WorkerRequest ): Promise<Either<BaseException[], Worker>> {
    const exist = await ensureWorkerExist( this.dao, worker.user.email )

    if ( isLeft( exist ) ) {
      if ( !containError( exist.left, new DataNotFoundException() ) ) {
        return left( exist.left )
      }
    }

    const nationalIdentityResult = await this.searchNationalIdentity.execute( {
      id: worker.national_identity_id
    }, 1 )

    if ( isLeft( nationalIdentityResult ) ) {
      return left( nationalIdentityResult.left )
    }

    const nationalIdentity = nationalIdentityResult.right.items[0]

    const status = WorkerStatusEnum.INCOMPLETE

    const userResult = await this.register.execute( worker.user,
      RoleLevelType.WORKER, status )
    if ( isLeft( userResult ) ) {
      return left( userResult.left )
    }


    const newWorker = Worker.create(
      userResult.right,
      nationalIdentity.id.toString(),
      worker.national_identity_value,
      worker.birth_date,
      `(${ worker.location.latitude },${ worker.location.longitude })`,
      status,
      worker.description
    )

    if ( newWorker instanceof Errors ) {
      return left( newWorker.values )
    }

    const result = await this.dao.add( newWorker )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( newWorker )
  }
}