import React, { useEffect, useMemo, useState } from "react"
import { FormProvider, useForm }               from "react-hook-form"
import { zodResolver }                         from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogTitle }  from "@/components/ui/dialog"
import InputText
                                               from "@/components/form/input_text"
import { Button }                              from "@/components/ui/button"
import { Loader2Icon }                         from "lucide-react"
import {
  regionSchema
}                                              from "@/modules/region/application/region_dto"
import {
  UUID
}                                              from "@/modules/shared/domain/value_objects/uuid"
import { useQuery }                            from "@tanstack/react-query"
import { countriesOption }                     from "@/utils/tanstack_catalog"
import SelectInput, {
  SelectInputValue
}                                              from "@/components/form/select_input"
import {
  CountryDTO
}                                              from "@/modules/country/application/country_dto"
import { z }                                   from "zod"

interface RegionAdminDialogProps {
  isOpen: boolean
  isLoading: boolean
  onOpenChange: ( open: boolean ) => void
  title: string
  formData: any
  onSave: ( data: any ) => void
}

export const RegionAdminDialog = ( {
  isOpen,
  isLoading,
  onOpenChange,
  title,
  formData,
  onSave
}: RegionAdminDialogProps ) => {
  const { isPending, data } = useQuery( countriesOption )

  const [inputCountries, setInputCountries] = useState<SelectInputValue[]>( [] )
  useEffect( () => {
    if ( !data ) return
    const countries: CountryDTO[] = data.items as CountryDTO[]
    setInputCountries( countries.map( c => (
      {
        label: c.name,
        value: c
      }
    ) ) )
  }, [data] )

  const initialValues = useMemo( () => {
    if(!formData.id) {
      formData.id = UUID.create().toString()
    }
    if(formData.country ) {
      formData.country = formData.country as CountryDTO
      formData.country_name = formData.country.name
    }
    return formData
  }, [formData] )

  const methods = useForm( {
    resolver: zodResolver( regionSchema.extend( {
        country_name: z.string()
      } )
    ),
    values  : initialValues
  } )

  const handleSubmit = methods.handleSubmit( onSave )

  return (
    <FormProvider { ...methods }>
      <Dialog open={ isOpen } onOpenChange={ onOpenChange }>
        <DialogContent className="sm:max-w-md w-full">
          <DialogTitle>{ title }</DialogTitle>
          <InputText name="name" label="Nombre de la región"
                     type="text"
                     placeholder="Ingrese el nombre de la región"/>
          <SelectInput
            placeholder="Seleccione pais"
            loading={ isPending }
            onChange={ ( value ) => {
              const c = value as CountryDTO
              methods.setValue( "country_name", c.name )
              methods.setValue( "country", c )
            } }
            name="country_name" values={ inputCountries } label="Pais"/>
          <Button
            onClick={ handleSubmit }
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
