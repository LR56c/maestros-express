"use client"

import * as React          from "react"
import { useState }        from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button }                     from "@/components/ui/button"
import {
  Calendar
}                                     from "@/components/ui/calendar"
import { Label }                      from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
}                                     from "@/components/ui/popover"
import { Controller, useFormContext } from "react-hook-form"
import { getNestedErrorObject }       from "@/utils/get_nested_error_object"

interface DateInputProps {
  name: string
  placeholder?: string
  label: string
}

export function DateInput( {
  name,
  label,
  placeholder
}: DateInputProps )
{
  const { control, formState: { errors } } = useFormContext()
  const errorMessage                        = getNestedErrorObject( errors, name )?.message as string | undefined

  const [open, setOpen] = useState( false )

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor={ name } className="px-1">{ label }</Label>
      <Controller
        control={ control }
        name={ name }
        render={ ( { field: { value, onChange } } ) =>
          <Popover open={ open } onOpenChange={ setOpen }>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-full justify-between font-normal"
              >
                { value ? value : placeholder }
                <ChevronDownIcon/>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0"
                            align="end">
              <Calendar
                mode="single"
                selected={ value }
                captionLayout="dropdown"
                onSelect={ ( date ) => {
                  const part =  date ? date.toISOString().split( "T" )[0] : ""
                  onChange( part )
                  setOpen( false )
                } }
              />
            </PopoverContent>
          </Popover>
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
