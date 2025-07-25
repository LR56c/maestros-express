import React, { useMemo }                     from "react"
import { FormProvider, useForm }              from "react-hook-form"
import { zodResolver }                        from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import InputText
                                              from "@/components/form/input_text"
import { Button }                             from "@/components/ui/button"
import { Loader2Icon }                        from "lucide-react"
import {
  countrySchema
}                                             from "@/modules/country/application/country_dto"
import {
  UUID
}                                             from "@/modules/shared/domain/value_objects/uuid"

interface CountryAdminDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  onOpenChange: ( open: boolean ) => void;
  title: string;
  formData: any;
  onSave: ( data: any ) => void;
}

export function CountryAdminDialog( {
  isOpen,
  isLoading,
  onOpenChange,
  title,
  formData,
  onSave
}: CountryAdminDialogProps )
{
  const initialValues = useMemo( () => {
    if ( !formData || !formData.id ) {
      return { id: UUID.create().toString() }
    }
    return formData
  }, [formData] )

  const methods = useForm( {
    resolver: zodResolver( countrySchema ),
    values  : initialValues
  } )

  const { handleSubmit, reset } = methods
  const onSubmit         = async ( data: any ) => {
    onSave( data )
    reset()
  }

  return (
    <FormProvider { ...methods }>
      <Dialog open={ isOpen } onOpenChange={ onOpenChange }>
        <DialogContent className="sm:max-w-md w-full">
          <DialogTitle>{ title }</DialogTitle>
          <InputText name="name" label="Nombre del país"
                     type="text"
                     placeholder="Ingrese el nombre del país"/>
          <InputText name="code" label="Código del país"
                     type="text"
                     placeholder="Ingrese el código del país"/>
          <Button
            onClick={ handleSubmit( onSubmit ) }
            type="button" disabled={ isLoading }>
            { isLoading
              ? <Loader2Icon className="animate-spin"/>
              : "Guardar" }
          </Button>
        </DialogContent>
      </Dialog>
    </FormProvider>
  )
}

