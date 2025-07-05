import { useFormContext }       from "react-hook-form"
import { getNestedErrorObject } from "@/utils/get_nested_error_object"
import LocationDetector         from "@/components/form/location_detector"

interface InputLocationDetectorProps {
  name: string,
  label: string,
}

export default function InputLocationDetector( {
  name,
  label
}: InputLocationDetectorProps ) {
  const { setValue, formState: { errors } } = useFormContext()
  const errorMessage                        = getNestedErrorObject( errors, name )?.message as string | undefined

  const handleLocation = ( location: {
    latitude: number,
    longitude: number
  } ) => {
    setValue(name, location)
  }
  return (
    <>
      <LocationDetector name={name} label={label} onLocationChange={handleLocation}/>
      {
        errorMessage
          ?
          <p className="text-red-500 text-sm">{ errorMessage }</p>
          : null
      }
    </>
  )
}
