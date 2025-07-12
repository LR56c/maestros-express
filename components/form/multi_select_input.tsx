"use client"

import React              from "react"
import { HelpCircle }     from "lucide-react"
import { useFormContext } from "react-hook-form"
import {
  getNestedErrorObject
}                         from "@/utils/get_nested_error_object"
import { Label }          from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
}                         from "@/components/ui/tooltip"
import MultiSelect        from "@/components/form/multi_select"

export interface MultiSelectInputValue {
  label: string
  group?: string // group is now optional
  value: any
}

interface MultiSelectInputProps {
  values: MultiSelectInputValue[]
  label: string
  name: string
  loading: boolean
  placeholder: string
  helperText?: string
  onChange?: ( values: any[] ) => void
  searchPlaceholder: string
  placeholderLoader: string
}

export default function MultiSelectInput( {
  name,
  placeholder,
  label,
  helperText,
  onChange,
  values,
  loading,
  placeholderLoader,
  searchPlaceholder
}: MultiSelectInputProps )
{
  const { formState: { errors }, setValue } = useFormContext()
  const errorMessage                        = getNestedErrorObject( errors,
    name )?.message as string | undefined


  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2">
        <Label className="font-semibold" htmlFor={ name }>{ label }</Label>
        { helperText ?
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground"/>
            </TooltipTrigger>
            <TooltipContent>
              <p>{ helperText }</p>
            </TooltipContent>
          </Tooltip>
          : null }
      </div>
      <MultiSelect
        values={ values } loading={ loading } placeholder={ placeholder }
        onChange={ ( values ) => onChange ? onChange( values ) : setValue( name, values )}
        searchPlaceholder={ searchPlaceholder }
        placeholderLoader={ placeholderLoader }/>
      {
        errorMessage
          ?
          <p className="text-red-500 text-sm">{ errorMessage }</p>
          : null
      }
    </div>
  )
}
