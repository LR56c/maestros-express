import { type Provider, SupabaseClient } from "@supabase/supabase-js"
import {
  BaseException
}                                        from "@/modules/shared/domain/exceptions/base_exception"
import {
  InfrastructureException
}                                        from "@/modules/shared/domain/exceptions/infrastructure_exception"
import {
  ResetPassword,
  ResetPasswordTypeEnum
}                                        from "@/modules/auth/domain/reset_password_method"
import * as process                      from "node:process"
import {
  ResetProviderNotMatch
}                                        from "@/modules/shared/domain/exceptions/reset_provider_not_match"
import {
  AuthRepository
}                                        from "@/modules/auth/domain/auth_repository"
import {
  UUID
}                                      from "@/modules/shared/domain/value_objects/uuid"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  Email
}                                      from "@/modules/shared/domain/value_objects/email"
import {
  Password
}                                        from "@/modules/auth/domain/password"
import {
  Auth
}                                        from "@/modules/auth/domain/auth"
import {
  Errors
}                                        from "@/modules/shared/domain/exceptions/errors"
import {
  ValidString
}                                        from "@/modules/shared/domain/value_objects/valid_string"
import {
  AuthMethod
}                          from "@/modules/auth/domain/auth_method"

function checkSupabaseProvider( value: string ): value is Provider {
  return value === "google"
}

export class SupabaseAuthData implements AuthRepository {
  constructor( private readonly client: SupabaseClient ) {
  }

  async remove( id: UUID ): Promise<Either<BaseException, boolean>> {
    const { data, error } = await this.client.auth.admin.deleteUser( id.value )

    if ( error ) {
      return left( new InfrastructureException( error.message ) )
    }
    return right( true )
  }

  async login( email: Email,
    password: Password ): Promise<Either<BaseException[], Auth>> {
    const { data, error } = await this.client.auth.signInWithPassword(
      { email: email.value, password: password.value } )
    if ( error ) {
      return left([new InfrastructureException( error.message )])
    }
    const auth = Auth.fromPrimitives(
      data.user.id,
      data.user.email!,
      data.user.app_metadata,
      data.user.app_metadata.provider!.toUpperCase(),
      data.user.created_at,
      data.user.updated_at,
    )

    if ( auth instanceof Errors ) {
      return left( auth.values )
    }
    return right( auth )
  }

  async logout( token: ValidString ): Promise<Either<BaseException, boolean>> {

    const { error } = await this.client.auth.admin.signOut( token.value )
    if ( error ) {
      return left( new InfrastructureException( error.message ) )
    }
    return right( true )
  }

  async register( auth: Auth,
    password: Password ): Promise<Either<BaseException[], Auth>> {
    const { data, error } = await this.client.auth.signUp( {
      email   : auth.email.value,
      password: password.value
    } )
    if ( error ) {
      return left( [new InfrastructureException( error.message )] )
    }

    const supabaseMetadata = {
      ...data.user!.app_metadata,
      ...auth.metadata
    }
    const authData = Auth.fromPrimitives(
      data.user!.id,
      data.user!.email!,
      supabaseMetadata,
      data.user!.app_metadata.provider!.toUpperCase(),
      data.user!.created_at,
      data.user!.updated_at,
    )

    if ( authData instanceof Errors ) {
      return left( authData.values )
    }

    const updateResult = await this.update(authData)
    if ( isLeft(updateResult) ){
      return left(updateResult.left)
    }

    return right( updateResult.right )
  }

  async requestResetPassword( method: ResetPassword,
    inputData ?: string ): Promise<Either<BaseException, boolean>> {
    if ( method.value !== ResetPasswordTypeEnum.EMAIL && !inputData ) {
      return left( new InfrastructureException() )
    }

    const { data: eData, error: eError } = await this.client.rpc(
      "get_user_id_by_email",
      {
        email: inputData!
      }
    )

    if ( eError ) {
      return left( new InfrastructureException( eError.message ) )
    }
    const emailEntry    = eData[0]
    const emailProvider = emailEntry.raw_app_meta_data.provider

    if ( emailProvider.toUpperCase() !== ResetPasswordTypeEnum.EMAIL ) {
      return left( new ResetProviderNotMatch() )
    }

    const { data, error } = await this.client.auth.resetPasswordForEmail(
      inputData!, {
        redirectTo: process.env.RESET_REDIRECT_URL!
      } )
    if ( error ) {
      return left( new InfrastructureException( error.message ) )
    }

    return right(true)
  }

  async revalidate( token: ValidString ): Promise<Either<BaseException[], Auth>> {

    const { data, error } = await this.client.auth.refreshSession( {
      refresh_token: token.value
    } )
    if ( error ) {
      return left( [new InfrastructureException( error.message )] )
    }
    const auth = Auth.fromPrimitives(
      data.user!.id,
      data.user!.email!,
      data.user!.app_metadata,
      data.user!.app_metadata.provider!.toUpperCase(),
      data.user!.created_at,
      data.user!.updated_at,
    )

    if ( auth instanceof Errors ) {
      return left( auth.values )
    }

    return right( auth )
  }

  async singinOauth( token: ValidString,
    method: AuthMethod ): Promise<Either<BaseException[], Auth>> {
    let provider = method.value.toLowerCase()
    if ( !checkSupabaseProvider( provider ) ) {
      return left( [new InfrastructureException()] )
    }
    const { data, error } = await this.client.auth.signInWithIdToken( {
      provider,
      token: token.value
    } )
    if ( error ) {
      return left( [new InfrastructureException( error.message )] )
    }
    const auth = Auth.fromPrimitives(
      data.user!.id,
      data.user!.email!,
      data.user!.app_metadata,
      data.user!.app_metadata.provider!.toUpperCase(),
      data.user!.created_at,
      data.user!.updated_at,
    )

    if ( auth instanceof Errors ) {
      return left( auth.values )
    }

    return right( auth )
  }

  async confirmResetPassword( userId: UUID, method: ResetPassword,
    inputData ?: string ): Promise<Either<BaseException, boolean>> {
    if ( method.value !== ResetPasswordTypeEnum.EMAIL && !inputData ) {
      return left( new InfrastructureException() )
    }

    const { data, error } = await this.client.auth.admin.updateUserById(
      userId.value, {
        password: inputData
      } )

    if ( error ) {
      return left( new InfrastructureException( error.message ) )
    }

    return right( true )
  }

  async update( auth: Auth ): Promise<Either<BaseException[], Auth>> {
    const { data, error } = await this.client.auth.admin.updateUserById(
      auth.userId.value, {
        app_metadata: {
          ...auth.metadata
        }
      } )

    if ( error ) {
      return left( [new InfrastructureException( error.message )] )
    }

    const updatedAuth = Auth.fromPrimitives(
      data.user.id,
      data.user.email!,
      data.user.app_metadata,
      data.user.app_metadata.provider!.toUpperCase(),
      data.user.created_at,
      data.user.updated_at,
    )

    if ( updatedAuth instanceof Errors ) {
      return left( updatedAuth.values )
    }

    return right( updatedAuth )
  }

  async getByEmail( email: Email ): Promise<Either<BaseException[], Auth>> {
    const { data, error } = await this.client.rpc(
      "get_user_id_by_email",
      {
        email: email.value
      }
    )

    const auth = Auth.fromPrimitives(
      data.user.id,
      data.user.email!,
      data.user.app_metadata,
      data.user.app_metadata.provider!.toUpperCase(),
      data.user.created_at,
      data.user.updated_at,
    )

    if ( auth instanceof Errors ) {
      return left( auth.values )
    }

    return right( auth )
  }


}
