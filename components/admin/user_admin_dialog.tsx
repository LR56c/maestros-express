import { UserResponse } from "@/modules/user/application/models/user_response"
import React            from "react"

interface UserAdminDialogProps {
  isOpen: boolean
  isLoading: boolean
  onOpenChange: ( open: boolean ) => void
  title: string
  user: UserResponse | null
  onSave: ( data: any ) => void
}

export function UserAdminDialog( {
  isOpen,
  isLoading,
  onOpenChange,
  title,
  user,
  onSave
}: UserAdminDialogProps )
{
  if ( !user ) {
    return (
      <div className="p-4">
        <div className="h-8 w-full animate-pulse bg-muted/50 mb-2"/>
        <div className="h-8 w-full animate-pulse bg-muted/50 mb-2"/>
        <div className="h-8 w-full animate-pulse bg-muted/50"/>
      </div>
    )
  }


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