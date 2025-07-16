"use client"
import { useParams } from "next/navigation"
import { useQuery }  from "@tanstack/react-query"
import { getWorker } from "@/utils/tanstack_catalog"

export function WorkerDetail()
{
  const params   = useParams()
  const { id }   = params
  const { data, isPending } = useQuery( {
    queryKey: ["worker", id],
    queryFn : () => getWorker( id as string ),
  } )
  return <div>tr id: { id } { JSON.stringify( data ) }</div>
}