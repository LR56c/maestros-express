import React, { useEffect, useMemo, useState } from "react"
import { FormProvider, useForm }               from "react-hook-form"
import { zodResolver }                         from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogTitle }  from "@/components/ui/dialog"
import InputText                               from "@/components/form/input_text"
import { Button }                              from "@/components/ui/button"
import { Loader2Icon }                         from "lucide-react"
import { phoneFormatSchema }                   from "@/modules/phone_format/application/phone_format_dto"
import { UUID }                                from "@/modules/shared/domain/value_objects/uuid"
import { useQuery }                            from "@tanstack/react-query"
import { countriesOption }                     from "@/utils/tanstack_catalog"
import SelectInput, {
  SelectInputValue
}                                              from "@/components/form/select_input"
import {
  CountryDTO
}                                              from "@/modules/country/application/country_dto"
import { z }                                   from "zod"

interface PhoneFormatAdminDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  formData: any;
  onSave: (data: any) => void;
}

export function PhoneFormatAdminDialog({
  isOpen,
  isLoading,
  onOpenChange,
  title,
  formData,
  onSave
}: PhoneFormatAdminDialogProps) {
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

  const initialValues = useMemo(() => {
    if (!formData || !formData.id) {
      return { id: UUID.create().toString() }
    }
    if(formData.country ) {
      formData.country = formData.country as CountryDTO
      formData.country_name = formData.country.name
    }
    return formData
  }, [formData])

  const methods = useForm({
    resolver: zodResolver(phoneFormatSchema.extend( {
      country_name: z.string()
    } )),
    values: initialValues
  })

  const { handleSubmit, reset, setValue } = methods
  const onSubmit = async (data: any) => {
    onSave(data)
    reset()
  }

  return (
    <FormProvider {...methods}>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md w-full">
          <DialogTitle>{title}</DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <InputText name="prefix" label="Prefijo" type="text" placeholder="Ingrese el prefijo" />
            <InputText name="regex" label="Regex" type="text" placeholder="Ingrese el regex" />
            <InputText name="example" label="Ejemplo" type="text" placeholder="Ingrese un ejemplo" />
            <SelectInput
              placeholder="Seleccione pais"
              loading={ isPending }
              onChange={ ( value ) => {
                const c = value as CountryDTO
                setValue( "country_name", c.name )
                setValue( "country", c )
              } }
              name="country_name" values={ inputCountries } label="Pais"/>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <Loader2Icon className="animate-spin mr-2 h-4 w-4" /> : null}
              Guardar
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </FormProvider>
  )
}

