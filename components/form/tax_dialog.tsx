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


export const TaxDialog: React.FC<ListInputModalProps> = ( {
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
    resolver     : zodResolver( workerTaxSchema ),
    values: initialValues,
  } )

  const { handleSubmit,setValue } = methods

  const onSubmit = async ( data: any ) => {
    console.log( "Form submitted with data:", data )
    onSave( data )
  }

  return (
    <FormProvider { ...methods } >
      <Dialog open={ isOpen } onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md w-full">
          <DialogTitle >{ title }</DialogTitle>
          <InputText name="name" label="Nombre de tarifa" type="text"
                     placeholder="Ingrese nombre de tarifa"/>
          <InputText name="value" label="Valor de tarifa" type="number"
                     placeholder="Ingrese valor de tarifa"/>
          <SelectInput
            onChange={(value)=>setValue('value_format',value)}
            values={ [
            { value: "percentage", label: "Porcentaje" },
            { value: "fixed", label: "Fijo" }
          ] } label="Formato de valor" name="value_format" loading={ false }/>
          <Button type="button" onClick={ handleSubmit( onSubmit ) }>Guardar</Button>
        </DialogContent>
      </Dialog>
    </FormProvider>
  )
}
