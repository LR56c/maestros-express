"use client"
import Link                 from "next/link"
import React, { useEffect }         from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Skeleton }                 from "@/components/ui/skeleton"
import HistoryCircle        from "@/components/history_circle"
import { storiesOptions } from "@/utils/tanstack_catalog"

interface WorkerHistoriesProps {
  workerId: string
}

export default function WorkerHistories( { workerId }: WorkerHistoriesProps ) {
  const qc                  = useQueryClient()
  const { isPending, data } = useQuery( storiesOptions(workerId)  )
  useEffect( () => {
    if ( !data || data.length === 0 ) return
    data.forEach( ( history: any ) => {
      qc.setQueryData( ["story", history.id], history )
    } )
  }, [data] )

  return (
    <>
      { isPending ?
        <div className="flex gap-4 overflow-x-auto pb-4">
          { [...Array( 6 )].map( ( _, i ) => (
            <div key={ i } className="flex flex-col items-center flex-shrink-0">
              <Skeleton className="w-20 h-20 rounded-full mb-2"/>
              <Skeleton className="h-3 w-16"/>
            </div>
          ) ) }
        </div>
        :
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex gap-4 overflow-x-auto pb-4">
            { data.map( ( history: any ) => (
              <HistoryCircle key={history.id} story={ history }/>
            ) )
            }
          </div>
        </div>
      }
    </>
  )
}