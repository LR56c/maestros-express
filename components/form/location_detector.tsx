import React, { useCallback, useState }               from "react"
import {
  Button
}                                                     from "@/components/ui/button"
import { Check, LoaderCircle, MapPin, TriangleAlert } from "lucide-react"

interface LocationDetectorProps {
  onLocationChange?: ( location: {
    latitude: number,
    longitude: number
  } ) => void
  onError?: ( error: string ) => void
}

export default function LocationDetector( {
  onLocationChange, onError
}: LocationDetectorProps )
{
  const [location, setLocation] = useState<any | null>( null )
  const [error, setError]       = useState<string | null>( null )
  const [loading, setLoading]   = useState<boolean>( false )

  const requestLocation = useCallback( () => {

    setLoading( true )
    setError( null )
    setLocation( null )
    if ( !navigator.geolocation ) {
      setError( "Tu navegador no soporta la geolocalización." )
      setLoading( false )
      return
    }

    const successHandler = ( position: GeolocationPosition ) => {
      setLocation( {
        latitude : position.coords.latitude,
        longitude: position.coords.longitude
      } )
      setError( null )
      setLoading( false )
      onLocationChange?.( {
        latitude : position.coords.latitude,
        longitude: position.coords.longitude
      } )
    }

    const errorHandler = ( err: GeolocationPositionError ) => {
      let errorMessage: string
      if ( err.code === err.TIMEOUT ) {
        errorMessage = "Vuelva a intentarlo. Tiempo de espera agotado"
      }
      else {
        errorMessage =
          "No se pudo obtener la ubicación. Debes cambiarlo manualmente en la configuración de privacidad de tu navegador para este sitio web"
      }
      setError( errorMessage )
      setLocation( null )
      setLoading( false )
      onError?.( errorMessage )
    }

    const options = {
      enableHighAccuracy: true,
      timeout           : 5000,
      maximumAge        : 0
    }
    navigator.geolocation.getCurrentPosition( successHandler, errorHandler,
      options )
  }, [] )

  if ( error ) {
    return (
      <Button className="w-10 h-10 rounded-xl">
        <TriangleAlert/>
      </Button>
    )
  }

  if ( !location ) {
    return (
      <Button className="w-10 h-10 rounded-xl" onClick={ requestLocation }
              disabled={ loading }>
        { loading ? <LoaderCircle className={loading ? "animate-spin" : ""}/> : <MapPin/> }
      </Button>
    )
  }

  return (
    <Button className="w-10 h-10 rounded-xl">
      <Check/>
    </Button>
  )
}
