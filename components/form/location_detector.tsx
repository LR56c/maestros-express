import React, { useCallback, useState } from "react"
import { Button }                       from "@/components/ui/button"
import { Label }                        from "@/components/ui/label"

interface LocationDetectorProps {
  name: string,
  label: string,
  onLocationChange?: ( location: {
    latitude: number,
    longitude: number
  } ) => void
}

export default function LocationDetector( {
  onLocationChange,
  name,
  label
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
      if ( err.code === err.TIMEOUT ) {
        setError(
          "Vuelva a intentarlo. Tiempo de espera agotado" )
      }
      else {
        setError(
          "No se pudo obtener la ubicación. Debes cambiarlo manualmente en la configuración de privacidad de tu navegador para este sitio web" )
      }
      setLocation( null )
      setLoading( false )
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
      <div className="flex flex-col gap-1">
        <Label htmlFor={ name }>{ label }</Label>
        <p className="text-red-500 text-sm">{ error }</p>
        <Button className="w-48" onClick={ requestLocation } disabled={ loading }>
          { loading ? "Reintentando..." : "Reintentar" }
        </Button>
      </div>
    )
  }

  if ( !location ) {
    return (
      <div className="flex flex-col gap-1">
        <Label htmlFor={ name }>{ label }</Label>
        <Button className="w-48" onClick={ requestLocation } disabled={ loading }>
          { loading ? "Obteniendo..." : "Detectar ubicación" }
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={ name }>{ label }</Label>
      <p>Ubicacion establecida</p>
    </div>
  )
}
