import { SectorDTO } from "@/modules/sector/application/sector_dto"
import { SpecialityDTO } from "@/modules/speciality/application/speciality_dto"
import { MultiSelectInputValue } from "@/components/form/multi_select_input"
import {
  WorkerProfileDTO
} from "@/modules/worker/application/worker_profile_dto"
import { UserResponse } from "@/modules/user/application/models/user_response"
import { getUrl } from "@/utils/get_url"

export const sectorsOption = {
  queryKey: ["sectors"],
  queryFn : async () => {
    const response = await fetch( "/api/sector", { method: "GET" } )
    if ( !response.ok ) {
      throw new Error( "Error fetching countries" )
    }
    return await response.json() as SectorDTO[]
  }
}


export const specialitiesOption = {
  queryKey: ["specialities"],
  queryFn : async () => {
    const response = await fetch( "/api/speciality", { method: "GET" } )
    if ( !response.ok ) {
      throw new Error( "Error fetching countries" )
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

export const getUser = async (id : string) => {
  const params = new URLSearchParams();
  params.append( "id", id );
  params.append( "limit", "1" );
  const response = await fetch( `/api/user/?${params.toString()}`, { method: "GET" } )
  if ( !response.ok ) {
    throw new Error( "Error fetching users" )
  }
  const result = await response.json() as UserResponse[]
  if ( result.length === 0 ) {
    throw new Error( "User not found" )
  }
  return result[0]
}

export const getWorker = async (id : string) => {
  const params = new URLSearchParams();
  params.append( "id", id );
  params.append( "limit", "1" );
  const response = await fetch( `/api/worker/?${params.toString()}`, { method: "GET" ,

  } )
  if ( !response.ok ) {
    throw new Error( "Error fetching workers" )
  }
  const result = await response.json() as WorkerProfileDTO[]
  if ( result.length === 0 ) {
    throw new Error( "Worker not found" )
  }
  return result[0]
}
