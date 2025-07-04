"use client"
import { useFormContext }          from "react-hook-form"
import { Input }                   from "@/components/ui/input"
import { Label }                   from "@/components/ui/label"
import { clean, format, validate } from "rut.js"
import { useEffect, useState }     from "react"
import { getNestedErrorObject }    from "@/utils/get_nested_error_object"

interface NationalIdentityInputProps {
  name: string
  label: string
  type: string
}

export default function NationalIdentityInput( {
  type = "rut",
  name,
  label
}: NationalIdentityInputProps )
{
  const { formState: { errors }, setValue } = useFormContext()
  const [inputValue, setInputValue]         = useState( "" )
  const errorMessage                        = getNestedErrorObject( errors, name )?.message as string | undefined

  useEffect( () => {
    const handler = setTimeout( () => {
      if ( validate( inputValue ) ) {
        const inputFormat = format( inputValue )
        setValue( name, inputFormat )
        setInputValue( inputFormat )
      }
      else {
        setValue( name, "" )
      }
    }, 1000 )
    return () => clearTimeout( handler )
  }, [inputValue, name, setValue] )

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={ name }>
        { label } ({ type.toUpperCase() })
      </Label>
      <Input
        id={ name }
        name={ name }
        value={ inputValue }
        onChange={ e => setInputValue( clean( e.target.value ) ) }
        type="text"
        autoComplete="off"
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