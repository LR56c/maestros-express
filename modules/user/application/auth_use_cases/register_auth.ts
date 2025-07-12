import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  UUID
}                                      from "@/modules/shared/domain/value_objects/uuid"
import { wrapType }                    from "@/modules/shared/utils/wrap_type"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"
import {
  AuthRepository
}                                      from "@/modules/user/domain/auth_repository"
import { Password }                    from "@/modules/user/domain/password"
import {
  UserRegisterRequest
}                                      from "@/modules/user/application/models/user_register_request"
import { UserAuth }                    from "@/modules/user/domain/user"
import { RoleLevelType }               from "@/modules/user/domain/role_type"
import {
  AddUser
}                                      from "@/modules/user/application/user_use_cases/add_user"
import {
  UserMapper
}                                      from "@/modules/user/application/user_mapper"
import {
  WorkerStatusEnum
}                                      from "@/modules/worker/domain/worker_status"

export class RegisterAuth {
  constructor(
    private readonly repo: AuthRepository,
  )
  {
  }


  async execute( dto: UserRegisterRequest,
    role: RoleLevelType,
    status: string = WorkerStatusEnum.VERIFIED ): Promise<Either<BaseException[], UserAuth>> {

    const password = wrapType( () => Password.from( dto.password ) )

    if ( password instanceof BaseException ) {
      return left( [password] )
    }

    const user = UserAuth.create(
      UUID.create().value,
      dto.email,
      dto.full_name,
      role,
      status,
      dto.avatar ? dto.avatar : null
    )

    if ( user instanceof Errors ) {
      return left( user.values )
    }

    const resultAuth = await this.repo.register( user, password )

    if ( isLeft( resultAuth ) ) {
      return left( resultAuth.left )
    }

    return right( resultAuth.right )
  }
}