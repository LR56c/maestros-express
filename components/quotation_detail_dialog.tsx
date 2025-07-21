"use client"
import { Button }                              from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle }  from "@/components/ui/dialog"
import { FormProvider, useForm }               from "react-hook-form"
import { zodResolver }                         from "@hookform/resolvers/zod"
import InputText
                                               from "@/components/form/input_text"
import React, { useEffect, useMemo, useState } from "react"
import {
  UUID
}                                              from "@/modules/shared/domain/value_objects/uuid"
import SelectInput, {
  SelectInputValue
}                                              from "@/components/form/select_input"
import {
  ListInputModalProps
}                                              from "@/components/form/list_input"
import { useQuery }                            from "@tanstack/react-query"
import {
  CurrencyDTO
}                                              from "@/modules/currency/application/currency_dto"
import {
  quotationDetailSchema
}                                              from "@/modules/quotation/modules/quotation_detail/application/quotation_detail_dto"
import { currencyOption }                      from "@/utils/tanstack_catalog"
import InputTextArea
                                               from "@/components/form/input_text_area"




export const QuotationDetailDialog: React.FC<ListInputModalProps> = ( {
  isOpen,
  onOpenChange,
  title,
  formData,
  onSave
} ) =>
{

  const { isPending, data }             = useQuery(
    currencyOption )
  const [selectValues, setSelectValues] = useState<SelectInputValue[]>( [] )
  useEffect( () => {
    if ( !data ) return
    const currencies: CurrencyDTO[] = data.items as CurrencyDTO[]
    setSelectValues( currencies.map( value => (
      {
        label: value.code,
        value: value
      }
    ) ) )
  }, [data] )
  const initialValues = useMemo( () => {
    if ( Object.keys( formData ).length === 0 ) {
      return { id: UUID.create().toString() }
    }
    return formData
  }, [formData] )

  const methods = useForm( {
    resolver: zodResolver( quotationDetailSchema ),
    values  : initialValues
  } )

  const { handleSubmit, setValue } = methods

  const onSubmit = async ( data: any ) => {
    onSave( data )
  }

  return (
    <FormProvider { ...methods } >
      <Dialog open={ isOpen } onOpenChange={ onOpenChange }>
        <DialogContent className="sm:max-w-md w-full">
          <DialogTitle>{ title }</DialogTitle>
          <InputText name="name" label="Nombre del detalle" type="text"
                     placeholder="Ingrese nombre del detalle"/>
          <InputTextArea name="description" label="Descripcion"
                         placeholder="Ingrese una breve descripcion"/>
          <InputText name="value" label="Valor del detalle" type="number"
                     placeholder="Ingrese valor del detalle"/>
          <SelectInput
            placeholder="Seleccione una moneda"
            onChange={ ( value ) => setValue( "value_format", value.code ) }
            values={ selectValues } label="Formato de valor" name="value_format"
            loading={ isPending }/>
          <Button type="button"
                  onClick={ handleSubmit( onSubmit ) }>Guardar</Button>
        </DialogContent>
      </Dialog>
    </FormProvider>
  )
}
