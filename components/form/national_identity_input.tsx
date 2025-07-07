"use client"
import { useFormContext }          from "react-hook-form"
import { Input }                   from "@/components/ui/input"
import { Label }                   from "@/components/ui/label"
import { clean, format, validate } from "rut.js"
import { useEffect, useState }     from "react"
import { getNestedErrorObject }    from "@/utils/get_nested_error_object"
import {
  NationalIdentityFormatDTO
}                                  from "@/modules/national_identity_format/application/national_identity_format_dto"

interface NationalIdentityInputProps {
  name: string
  label: string
  format: NationalIdentityFormatDTO | null
  disabled: boolean,
  loading: boolean,
  loaderPlaceholder?: string,
  placeholder?: string,
}

interface IdentityStrategy {
  validate: ( val: string ) => boolean;
  format: ( val: string ) => string;
  clean: ( val: string ) => string;
}

function getRunStrategy(): IdentityStrategy {
  return {
    validate: ( val: string ) => validate( val ),
    format  : ( val: string ) => format( val ),
    clean   : ( val: string ) => format( val,{
      dots: false
    } )
  }
}

function getIdentityStrategy( format: NationalIdentityFormatDTO | null ): IdentityStrategy | null {
  if ( !format ) return null
  switch ( format.name ) {
    case "RUT":
      return getRunStrategy()
    default:
      return null
  }
}

export default function NationalIdentityInput( {
  format: identityFormat,
  name,
  label,
  disabled,
  loading,
  placeholder,
  loaderPlaceholder
}: NationalIdentityInputProps )
{
  const { formState: { errors }, setValue } = useFormContext()
  const [inputValue, setInputValue]         = useState( "" )
  const errorMessage                        = getNestedErrorObject( errors,
    name )?.message as string | undefined

  const identityHandlers = getIdentityStrategy( identityFormat )
  useEffect( () => {
    if ( !identityHandlers ) return
    const handler = setTimeout( () => {
      if ( identityHandlers.validate( inputValue ) ) {
        const inputClean = identityHandlers.clean( inputValue )
        setValue( name, inputClean )
        const inputFormat = identityHandlers.format( inputValue )
        setInputValue( inputFormat )
      }
      else {
        setValue( name, "" )
      }
    }, 1000 )
    return () => clearTimeout( handler )
  }, [inputValue, name, setValue, identityHandlers] )

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={ name }>
        { label } { identityFormat
        ? `(${ identityFormat.name.toUpperCase() })`
        : "" }
      </Label>
      <Input
        id={ name }
        name={ name }
        placeholder={ identityFormat ? placeholder : loaderPlaceholder }
        disabled={ disabled }
        value={ loading ? "Cargando..." : inputValue }
        onChange={ e => setInputValue( e.target.value ) }
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