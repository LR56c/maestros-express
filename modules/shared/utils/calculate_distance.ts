import { getDistance } from "geolib"
import { LatLng }      from "@/modules/shared/domain/value_objects/position"

export const  calculateDistance=( origin: LatLng, target: LatLng ): string =>{
  const meters = getDistance( origin, target )
  // const kilometers = `${(meters / 1000).toFixed( 2 )} km`
 if( meters > 100_000 ) {
    return '100 km'
  }
  if( meters > 50_000 ) {
    return '50 km'
  }
  if( meters > 10_000 ) {
    return '10 km'
  }
  else{
    return 'cerca de ti'
  }
}
