import {
  WorkerProfileDTO
}                from "@/modules/worker/application/worker_profile_dto"
import React     from "react"
import { Badge } from "@/components/ui/badge"

interface WorkerCardProps {
  worker: WorkerProfileDTO
}

export function WorkerCard( {
  worker
}: WorkerCardProps )
{
  const getLowerTax = (): string | undefined => {
    let lowerTax: string | undefined = undefined
    let currentLowerTaxValue         = 0
    for ( const tax of worker.taxes ) {
      if ( tax.value > currentLowerTaxValue ) {
        currentLowerTaxValue = tax.value
        lowerTax             = `${ currentLowerTaxValue } ${ tax.value_format }`
      }
    }
    return lowerTax
  }
  const tax         = getLowerTax()
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center h-8 gap-4">
        { worker.avatar ? (
          <img
            src={ worker.avatar }
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : null }
        <p className="capitalize line-clamp-1">{ worker.full_name }</p>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto max-w-42 h-12">
        { worker.specialities.map( ( speciality, index ) => (
          <Badge key={speciality.id} className="capitalize">
            { speciality.name }
          </Badge>
        ) ) }
      </div>
      <p>{ worker.location }</p>
      {
        tax ? <p>Tarifa desde { tax }</p> : null
      }
      { worker.review_count > 0 ? <p>
          { worker.review_average.toFixed( 1 ) } estrellas
          ({ worker.review_count } reseñas)
        </p>
        :
        null
      }

    </div>
  )
}