import type { UserRequest }   from "@/modules/user/application/user_request"
import type { UserResponse }  from "@/modules/user/application/user_response"
import type { UserUpdateDTO } from "@/modules/user/application/user_update_dto"

export abstract class UserAppService {
  abstract add( user: UserRequest ): Promise<UserResponse>

  abstract search( query: string ): Promise<UserResponse[]>

  abstract remove( id: string ): Promise<void>

  abstract update( id: string, user: UserUpdateDTO ): Promise<UserResponse>
}
