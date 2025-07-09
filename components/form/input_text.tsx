"use client"
import { Controller, useFormContext } from "react-hook-form"
import { Input }                      from "@/components/ui/input"
import { Label }                      from "@/components/ui/label"
import { getNestedErrorObject }       from "@/utils/get_nested_error_object"

interface InputTextProps {
  placeholder?: string
  name: string
  label: string
  type: "text" | "email" | "password" | "number"
}

export default function InputText( {
  placeholder,
  type,
  name,
  label
}: InputTextProps )
{
  const { control, formState: { errors } } = useFormContext()
  const errorMessage                        = getNestedErrorObject( errors, name )?.message as string | undefined


  return (
    <>
      <Controller
        control={ control }
        name={ name }
        render={ ( { field: { value, onBlur, onChange } } ) =>
          <div className="flex flex-col gap-1">
            <Label className="font-semibold" htmlFor={name}>{label}</Label>
            <Input type={ type }
                   placeholder={ placeholder }
                   value={ value }
                   onBlur={ onBlur }
                   onChange={ onChange }/>
          </div>
        }
      />
      {
        errorMessage
          ?
          <p className="text-red-500 text-sm">{ errorMessage }</p>
          : null
      }
    </>
  )
}