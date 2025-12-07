import { UserResponse } from "@/modules/user/application/models/user_response"

export const parseAuthResponse = ( user: any ): UserResponse | undefined => {
  if ( !user ) {
    return undefined
  }
  return {
    user_id  : user.id,
    email    : user.email || "",
    full_name: user.user_metadata?.name || "",
    username     : user.user_metadata?.username || "",
    role     : user.user_metadata?.role || "",
    status   : user.user_metadata?.status || "",
    avatar   : user.user_metadata.avatar
  } as UserResponse
}
