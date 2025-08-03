import {
  UserResponse,
  userResponseSchema
}                                             from "@/modules/user/application/models/user_response"
import React                                  from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { FormProvider, useForm }              from "react-hook-form"
import { zodResolver }                        from "@hookform/resolvers/zod"
import SelectInput, {
  SelectInputValue
}                                             from "@/components/form/select_input"
import { z }                                  from "zod"
import { Loader2Icon }                        from "lucide-react"
import { Button }                             from "@/components/ui/button"

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
  const inputStatusMap = new Map<string, any>( [
    ["INCOMPLETE", "Incompleto"],
    ["PENDING", "Pendiente"],
    ["VERIFIED", "Verificado"]
  ] )
  const inputRolesMap = new Map<string, any>( [
    ["ADMIN", "Administrador"],
    ["WORKER", "Trabajador"],
    ["CLIENT", "Cliente"]
  ] )
  const userData = user ? user : {}
  const methods = useForm( {
    resolver: zodResolver( userResponseSchema.extend( {
      role_name: z.string(),
      status_name: z.string()
    } ) ),
    values  : {
      ...userData,
      role_name: user ? inputRolesMap.get( user.role ) || "" : "",
      status_name: user ? inputStatusMap.get( user.status ) || "" : ""
    }
  } )


  const { handleSubmit, reset } = methods

  const onSubmit         = async ( data: any ) => {
    onSave( data )
    reset()
  }


  const inputStatus: SelectInputValue[] = Array.from( inputStatusMap.entries() )
                                              .map( ( [label, value] ) =>
                                                (
                                                  { value: label, label: value }
                                                ) )

  const inputRoles: SelectInputValue[] = Array.from( inputRolesMap.entries() )
                                              .map( ( [label, value] ) =>
                                                (
                                                  { value: label, label: value }
                                                ) )
  if ( !user ) {
    return null
  }

  return (
    <FormProvider { ...methods }>
      <Dialog open={ isOpen } onOpenChange={ onOpenChange }>
        <DialogContent className="sm:max-w-md w-full">
          <DialogTitle>{ title }</DialogTitle>
          <div className="flex gap-4">
            <div
              className="size-24 rounded-full bg-muted flex items-center justify-center">
              <img
                src={ user.avatar }
                alt={ user.full_name }
                className="rounded-full object-cover w-full h-full"/>
            </div>
            <div className="flex flex-col space-y-2">
              <p>Usuario: { user.username }</p>
              <p>Nombre: { user.full_name }</p>
              <p>Email: { user.email }</p>
              <SelectInput
                placeholder="Seleccione estado"
                loading={ false }
                onChange={ ( value ) => {
                  const selectedStatus = inputStatusMap.get( value )
                  if ( selectedStatus ) {
                    methods.setValue( "status", value )
                    methods.setValue( "status_name", selectedStatus )
                  }
                } }
                name="status_name" values={ inputStatus } label="Estado"/>
              <SelectInput
                placeholder="Seleccione rol"
                loading={ false }
                onChange={ ( value ) => {
                  const selectedRole = inputRolesMap.get( value )
                  if ( selectedRole ) {
                    methods.setValue( "role", value )
                    methods.setValue( "role_name", selectedRole )
                  }
                } }
                name="role_name" values={ inputRoles } label="Rol"/>
              <Button
                onClick={ handleSubmit( onSubmit ) }
                type="button" disabled={ isLoading }>
                { isLoading
                  ? <Loader2Icon className="animate-spin"/>
                  : "Guardar" }
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </FormProvider>
  )
}