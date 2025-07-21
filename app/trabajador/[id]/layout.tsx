import React, { ReactNode }                   from "react"
import { Button }                             from "@/components/ui/button"
import Link                                   from "next/link"
import { searchWorker, searchWorkerSchedule } from "@/app/api/dependencies"
import { isLeft }                             from "fp-ts/Either"
import WorkerTabs                             from "@/components/worker_tabs"
import {
  TransformWorkerProfile
}                                             from "@/modules/worker/application/transform_worker_profile"
import {
  WorkerScheduleMapper
}                                             from "@/modules/worker_schedule/application/worker_schedule_mapper"
import CalendarSchedule
                                              from "@/components/form/calendar_schedule/calendar_schedule"
import {
  RequestChatDialog
}                                             from "@/components/request_chat_dialog"
import { createClientServer }                 from "@/utils/supabase/server"
import { redirect }                           from "next/navigation"

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

  const sup                = await createClientServer()
  const { data: { user } } = await sup.auth.getUser()

  if ( !user ) {
    return redirect( "/" )
  }

  const workerResult = await (
    await searchWorker()
  ).execute( { id }, 1 )

  if ( isLeft( workerResult ) ) {
    return redirect( "/404" )
  }

  const schedulesResult = await (
    await searchWorkerSchedule()
  ).execute( { "worker_id": id } )

  if ( isLeft( schedulesResult ) ) {
    return redirect( "/404" )
  }

  const schedules = schedulesResult.right.map( WorkerScheduleMapper.toDTO )

  const transformProfile = new TransformWorkerProfile()
  const transformResult  = await transformProfile.execute(
    workerResult.right.items )

  if ( isLeft( transformResult ) ) {
    return redirect( "/404" )
  }

  const workers = transformResult.right

  if ( workers.length === 0 ) {
    return redirect( "/404" )
  }

  const worker = workers[0]
  return (
    <>
      <div className="flex justify-center p-4 w-full h-full">
        <div className="flex flex-col max-w-md gap-2">
          <div className="flex gap-4 items-center">
            <div
              className="size-24 rounded-full bg-muted flex items-center justify-center">
              <img
                src={ worker.avatar }
                alt={ worker.full_name }
                className="rounded-full object-cover w-full h-full"/>
            </div>
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
          {
            worker.review_count === 0 ? null : <p>
              { worker.review_average.toFixed( 1 ) } estrellas
              ({ worker.review_count } reseñas)
            </p>
          }
          <p>{ worker.description }</p>
          <CalendarSchedule
            canEdit={ false }
            schedules={ schedules }
            placeholder="Ver horario"
            visibleDays={ 3 }
          />
          <RequestChatDialog
            workerId={ worker.user_id }
            clientId={ user.id }
          />
          <p>historias</p>
          <Link
            href={ `/historia/202fd6db-482f-4aac-b118-957f4ddba7e3` }>historia</Link>
          <WorkerTabs worker={ worker }/>
          { children }
        </div>
      </div>
      { story }
    </>
  )
}
