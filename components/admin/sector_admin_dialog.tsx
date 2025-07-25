import React, { useEffect, useMemo, useState } from "react"
import { FormProvider, useForm }               from "react-hook-form"
import { zodResolver }                         from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogTitle }  from "@/components/ui/dialog"
import InputText
                                               from "@/components/form/input_text"
import { Button }                              from "@/components/ui/button"
import { Loader2Icon }                         from "lucide-react"
import {
  sectorSchema
}                                              from "@/modules/sector/application/sector_dto"
import { useQuery }                            from "@tanstack/react-query"
import { regionsOption }                       from "@/utils/tanstack_catalog"
import SelectInput, {
  SelectInputValue
}                                              from "@/components/form/select_input"
import {
  CountryDTO
}                                              from "@/modules/country/application/country_dto"
import {
  RegionDTO
}                                              from "@/modules/region/application/region_dto"
import {
  UUID
}                                              from "@/modules/shared/domain/value_objects/uuid"
import { z }                                   from "zod"

interface SectorAdminDialogProps {
  isOpen: boolean
  isLoading: boolean
  onOpenChange: ( open: boolean ) => void
  title: string
  formData: any
  onSave: ( data: any ) => void
}

export const SectorAdminDialog = ( {
  isOpen,
  isLoading,
  onOpenChange,
  title,
  formData,
  onSave
}: SectorAdminDialogProps ) => {
  const { isPending, data } = useQuery( regionsOption )

  const [inputRegions, setInputRegions] = useState<SelectInputValue[]>( [] )
  useEffect( () => {
    if ( !data ) return
    const regions: RegionDTO[] = data.items as RegionDTO[]
    setInputRegions( regions.map( c => (
      {
        label: c.name,
        value: c
      }
    ) ) )
  }, [data] )

  const initialValues = useMemo( () => {
    if ( !formData || !formData.id ) {
      return { id: UUID.create().toString() }
    }
    if ( formData.region ) {
      formData.region = formData.region as RegionDTO
      formData.region_name = formData.region.name
    }
    return formData
  }, [formData] )

  const methods = useForm( {
    resolver: zodResolver( sectorSchema.extend( {
        region_name: z.string()
      } )
    ),
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
          <InputText name="name" label="Nombre del sector"
                     type="text"
                     placeholder="Ingrese el nombre del sector"/>
          <SelectInput
            placeholder="Seleccione region"
            loading={ isPending }
            onChange={ ( value ) => {
              const c = value as RegionDTO
              methods.setValue( "region_name", c.name )
              methods.setValue( "region", c )
            } }
            name="region_name" values={ inputRegions } label="Region"/>
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

