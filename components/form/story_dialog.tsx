"use client"
import { Button }                             from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { FormProvider, useForm }              from "react-hook-form"
import { zodResolver }                        from "@hookform/resolvers/zod"
import {
  workerTaxSchema
}                                             from "@/modules/worker_tax/application/worker_tax_dto"
import InputText
                                              from "@/components/form/input_text"
import React, { useMemo }                from "react"
import {
  UUID
}                                             from "@/modules/shared/domain/value_objects/uuid"
import SelectInput
                                              from "@/components/form/select_input"
import {
  ListInputModalProps
}                                             from "@/components/form/list_input"
import {
  storySchema
}                                             from "@/modules/story/application/story_dto"
import FileUploadInput
                                              from "@/components/form/file_upload_input"
import { DropzoneOptions }                    from "react-dropzone"


export const StoryDialog: React.FC<ListInputModalProps> = ( {
  isOpen,
  onOpenChange,
  title,
  formData,
  onSave,
} ) =>
{
  const initialValues = useMemo(() => {
    if (Object.keys(formData).length === 0) {
      return { id: UUID.create().toString() };
    }
    return formData;
  }, [formData]);

  const methods = useForm( {
    resolver     : zodResolver( storySchema ),
    values: initialValues,
  } )

  const { handleSubmit,setValue } = methods

  const onSubmit = async ( data: any ) => {
    console.log( "Form submitted with data:", data )
    onSave( data )
  }

  const dropzone = {
    accept  : {
      "image/*": [".jpg", ".jpeg", ".png"]
    },
    multiple: true,
    maxFiles: 4,
    maxSize : 1 * 1024 * 1024
  } satisfies DropzoneOptions


  return (
    <FormProvider { ...methods } >
      <Dialog open={ isOpen } onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md w-full">
          <DialogTitle >{ title }</DialogTitle>
          <InputText name="name" label="Nombre de trabajo" type="text"
                     placeholder="Ingrese nombre de trabajo"/>
          <InputText name="description" label="Descripcion" type="text"
                     placeholder="Ingrese descripcion del trabajo"/>
          <FileUploadInput
            helperText="Imagenes sobre trabajos realizados"
            placeholder="Suelta los archivos aquí o haz click para subir"
            name="documents" label="Imagenes" dropzone={ dropzone }/>
          <Button type="button" onClick={ handleSubmit( onSubmit ) }>Guardar</Button>
        </DialogContent>
      </Dialog>
    </FormProvider>
  )
}
