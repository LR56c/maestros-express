import { AuthRepository }      from "@/modules/auth/domain/auth_repository"
import { Either, left, right } from "fp-ts/Either"
import {
  InfrastructureException
}                              from "@/modules/shared/domain/exceptions/infrastructure_exception"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import {
  ResetPassword
}                              from "@/modules/auth/domain/reset_password_method"
import {
  UUID
}                              from "@/modules/shared/domain/value_objects/uuid"
import { Password }            from "@/modules/auth/domain/password"
import {
  Email
}                              from "@/modules/shared/domain/value_objects/email"
import { Auth }                from "@/modules/auth/domain/auth"
import {
  ValidString
}                              from "@/modules/shared/domain/value_objects/valid_string"
import { AuthMethod }          from "@/modules/auth/domain/auth_method"
import { auth }                from "@/lib/auth"
import {
  Errors
}                              from "@/modules/shared/domain/exceptions/errors"

export class BetterAuthData implements AuthRepository {
  async confirmResetPassword( userId: UUID, method: ResetPassword,
    data?: string ): Promise<Either<BaseException, boolean>> {
    return left( new InfrastructureException() )
  }

  async getByEmail( email: Email ): Promise<Either<BaseException[], Auth>> {
    return left( [new InfrastructureException()] )
  }

  async login( email: Email,
    password: Password ): Promise<Either<BaseException[], Auth>> {
    return left( [new InfrastructureException()] )
  }

  async logout( token: ValidString ): Promise<Either<BaseException, boolean>> {
    return left( new InfrastructureException() )
  }

  async register( authData: Auth,
    password: Password ): Promise<Either<BaseException[], Auth>> {
    try {

      const result = await auth.api.signUpEmail( {
        body: {
          email   : authData.email.value,
          password: password.value,
          name: ""
        }
      } )

      const { id, createdAt, updatedAt } = result.user
      const authCreated                  = Auth.fromPrimitives(
        id,
        authData.email.value,
        {},
        authData.authMethod.value,
        createdAt,
        updatedAt,
      )

      if ( authCreated instanceof Errors ) {
        return left( authCreated.values )
      }
      return right( authCreated )

    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }

  async remove( id: UUID ): Promise<Either<BaseException, boolean>> {
    return left( new InfrastructureException() )
  }

  async requestResetPassword( method: ResetPassword,
    data?: string ): Promise<Either<BaseException, boolean>> {
    return left( new InfrastructureException() )
  }

  async revalidate( token: ValidString ): Promise<Either<BaseException[], Auth>> {
    return left( [new InfrastructureException()] )
  }

  async singinOauth( token: ValidString,
    method: AuthMethod ): Promise<Either<BaseException[], Auth>> {
    return left( [new InfrastructureException()] )
  }

  async update( auth: Auth ): Promise<Either<BaseException[], Auth>> {
    return left( [new InfrastructureException()] )
  }

}