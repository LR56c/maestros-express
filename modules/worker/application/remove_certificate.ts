import { CertificateDAO }              from "@/modules/certificate/domain/certificate_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  ensureCertificateExist
}                                      from "@/modules/certificate/utils/ensure_certificate_exist"
import { WorkerDAO }                   from "@/modules/worker/domain/worker_dao"
import {
  RemoveUser
}                                      from "@/modules/user/application/auth_use_cases/remove_user"
import {
  ensureWorkerExist
}                                      from "@/modules/worker/utils/ensure_worker_exist"
import {
  ValidInteger
}                                      from "@/modules/shared/domain/value_objects/valid_integer"

export class RemoveWorker {
  constructor(
    private readonly dao : WorkerDAO,
    private readonly removeUser : RemoveUser,
  ) {}

  async execute( id: string ): Promise<Either<BaseException[], boolean>>{
    const exist = await this.dao.search({
      id: id
    }, ValidInteger.from(1))

    if ( isLeft(exist) ) {
      return left(exist.left)
    }

    const worker = exist.right[0]

    const removeUser = await this.removeUser.execute(worker.user.userId.value)

    if ( isLeft(removeUser) ) {
      return left([removeUser.left])
    }

    const result = await this.dao.remove(worker.user.userId)
    if ( isLeft(result) ) {
      return left([result.left])
    }

    return right(true)
  }

}