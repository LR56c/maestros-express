import { AuthRepository } from "@/modules/user/domain/auth_repository"
import type { Either } from "fp-ts/Either"
import type {
  BaseException
} from "@/modules/shared/domain/exceptions/base_exception"
import { UserAuth } from "@/modules/user/domain/user"

export class LoginAnonymous {
  constructor( private readonly repo: AuthRepository ) {
  }

  async execute(): Promise<Either<BaseException[], UserAuth>>{
    return this.repo.anonymous()
  }
}