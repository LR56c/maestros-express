import { SupabaseClient }      from "@supabase/supabase-js"
import { Either, left, right } from "fp-ts/Either"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import {
  InfrastructureException
}                              from "@/modules/shared/domain/exceptions/infrastructure_exception"
import {
  ValidString
}                              from "@/modules/shared/domain/value_objects/valid_string"
import {
  Email
}                              from "@/modules/shared/domain/value_objects/email"
import { Password }            from "@/modules/user/domain/password"
import { User, UserAuth }      from "@/modules/user/domain/user"
import { AuthRepository }      from "@/modules/user/domain/auth_repository"
import {
  Errors
}                              from "@/modules/shared/domain/exceptions/errors"


export class SupabaseAdminUserData implements AuthRepository {
  constructor( private readonly client: SupabaseClient ) {
  }

  async anonymous(): Promise<Either<BaseException[], User>> {
    return left( [new InfrastructureException()] )
  }


  async remove( id: ValidString ): Promise<Either<BaseException, boolean>> {
    const { data, error } = await this.client.auth.admin.deleteUser( id.value )
    if ( error ) {
      return left( new InfrastructureException( error.message ) )
    }
    return right( true )
  }

  async login( email: Email,
    password: Password ): Promise<Either<BaseException[], User>> {
    return left( [new InfrastructureException()] )
  }

  async logout( token: ValidString ): Promise<Either<BaseException, boolean>> {
    return left( new InfrastructureException() )
  }

  async register( auth: User,
    password: Password ): Promise<Either<BaseException[], User>> {
    const { data, error } = await this.client.auth.admin.createUser( {
      email        : auth.email.value,
      password     : password.value,
      email_confirm: true,
      user_metadata: {
        name  : auth.fullName.value,
        role  : auth.role.toString(),
        status: auth.status.value,
      }
    } )
    if ( error ) {
      return left( [new InfrastructureException( error.message )] )
    }
    const metadata = data.user!.user_metadata

    const user = UserAuth.fromPrimitives(
      data.user!.id,
      data.user!.email!,
      metadata.name,
      data.user!.created_at,
      metadata.role,
      metadata.status,
      metadata.avatar
    )
    if ( user instanceof Errors ) {
      return left( user.values )
    }
    return right( user )
  }

  async update( auth: User ): Promise<Either<BaseException[], boolean>> {
    const { data, error } = await this.client.auth.admin.updateUserById(
      auth.userId.toString(), {
        app_metadata: {
          // ...auth.metadata
          "extra": "custom"
        }
      } )
    if ( error ) {
      return left( [new InfrastructureException( error.message )] )
    }
    return right( true )
  }

  async getByEmail( email: Email ): Promise<Either<BaseException[], User>> {
    return left( [new InfrastructureException()] )
  }
}