import { WorkerResponse }                              from "@/modules/worker/application/worker_response"
import React, { createContext, ReactNode, useContext } from "react"

import { WorkerRequest } from "@/modules/worker/application/worker_request"

interface WorkerContextType {
  updateWorker: ( worker: WorkerResponse ) => Promise<void>
  createWorker: ( worker: WorkerRequest ) => Promise<boolean>
}

const WorkerContext = createContext<WorkerContextType | undefined>( undefined )

export const WorkerProvider = ( { children }: { children: ReactNode } ) => {

  const updateWorker = async ( worker: WorkerResponse ) => {
    const response = await fetch( "/api/worker", {
      method : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body   : JSON.stringify( worker )
    } )
    if ( !response.ok ) {
      return
    }
    const data = await response.json()
  }

  const createWorker = async ( worker: WorkerRequest ): Promise<boolean> => {
    const response = await fetch( "/api/worker", {
      method : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body   : JSON.stringify( worker )
    } )
    if ( !response.ok ) {
      return false
    }
    const data = await response.json()
    return true
  }

  return (
    <WorkerContext.Provider value={
      {
        updateWorker,
        createWorker
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