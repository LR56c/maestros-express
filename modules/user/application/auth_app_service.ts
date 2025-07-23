import {
  UserLoginRequest
} from "@/modules/user/application/models/user_login_request"
import {
  UserResponse
} from "@/modules/user/application/models/user_response"
import {
  UserRegisterRequest
} from "@/modules/user/application/models/user_register_request"

export abstract class AuthAppService {
  abstract login( request: UserLoginRequest ): Promise<UserResponse>

  abstract logout( token?: string ): Promise<void>
  abstract revalidate( token?: string ): Promise<UserResponse>

  abstract register( request: UserRegisterRequest ): Promise<UserResponse>

  abstract anonymous(): Promise<UserResponse>
  // abstract requestResetPassword( method: ResetPassword, data ?: string ): Promise<Either<BaseException, boolean>>
  // abstract singinOauth( method: AuthMethod, token?: ValidString ): Promise<Either<BaseException[], User>>
  // abstract confirmResetPassword( userId: ValidString, method: ResetPassword, data ?: string ): Promise<Either<BaseException, boolean>>
}
