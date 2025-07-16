import React            from "react"
import { UserResponse } from "@/modules/user/application/models/user_response"

interface ProfileDetailProps {
  profile: UserResponse
}

export function ProfileDetail( { profile }: ProfileDetailProps ) {
  return (
    <>
      <div>{ JSON.stringify( profile ) }</div>
      <p>profile detail</p>
    </>
  )
}
