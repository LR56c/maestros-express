"use client"
import { Controller, useFormContext } from "react-hook-form"
import { Label }                      from "@/components/ui/label"
import { Textarea }                   from "@/components/ui/textarea"
import { getNestedErrorObject }       from "@/utils/get_nested_error_object"

interface InputTextAreaProps {
  placeholder?: string
  name: string
  label: string
}

export default function InputTextArea( {
  placeholder,
  name,
  label
}: InputTextAreaProps )
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
            <Label htmlFor={name}>{label}</Label>
            <Textarea
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