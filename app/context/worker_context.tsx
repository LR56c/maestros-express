import { WorkerResponse } from "@/modules/worker/application/worker_response"
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
}                         from "react"
import {
  useAuthContext
}                         from "@/app/context/auth_context"

import { WorkerRequest }  from "@/modules/worker/application/worker_request"

interface WorkerContextType {
  worker?: WorkerResponse
  updateWorker: ( worker: WorkerResponse ) => Promise<void>
  createWorker: ( worker: WorkerRequest ) => Promise<boolean>
}

const WorkerContext = createContext<WorkerContextType | undefined>( undefined )

export const WorkerProvider = ( { children }: { children: ReactNode } ) => {
  const [worker, setWorker] = useState<WorkerResponse | undefined>( undefined )

  // const router   = useRouter()
  const { user } = useAuthContext()

  useEffect( () => {
    if ( !user || user.role !== "worker" ) return
    console.log("WorkerProvider: user", user )
  }, [user] )

  const updateWorker = async ( worker: WorkerResponse ) => {
    const response = await fetch('/api/worker',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(worker),
    })
    if ( !response.ok ) {
      console.error( "Failed to update worker", response.statusText )
      return
    }
    const data = await response.json()
    console.log("WorkerProvider: updateWorker", data )
  }

  const createWorker= async ( worker: WorkerRequest ) : Promise<boolean>  => {
    const response = await fetch('/api/worker',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(worker),
    })
    if ( !response.ok ) {
      console.error( "Failed to create worker", response.statusText )
      return false
    }
    const data = await response.json()
    console.log("WorkerProvider: createWorker", data )
    return true
  }

  return (
    <WorkerContext.Provider value={
      {
        worker,
        updateWorker,
        createWorker,
      }
    }>
      { children }
    </WorkerContext.Provider>
  )
}

export const useWorkerContext = () => {
  const context = useContext( WorkerContext )
  if ( !context ) {
    throw new Error( "useWorkerContext must be used within a WorkerProvider" )
  }
  return context
}