import React, { createContext, ReactNode, useContext } from "react"

import { WorkerRequest }               from "@/modules/worker/application/worker_request"
import {
  UploadFileRepository
}                                      from "@/modules/shared/domain/upload_file_repository"
import {
  SupabaseFileUploadData
}                                      from "@/modules/shared/infrastructure/supabase_file_upload_data"
import { createClient }                from "@/utils/supabase/client"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import { wrapTypeAsync }               from "@/modules/shared/utils/wrap_type"
import {
  CertificateDTO
}                                      from "@/modules/certificate/application/certificate_dto"
import {
  StoryDTO
}                                      from "@/modules/story/application/story_dto"
import {
  ValidUploadDocumentDTO
}                                      from "@/modules/shared/application/valid_document_dto"
import {
  UUID
}                                      from "@/modules/shared/domain/value_objects/uuid"
import {
  UserResponse
}                                      from "@/modules/user/application/models/user_response"
import {
  StoryDocumentDTO
}                                      from "@/modules/story/modules/story_document/application/story_document_dto"
import { WorkerExtra }                 from "@/utils/worker_extra"


interface WorkerContextType {
  updateWorker: ( workerUser: UserResponse,
    workerExtra: any ) => Promise<boolean>
  createWorker: ( worker: WorkerRequest ) => Promise<boolean>
}

const uploader: UploadFileRepository = new SupabaseFileUploadData(
  createClient() )
const WorkerContext                  = createContext<WorkerContextType | undefined>(
  undefined )

const uploadDocument = async ( repo: UploadFileRepository,
  documents: File[] ): Promise<Either<string[], ValidUploadDocumentDTO[]>> => {
  const namesAdded: string[] = []

  try {
    const uploadPromises: Promise<ValidUploadDocumentDTO>[] = documents.map(
      async ( file ) => {
        const name   = `${ Date.now() }-${ file.name }`
        const format = file.type.split( "/" )[1]
        const type   = file.type.split( "/" )[0]

        const result = await wrapTypeAsync( () => repo.add( name, file ) )

        if ( result instanceof BaseException ) {
          throw result
        }
        namesAdded.push( name )
        return {
          type,
          url: result,
          name,
          format
        }
      } )

    return right( await Promise.all( uploadPromises ) )
  }
  catch ( error ) {
    return left( namesAdded )
  }
}

const processData           = async ( workerUser: UserResponse,
  workerExtra: any ): Promise<Either<string[], WorkerExtra>> => {
  const namesAdded: string[] = []

  const certificates: CertificateDTO[] = []
  const stories: StoryDTO[]            = []

  const certificatesResult = await uploadDocument( uploader,
    workerExtra.certificates )

  if ( isLeft( certificatesResult ) ) {
    namesAdded.push( ...certificatesResult.left )
  }
  else {
    for ( const cert of certificatesResult.right ) {
      certificates.push( {
        id       : UUID.create().toString(),
        worker_id: workerUser.user_id,
        name     : cert.name,
        url      : cert.url,
        type     : cert.type
      } )
    }
  }

  for ( const story of workerExtra.stories ) {
    const docResult = await uploadDocument( uploader, story.documents )

    if ( isLeft( docResult ) ) {
      namesAdded.push( ...docResult.left )
      break
    }
    else {
      const docs: StoryDocumentDTO[] = []
      for ( const doc of docResult.right ) {
        docs.push( {
          id  : UUID.create().toString(),
          name: doc.name,
          url : doc.url,
          type: doc.type
        } )
      }
      const storyDTO: StoryDTO = {
        ...story,
        documents: docs
      }
      stories.push( storyDTO )
    }
  }
  console.log( "Names added during upload:", namesAdded )
  if ( namesAdded.length > 0 ) {
    return left( namesAdded )
  }
  return right( {
      user        : workerUser,
      status      : "PENDING",
      specialities: workerExtra.specialities,
      taxes       : workerExtra.taxes,
      zones       : workerExtra.zones,
      certificates,
      stories,
      schedules   : workerExtra.schedules
    }
  )
}
export const WorkerProvider = ( { children }: { children: ReactNode } ) => {

  const updateWorker = async ( workerUser: UserResponse, workerExtra: any ) => {

    const processResult = await processData( workerUser, workerExtra )

    if ( isLeft( processResult ) ) {
      const removeResult = await wrapTypeAsync(
        () => uploader.remove( processResult.left ) )

      if ( removeResult instanceof BaseException ) {
        console.error( "Error removing" )
      }
      return false
    }

    const updateData: WorkerExtra = processResult.right
    const response                = await fetch( "/api/o/worker", {
      method : "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body   : JSON.stringify( updateData )
    } )
    if ( !response.ok ) {
      const failedNames: string[] = []
      failedNames.push( ...(
        updateData.certificates
          ? updateData.certificates.map( e => e.name )
          : []
      ) )
      failedNames.push( ...(
        updateData.stories
          ? updateData.stories.flatMap( s => s.documents.map( d => d.name ) )
          : []
      ) )
      const failedResult = await wrapTypeAsync(
        () => uploader.remove( failedNames ) )

      if ( failedResult instanceof BaseException ) {
        console.log( "Failed remove" )
      }
      return false
    }
    // const data = await response.json()
    // console.log( "Worker updated successfully:", data )
    return true
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
    console.log( "Worker created successfully:", data )
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