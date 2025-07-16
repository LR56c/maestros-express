"use client"
import { useParams } from "next/navigation"
import { useQuery }  from "@tanstack/react-query"
import { getWorker } from "@/utils/tanstack_catalog"
import { Button }    from "@/components/ui/button"
import React         from "react"

export function WorkerDetail()
{
  const params              = useParams()
  const { id }              = params
  const { data, isPending } = useQuery( {
    queryKey: ["worker", id],
    queryFn : () => getWorker( id as string )
  } )
  return (
    <div className="w-dvw flex justify-center p-4">
      <div className="flex flex-col max-w-sm gap-2">
        <div>{ isPending ? "cargando" : JSON.stringify( data ) }</div>
        <div className="flex gap-4 items-center">
          { data && data.avatar ?
            <img
              className="w-16 h-16 rounded-full object-cover"
            /> : null
          }
          <div className="flex flex-col gap-4">
            <p className="capitalize">{ data && data.full_name }</p>
            { data && data.specialities.length > 0 ? data.specialities.map(
              ( speciality ) =>
                <Button key={ speciality.id } size="sm" variant="secondary">
                  <span className="text-xs">{ speciality.name }</span>
                </Button>
            ) : null
            }
          </div>
        </div>
        <p>
          { data && data.review_average.toFixed( 1 ) } estrellas
          ({ data && data.review_count } reseñas)
        </p>
        <p>{ data && data.description }</p>
        <Button>solicitud</Button>
        <Button>agendar</Button>
        <p>historias</p>
        <p>tabs</p>
      </div>
    </div>
  )
}