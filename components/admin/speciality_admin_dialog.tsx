import React, { useMemo }                     from "react"
import {
  UUID
}                                             from "@/modules/shared/domain/value_objects/uuid"
import { FormProvider, useForm }              from "react-hook-form"
import { zodResolver }                        from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import InputText
                                              from "@/components/form/input_text"
import { Button }                             from "@/components/ui/button"
import {
  specialitySchema
}                                             from "@/modules/speciality/application/speciality_dto"
import { Loader2Icon }                        from "lucide-react"

interface SpecialityAdminDialogProps {
  isOpen: boolean
  isLoading: boolean
  onOpenChange: ( open: boolean ) => void
  title: string
  formData: any
  onSave: ( data: any ) => void
}

export function SpecialityAdminDialog( {
  isOpen,
  isLoading,
  onOpenChange,
  title,
  formData,
  onSave
}: SpecialityAdminDialogProps )
{
  const initialValues = useMemo( () => {
    if ( !formData || !formData.id ) {
      return { id: UUID.create().toString() }
    }
    return formData
  }, [formData] )

  const methods = useForm( {
    resolver: zodResolver( specialitySchema ),
    values  : initialValues
  } )

  const { handleSubmit } = methods

  const onSubmit = async ( data: any ) => {
    onSave( data )
  }
  return (
    <FormProvider { ...methods } >
      <Dialog open={ isOpen } onOpenChange={ onOpenChange }>
        <DialogContent className="sm:max-w-md w-full">
          <DialogTitle>{ title }</DialogTitle>
          <InputText name="name" label="Nombre de especialidad" type="text"
                     placeholder="Ingrese nombre de especialidad"/>
          <Button type="button"
                  disabled={isLoading}
                  onClick={ handleSubmit( onSubmit ) }>
            {
              isLoading ?
                <>
                  <Loader2Icon className="animate-spin"/>
                  Guardando...
                </>
                : "Guardar"
            }
          </Button>
        </DialogContent>
      </Dialog>
    </FormProvider>
  )
}