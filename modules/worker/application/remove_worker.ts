import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import { WorkerDAO }                   from "@/modules/worker/domain/worker_dao"
import {
  RemoveAuth
}                                      from "@/modules/user/application/auth_use_cases/remove_auth"
import {
  ValidInteger
}                                      from "@/modules/shared/domain/value_objects/valid_integer"

export class RemoveWorker {
  constructor(
    private readonly dao: WorkerDAO,
    private readonly removeUser: RemoveAuth
  )
  {
  }

  async execute( id: string ): Promise<Either<BaseException[], boolean>> {
    const exist = await this.dao.search( {
      id: id
    }, ValidInteger.from( 1 ) )

    if ( isLeft( exist ) ) {
      return left( exist.left )
    }

    const worker = exist.right[0]

    const removeUser = await this.removeUser.execute(
      worker.user.userId.toString() )

    if ( isLeft( removeUser ) ) {
      return left( [removeUser.left] )
    }

    const result = await this.dao.remove( worker.user.userId )
    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }

}