import {
  UserRegisterRequest
} from "@/modules/user/application/models/user_register_request"
import { UserResponse } from "@/modules/user/application/models/user_response"
import {
  UserUpdateDTO
} from "@/modules/user/application/models/user_update_dto"

export abstract class UserAppService {
  abstract add( user: UserRegisterRequest ): Promise<UserResponse>

  abstract search( query: string ): Promise<UserResponse[]>

  abstract remove( id: string ): Promise<void>

  abstract update( id: string, user: UserUpdateDTO ): Promise<UserResponse>
}
