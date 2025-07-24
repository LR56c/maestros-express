import { Controller, useFormContext } from "react-hook-form"
import { getNestedErrorObject }       from "@/utils/get_nested_error_object"
import LocationDetector               from "@/components/form/location_detector"
import { Label }                      from "@/components/ui/label"
import React                          from "react"
import { Input }                      from "@/components/ui/input"

interface InputLocationDetectorProps {
  name: string,
  label: string,
}

export default function InputLocationDetector( {
  name,
  label
}: InputLocationDetectorProps )
{
  const { control, setValue, formState: { errors }, setError } = useFormContext()
  const errorMessage                                 = getNestedErrorObject(
    errors,
    name )?.message as string | undefined

  const handleLocation = ( location: {
    latitude: number,
    longitude: number
  } ) => {
    setValue( name, location )
  }

  const handleLocationError = ( error: string ) => {
    setValue( name, undefined )
    setError(name, {
      message: error
    })
  }

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={ name }>{ label }</Label>
      <Controller
        control={ control }
        name={ name }
        render={ ( { field: { value } } ) =>
          <div className="flex items-center gap-2">
            <Input disabled value={ value
              ? value
              : "Presione el boton para obtener ubicacion" }
                   type={ value ? "password" : "text" }/>
            <LocationDetector onError={handleLocationError } onLocationChange={ handleLocation }/>
          </div>
        }
      />
      {
        errorMessage
          ?
          <p className="text-red-500 text-sm">{ errorMessage }</p>
          : null
      }
    </div>
  )
}
