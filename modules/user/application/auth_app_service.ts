import {
  UserLoginRequest
} from "@/modules/user/application/models/user_login_request"
import {
  UserResponse
} from "@/modules/user/application/models/user_response"
import {
  UserRegisterRequest
} from "@/modules/user/application/models/user_register_request"
import {
  UserUpdateDTO
} from "@/modules/user/application/models/user_update_dto"

export abstract class AuthAppService {
  abstract remove( id: string ): Promise<void>
  abstract login(request: UserLoginRequest): Promise<UserResponse>
  abstract logout( token: string ): Promise<void>
  abstract register(request: UserRegisterRequest): Promise<UserResponse>
  abstract update( auth: UserUpdateDTO ): Promise<UserResponse>
}
