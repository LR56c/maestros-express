import { SupabaseClient } from "@supabase/supabase-js"
import {
  InfrastructureException
}                         from "@/modules/shared/domain/exceptions/infrastructure_exception"
import {
  UserResponse
}                         from "@/modules/user/application/models/user_response"
import {
  UserLoginRequest
}                         from "@/modules/user/application/models/user_login_request"
import {
  UserRegisterRequest
}                         from "@/modules/user/application/models/user_register_request"
import {
  AuthAppService
}                         from "@/modules/user/application/auth_app_service"

// function checkSupabaseProvider( value: string ): value is Provider {
//   return value === "google"
// }

export class SupabaseUserData implements AuthAppService {
  constructor( private readonly client: SupabaseClient ) {
  }

  async anonymous(): Promise<UserResponse> {
    const { data, error } = await this.client.auth.signInAnonymously()

    if ( error ) {
      throw new InfrastructureException( error.message )
    }

    const metadata = data.user!.user_metadata

    return {
      user_id  : data.user!.id,
      email    : data.user!.email!,
      full_name: metadata.name,
      role     : metadata.role,
      status   : metadata.status
    }
  }

  async login( request: UserLoginRequest ): Promise<UserResponse> {
    const { data, error } = await this.client.auth.signInWithPassword(
      { email: request.email, password: request.password } )
    if ( error ) {
      throw new InfrastructureException( error.message )
    }
    const metadata = data.user!.user_metadata

    return {
      user_id  : data.user!.id,
      email    : data.user!.email!,
      full_name: metadata.name,
      avatar   : metadata.avatar,
      role     : metadata.role,
      status   : metadata.status
    }
  }

  async logout( token?: string ): Promise<void> {
    const { error } = await this.client.auth.signOut()
    if ( error ) {
      throw new InfrastructureException( error.message )
    }
  }

  async register( request: UserRegisterRequest ): Promise<UserResponse> {
    const { data, error } = await this.client.auth.signUp( {
      email   : request.email,
      password: request.password,
      options : {
        data: {
          name  : request.full_name,
          avatar: request.avatar
        }
      }
    } )
    if ( error ) {
      throw new InfrastructureException( error.message )
    }
    const metadata = data.user!.user_metadata

    return {
      user_id  : data.user!.id,
      email    : data.user!.email!,
      full_name: metadata.name,
      avatar   : metadata.avatar,
      role     : metadata.role,
      status   : metadata.status
    }
  }
}