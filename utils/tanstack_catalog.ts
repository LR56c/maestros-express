import { SectorDTO } from "@/modules/sector/application/sector_dto"

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
