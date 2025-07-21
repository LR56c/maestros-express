"use client"
import { Dialog, DialogContent, DialogTrigger }  from "@/components/ui/dialog"
import { Button }                                from "@/components/ui/button"
import { ListFilter }                            from "lucide-react"
import MultiSelect
                                                 from "@/components/form/multi_select"
import { useQuery }                              from "@tanstack/react-query"
import { parseSpecialities, specialitiesOption } from "@/utils/tanstack_catalog"
import { useEffect, useState }                   from "react"
import {
  MultiSelectInputValue
}                                                from "@/components/form/multi_select_input"

interface MoreFilterProps {
  onFilter: ( filters: any ) => void
}

export function MoreFilter( { onFilter }: MoreFilterProps ) {
  const { isPending: specialityPending, data: specialityData } = useQuery(
    specialitiesOption )

  const [specialityValues, setSpecialityValues] = useState<MultiSelectInputValue[]>(
    [] )

  const [filtersSelected, setFiltersSelected] = useState(
    new Map<string, any>() )

  useEffect( () => {
    setSpecialityValues( parseSpecialities( specialityData?.items ?? [] ) )
  }, [specialityData] )

  const handleFilters = ( value: { key: string, value: any } ) => {
    setFiltersSelected( prev => {
      const newFilters = new Map( prev )
      newFilters.set( value.key, value.value )
      return newFilters
    } )
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="hover:bg-gray-300 dark:hover:bg-zinc-700 p-2 rounded-full"
          variant="secondary" size="sm">
          <ListFilter/>
          Mas filtros
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md w-full pt-12">
        <MultiSelect
          onChange={ ( values ) => handleFilters( {
            key  : "specialities",
            value: values.map( v => v.id ).join( "," )
          } ) }
          values={ specialityValues }
          loading={ specialityPending }
          placeholder="Seleccione Especialidades"
          searchPlaceholder="Buscar Especialidad"
          placeholderLoader="Cargando..."
        />
        <Button type="button"
                onClick={ () => {
                  onFilter(Object.fromEntries(filtersSelected))
                } }
        >Filtrar</Button>
      </DialogContent>
    </Dialog>
  )
}