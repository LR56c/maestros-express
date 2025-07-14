"use client"
import { Button }                                from "@/components/ui/button"
import { useQuery }                              from "@tanstack/react-query"
import { parseSpecialities, specialitiesOption } from "@/utils/tanstack_catalog"
import React, { useEffect, useState }            from "react"
import {
  MultiSelectInputValue
}                                                from "@/components/form/multi_select_input"
import MultiSelect
                                                 from "@/components/form/multi_select"
import { Dialog, DialogContent }                 from "@/components/ui/dialog"
import { ListFilter, Loader2Icon }               from "lucide-react"

interface QuickFilterProps {
  onChange: ( values: string[] ) => void
}

export function QuickFilter( { onChange }: QuickFilterProps ) {
  const { isPending: specialityPending, data: specialityData } = useQuery(
    specialitiesOption )

  const [specialityValues, setSpecialityValues] = useState<MultiSelectInputValue[]>(
    [] )
  const [isOpen, setIsOpen]                     = useState( false )
  const [filtersSelected, setFiltersSelected]   = useState<string[]>( [] )

  useEffect( () => {
    setSpecialityValues( parseSpecialities( specialityData ?? [] ) )
  }, [specialityData] )

  return (
    <div className="flex flex-col">
      <p>Filtros rapidos</p>
      <div className="flex gap-2 overflow-x-auto">
        { specialityPending ? (
          <div className="flex items-center gap-2">
            <Loader2Icon className="animate-spin"/>
            <p>Cargando especialidades</p>
          </div>
        ) : <>
          { specialityValues.length > 0 ? specialityValues.map(
            ( speciality ) =>
              <Button key={ speciality.label } size="sm" variant="secondary"
                      className="hover:bg-gray-300 dark:hover:bg-zinc-700 p-2 rounded-full">
                <span className="text-xs">{ speciality.label }</span>
              </Button>
          ) : null
          }
          { specialityValues.length > 0 ? <Button size="sm" variant="secondary"
                                                  onClick={ () => setIsOpen(
                                                    true ) }
                                                  className="hover:bg-gray-300 dark:hover:bg-zinc-700 p-2 rounded-full">
            <ListFilter/>
          </Button> : null }
        </>
        }

      </div>
      <Dialog open={ isOpen } onOpenChange={ setIsOpen }>
        <DialogContent className="sm:max-w-md w-full">
          <MultiSelect
            onChange={ ( values ) => setFiltersSelected(
              values.map( v => v.id ) ) }
            values={ specialityValues }
            loading={ specialityPending }
            placeholder="Seleccione Especialidades"
            searchPlaceholder="Buscar Especialidad"
            placeholderLoader="Cargando..."
          />
          <Button type="button"
                  onClick={ () => onChange( filtersSelected ) }>Filtrar</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}