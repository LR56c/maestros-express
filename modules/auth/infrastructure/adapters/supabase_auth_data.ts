import { type Provider, SupabaseClient } from "@supabase/supabase-js"
import {
  AuthAppService
}                                        from "@/modules/auth/application/auth_app_service"
import {
  BaseException
}                                        from "@/modules/shared/domain/exceptions/base_exception"
import {
  type AuthRequest
}                                        from "@/modules/auth/application/auth_request"
import {
  type OauthRequest
}                                        from "@/modules/auth/application/oauth_request"
import {
  InfrastructureException
}                                        from "@/modules/shared/domain/exceptions/infrastructure_exception"
import {
  wrapType
}                                        from "@/modules/shared/utils/wrap_type"
import {
  ResetPassword,
  ResetPasswordTypeEnum
}                                        from "@/modules/auth/domain/reset_password_method"
import {
  type AuthResetDTO
}                                        from "@/modules/auth/application/auth_reset_dto"
import {
  type AuthToken
}                                        from "@/modules/auth/application/auth_token"
import * as process                      from "node:process"
import {
  ResetProviderNotMatch
}                                        from "@/modules/shared/domain/exceptions/reset_provider_not_match"

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

  async login( request: AuthRequest ): Promise<AuthToken> {
    const { data, error } = await this.client.auth.signInWithPassword(
      { email: request.email, password: request.password } )
    if ( error ) {
      throw new InfrastructureException( error.message )
    }

    return {
      user_id: data.user.id,
      email  : data.user.email!,
      ac     : data.session.access_token,
      rf     : data.session.refresh_token
    }
  }

  async logout( token: string ): Promise<void> {
    const { error } = await this.client.auth.admin.signOut( token )
    if ( error ) {
      throw new InfrastructureException( error.message )
    }
  }

  async register( request: AuthRequest ): Promise<AuthToken> {
    const { data, error } = await this.client.auth.signUp( {
      email   : request.email,
      password: request.password
    } )
    if ( error ) {
      throw new InfrastructureException( error.message )
    }
    return {
      user_id: data.user!.id,
      email  : data.user!.email!,
      ac     : data.session!.access_token,
      rf     : data.session!.refresh_token
    }
  }

  async requestResetPassword( reset: AuthResetDTO ): Promise<void> {
    const validMethod = wrapType( () => ResetPassword.from( reset.method ) )
    if ( validMethod instanceof BaseException ) {
      throw validMethod
    }
    if ( validMethod.value !== ResetPasswordTypeEnum.EMAIL && !reset.data ) {
      throw new InfrastructureException()
    }

    const { data: eData, error: eError } = await this.client.rpc(
      "get_user_id_by_email",
      {
        email: reset.data
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

  async revalidate( token: string ): Promise<AuthToken> {
    const { data, error } = await this.client.auth.refreshSession( {
      refresh_token: token
    } )
    if ( error ) {
      throw new InfrastructureException( error.message )
    }
    return {
      user_id: data.user!.id,
      email  : data.user!.email!,
      ac     : data.session!.access_token,
      rf     : data.session!.refresh_token
    }
  }

  async singinOauth( request: OauthRequest ): Promise<AuthToken> {
    let provider = request.auth_method.toLowerCase()
    if ( !checkSupabaseProvider( provider ) ) {
      throw new InfrastructureException()
    }
    const { data, error } = await this.client.auth.signInWithIdToken( {
      provider,
      token: request.token
    } )
    if ( error ) {
      throw new InfrastructureException( error.message )
    }
    return {
      user_id: data.user.id,
      email  : data.user.email!,
      ac     : data.session.access_token,
      rf     : data.session.refresh_token
    }
  }

  async confirmResetPassword( id: string,
    reset: AuthResetDTO ): Promise<void> {
    const validMethod = wrapType( () => ResetPassword.from( reset.method ) )
    if ( validMethod instanceof BaseException ) {
      throw validMethod
    }
    if ( validMethod.value !== ResetPasswordTypeEnum.EMAIL && !reset.data ) {
      throw new InfrastructureException()
    }

    const { data, error } = await this.client.auth.admin.updateUserById( id, {
      password: reset.data!
    } )

    if ( error ) {
      throw new InfrastructureException( error.message )
    }
  }
}
