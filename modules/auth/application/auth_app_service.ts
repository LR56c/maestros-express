import { type AuthRequest }  from "./auth_request"
import { type OauthRequest } from "@/modules/auth/application/oauth_request"
import { type AuthResetDTO } from "@/modules/auth/application/auth_reset_dto"
import { type AuthToken }    from "@/modules/auth/application/auth_token"

export abstract class AuthAppService {
  abstract remove( id: string ): Promise<void>

  abstract login( request: AuthRequest ): Promise<AuthToken>

  abstract register( auth: AuthRequest ): Promise<AuthToken>

  abstract singinOauth( auth: OauthRequest ): Promise<AuthToken>

  abstract revalidate( token: string ): Promise<AuthToken>

  abstract logout( token: string ): Promise<void>

  abstract requestResetPassword( reset: AuthResetDTO ): Promise<void>

  abstract confirmResetPassword( id: string,
    reset: AuthResetDTO ): Promise<void>
}
