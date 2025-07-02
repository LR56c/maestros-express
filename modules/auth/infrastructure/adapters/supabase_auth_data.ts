import { type Provider, SupabaseClient } from "@supabase/supabase-js"
import {
  BaseException
}                                        from "@/modules/shared/domain/exceptions/base_exception"
import {
  InfrastructureException
}                                        from "@/modules/shared/domain/exceptions/infrastructure_exception"
import {
  ResetPasswordTypeEnum
}                                        from "@/modules/auth/domain/reset_password_method"
import * as process                      from "node:process"
import {
  ResetProviderNotMatch
}                                        from "@/modules/shared/domain/exceptions/reset_provider_not_match"
import { Either, left, right }           from "fp-ts/Either"
import {
  Email
}                                        from "@/modules/shared/domain/value_objects/email"
import { Auth }                          from "@/modules/auth/domain/auth"
import {
  Errors
}                                        from "@/modules/shared/domain/exceptions/errors"
import {
  AuthAppService
}                                        from "@/modules/auth/application/auth_app_service"
import type {
  AuthLoginRequest
}                                        from "@/modules/auth/application/auth_login_request"
import {
  AuthResponse
}                                        from "@/modules/auth/application/auth_response"
import {
  AuthRegisterRequest
}                                        from "@/modules/auth/application/auth_register_request"
import type {
  AuthResetDTO
}                                        from "@/modules/auth/application/auth_reset_dto"
import type {
  OauthRequest
}                                        from "@/modules/auth/application/oauth_request"
import {
  AuthUpdateDTO
}                                        from "@/modules/auth/application/auth_update_dto"

function checkSupabaseProvider( value: string ): value is Provider {
  return value === "google"
}

export class SupabaseAuthData implements AuthAppService {
  constructor( private readonly client: SupabaseClient ) {
  }

  async remove( id: string ): Promise<void> {
    const { data, error } = await this.client.auth.admin.deleteUser( id )

    if ( error ) {
      throw new InfrastructureException( error.message )
    }
  }

  async login( request: AuthLoginRequest ): Promise<AuthResponse> {
    const { data, error } = await this.client.auth.signInWithPassword(
      { email: request.email, password: request.password } )
    if ( error ) {
      throw new InfrastructureException( error.message )
    }
    return {
      user_id : data.user.id,
      email   : data.user.email!,
      metadata: data.user.app_metadata,
      method  : data.user.app_metadata.provider!.toUpperCase()
    }
  }


  async logout( token: string ): Promise<void> {

    const { error } = await this.client.auth.admin.signOut( token )
    if ( error ) {
      throw new InfrastructureException( error.message )
    }
  }

  async register( request: AuthRegisterRequest ): Promise<AuthResponse> {
    const { data, error } = await this.client.auth.signUp( {
      email   : request.email,
      password: request.password
    } )
    if ( error ) {
      throw new InfrastructureException( error.message )
    }
    return {
      user_id : data.user!.id,
      email   : data.user!.email!,
      metadata: data.user!.app_metadata,
      method  : data.user!.app_metadata.provider!.toUpperCase()
    }
  }

  async requestResetPassword( reset: AuthResetDTO ): Promise<void> {
    if ( reset.method !== ResetPasswordTypeEnum.EMAIL && !reset.data ) {
      throw new InfrastructureException()
    }

    const { data: eData, error: eError } = await this.client.rpc(
      "get_user_id_by_email",
      {
        email: reset.data!
      }
    )

    if ( eError ) {
      throw new InfrastructureException( eError.message )
    }
    const emailEntry    = eData[0]
    const emailProvider = emailEntry.raw_app_meta_data.provider

    if ( emailProvider.toUpperCase() !== ResetPasswordTypeEnum.EMAIL ) {
      throw new ResetProviderNotMatch()
    }

    const { data, error } = await this.client.auth.resetPasswordForEmail(
      reset.data!, {
        redirectTo: process.env.RESET_REDIRECT_URL!
      } )
    if ( error ) {
      throw new InfrastructureException( error.message )
    }
  }

  async revalidate( token: string ): Promise<AuthResponse> {
    const { data, error } = await this.client.auth.refreshSession( {
      refresh_token: token
    } )
    if ( error ) {
      throw new InfrastructureException( error.message )
    }
    return {
      user_id : data.user!.id,
      email   : data.user!.email!,
      metadata: data.user!.app_metadata,
      method  : data.user!.app_metadata.provider!.toUpperCase()
    }
  }

  async singinOauth( oauth: OauthRequest ): Promise<AuthResponse> {
    let provider = oauth.method.toLowerCase()
    if ( !checkSupabaseProvider( provider ) ) {
      throw new InfrastructureException()
    }
    const { data, error } = await this.client.auth.signInWithIdToken( {
      provider,
      token: oauth.token
    } )
    if ( error ) {
      throw new InfrastructureException( error.message )
    }
    return {
      user_id : data.user!.id,
      email   : data.user!.email!,
      metadata: data.user!.app_metadata,
      method  : data.user!.app_metadata.provider!.toUpperCase()
    }
  }

  async confirmResetPassword( userId: string,
    reset: AuthResetDTO ): Promise<void> {
    if ( reset.method !== ResetPasswordTypeEnum.EMAIL && !reset.data ) {
      throw new InfrastructureException()
    }

    const { data, error } = await this.client.auth.admin.updateUserById(
      userId, {
        password: reset.data
      } )

    if ( error ) {
      throw new InfrastructureException( error.message )
    }
  }

  async update( auth: AuthUpdateDTO ): Promise<AuthResponse> {
    const { data, error } = await this.client.auth.admin.updateUserById(
      auth.email, {
        app_metadata: {
          ...(
            auth.metadata as Record<string, any>
          )
        }
      } )

    if ( error ) {
      throw new InfrastructureException( error.message )
    }
    return {
      user_id : data.user!.id,
      email   : data.user!.email!,
      metadata: data.user!.app_metadata,
      method  : data.user!.app_metadata.provider!.toUpperCase()
    }
  }
}
