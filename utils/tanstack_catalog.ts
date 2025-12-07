import { SectorDTO } from "@/modules/sector/application/sector_dto"
import { SpecialityDTO } from "@/modules/speciality/application/speciality_dto"
import { MultiSelectInputValue } from "@/components/form/multi_select_input"
import {
  WorkerProfileDTO
} from "@/modules/worker/application/worker_profile_dto"
import { UserResponse } from "@/modules/user/application/models/user_response"
import { getUrl } from "@/utils/get_url"

export const currencyOption = {
  queryKey: ["currency"],
  queryFn : async () => {
    const response = await fetch( "/api/currency", { method: "GET" } )
    if ( !response.ok ) {
      throw new Error( "Error fetching countries" )
    }
    return await response.json()
  }
}

export const sectorsOption = {
  queryKey: ["sectors"],
  queryFn : async () => {
    const response = await fetch( "/api/sector", { method: "GET" } )
    if ( !response.ok ) {
      throw new Error( "Error fetching countries" )
    }
    return await response.json()
  }
}


export const storyOptions = ( id: string ) => (
  {
    queryKey: ["story", id],
    queryFn : async () => {
      const params = new URLSearchParams()
      params.append( "id", id )
      const response = await fetch( `/api/story?${ params.toString() }`,
        { method: "GET" } )
      if ( !response.ok ) {
        throw new Error( "Error fetching story" )
      }
      return await response.json()
    }
  }
)


export const storiesOptions = ( id: string ) => (
  {
    queryKey: ["stories_worker", id],
    queryFn : async () => {
      const params = new URLSearchParams()
      params.append( "id", id )
      const response = await fetch( `/api/stories?${ params.toString() }`,
        { method: "GET" } )
      if ( !response.ok ) {
        throw new Error( "Error fetching stories" )
      }
      return await response.json()
    }
  }
)


export const regionsOption = {
  queryKey: ["regions"],
  queryFn : async () => {
    const response = await fetch( "/api/region", { method: "GET" } )
    if ( !response.ok ) {
      throw new Error( "Error fetching regions" )
    }
    return await response.json()
  }
}


export const countriesOption = {
  queryKey: ["countries"],
  queryFn : async () => {
    const response = await fetch( "/api/country", { method: "GET" } )
    if ( !response.ok ) {
      throw new Error( "Error fetching countries" )
    }
    return await response.json()
  }
}

export const specialitiesOption = {
  queryKey: ["specialities"],
  queryFn : async () => {
    const response = await fetch( "/api/speciality", { method: "GET" } )
    if ( !response.ok ) {
      throw new Error( "Error fetching specialities" )
    }
    return await response.json()
  }
}

export const parseSpecialities = ( data: SpecialityDTO[] ): MultiSelectInputValue[] => data.map(
  ( speciality ) => (
    {
      label: speciality.name,
      value: speciality
    }
  ) )

export const getWorker = async (id : string) => {
  const params = new URLSearchParams();
  params.append( "id", id );
  params.append( "limit", "1" );
  const response = await fetch( `/api/worker/?${params.toString()}`, { method: "GET" , } )
  if ( !response.ok ) {
    throw new Error( "Error fetching workers" )
  }
  const result = await response.json() as WorkerProfileDTO[]
  if ( result.length === 0 ) {
    throw new Error( "Worker not found" )
  }
  return result[0]
}
