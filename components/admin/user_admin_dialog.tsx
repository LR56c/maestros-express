import { UserResponse } from "@/modules/user/application/models/user_response"
import React            from "react"

interface UserAdminDialogProps {
  user: UserResponse
}

export function UserAdminDialog( { user }: UserAdminDialogProps ) {
  return (
    <div className="flex gap-4 overflow-y-scroll">
      <div
        className="size-24 rounded-full bg-muted flex items-center justify-center">
        <img
          src={ user.avatar }
          alt={ user.full_name }
          className="rounded-full object-cover w-full h-full"/>
      </div>
      <div className="flex flex-col space-y-2">
        <p>{ user.full_name }</p>
        <p>Email { user.email }</p>
        <p>Rol { user.role }</p>
        <p>Estado { user.status }</p>
      </div>
    </div>
  )
}