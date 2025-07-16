import React, { ReactNode } from "react"
import { Button }           from "@/components/ui/button"
import Link                 from "next/link"
import { searchWorker }     from "@/app/api/dependencies"
import { isLeft }           from "fp-ts/Either"
import WorkerTabs           from "@/components/worker_tabs"

export default async function TrabajadorLayout( {
  children,
  story,
  params
}: {
  children: ReactNode;
  story: ReactNode;
  params: Promise<{
    id: string
  }>
} )
{
  const { id } = await params

  const result = await (
    await searchWorker()
  ).execute( { id }, 1 )

  if ( isLeft( result ) ) {
    throw new Error( "Worker not found" )
  }

  const workers = result.right

  if ( workers.length === 0 ) {
    throw new Error( "Worker not found" )
  }

  const worker = workers[0]
  console.log("Worker data:", worker)
  return (
    <>
      <div className="flex justify-center p-4 w-full h-full">
        <div className="flex flex-col max-w-sm gap-2">
          <div className="flex gap-4 items-center">
            { worker.avatar ?
              <img
                className="w-16 h-16 rounded-full object-cover"
              /> : null
            }
            <div className="flex flex-col gap-4">
              <p className="capitalize">{ worker.full_name }</p>
              { worker.specialities.length > 0 ? worker.specialities.map(
                ( speciality ) =>
                  <Button key={ speciality.id } size="sm" variant="secondary">
                    <span className="text-xs">{ speciality.name }</span>
                  </Button>
              ) : null
              }
            </div>
          </div>
          <p>
            { worker.review_average.toFixed( 1 ) } estrellas
            ({ worker.review_count } reseñas)
          </p>
          <p>{ worker.description }</p>
          <Button>solicitud</Button>
          <Button>agendar</Button>
          <p>historias</p>
          <Link
            href={ `/historia/202fd6db-482f-4aac-b118-957f4ddba7e3` }>historia</Link>
          <WorkerTabs worker={worker}/>
          { children }
        </div>
      </div>
      { story }
    </>
  )
}
