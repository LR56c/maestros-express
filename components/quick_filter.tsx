"use client"
import { Button }                                from "@/components/ui/button"
import { useQuery }                              from "@tanstack/react-query"
import { parseSpecialities, specialitiesOption } from "@/utils/tanstack_catalog"
import React, { useEffect, useState }            from "react"
import {
  MultiSelectInputValue
}                                                from "@/components/form/multi_select_input"
import { Loader2Icon }                           from "lucide-react"
import {
  MoreFilter
}                                                from "@/components/more_filters"

interface QuickFilterProps {
  onFilter: ( filters: Map<string, any> ) => void
}

export function QuickFilter( { onFilter }: QuickFilterProps ) {
  const { isPending: specialityPending, data: specialityData } = useQuery(
    specialitiesOption )

  const [specialityValues, setSpecialityValues] = useState<MultiSelectInputValue[]>(
    [] )


  useEffect( () => {
    setSpecialityValues( parseSpecialities( specialityData ?? [] ) )
  }, [specialityData] )

  const handleFilters = ( value: { key: string, value: any } ) => {
    onFilter( new Map( [[value.key, value.value]] ) )
  }

  return (
    <div className="flex flex-col">
      <p>Filtros rapidos</p>
      <div className="flex items-center gap-2">
        { specialityPending ? (
          <div className="flex items-start gap-2">
            <Loader2Icon className="animate-spin"/>
            <p>Cargando especialidades</p>
          </div>
        ) : <>
          <div className="flex items-center gap-2 max-w-md overflow-x-auto h-16">
            { specialityValues.length > 0 ? specialityValues.map(
              ( speciality ) =>
                <Button key={ speciality.label } size="sm" variant="secondary"
                        onClick={ () => handleFilters( {
                          key  : "specialities",
                          value: speciality.value.id
                        } ) }
                        className="hover:bg-gray-300 dark:hover:bg-zinc-700 p-2 rounded-full">
                  <span className="text-xs">{ speciality.label }</span>
                </Button>
            ) : null
            }
          </div>
          <MoreFilter onFilter={ ( filters: Map<string, any> ) => {
            onFilter( filters )
          }
          }
          />
        </>
        }

      </div>
    </div>
  )
}