import { type AuthLoginRequest } from "./auth_login_request"
import { type OauthRequest }     from "@/modules/auth/application/oauth_request"
import {
  type AuthResetDTO
}                                from "@/modules/auth/application/auth_reset_dto"
import { AuthResponse }          from "@/modules/auth/application/auth_response"
import {
  AuthRegisterRequest
}                                from "@/modules/auth/application/auth_register_request"
import {
  AuthUpdateDTO
}                                from "@/modules/auth/application/auth_update_dto"

export abstract class AuthAppService {
  abstract remove( id: string ): Promise<void>
  abstract login(request: AuthLoginRequest): Promise<AuthResponse>
  abstract logout( token: string ): Promise<void>
  abstract register(request: AuthRegisterRequest): Promise<AuthResponse>
  abstract requestResetPassword(reset : AuthResetDTO): Promise<void>
  abstract revalidate( token: string ): Promise<AuthResponse>
  abstract singinOauth(oauth : OauthRequest): Promise<AuthResponse>
  abstract confirmResetPassword( userId: string, reset: AuthResetDTO): Promise<void>
  abstract update( auth: AuthUpdateDTO ): Promise<AuthResponse>
}
