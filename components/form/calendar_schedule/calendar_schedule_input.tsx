"use client"
import React from "react"
import {
  useFormContext
}            from "react-hook-form"
import {
  Label
}            from "@/components/ui/label"
import {
  HelpCircle
}            from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
}            from "@/components/ui/tooltip"
import CalendarSchedule
             from "@/components/form/calendar_schedule/calendar_schedule"
import {
  getNestedErrorObject
}            from "@/utils/get_nested_error_object"

interface Horario {
  id: string
  week_day: number
  status: string
  start_date: string // datetime string
  end_date: string // datetime string
  recurrent_start_date?: string // datetime string optional
  recurrent_end_date?: string // datetime string optional
}

interface CalendarScheduleInputProps {
  name: string
  label: string
  placeholder?: string
  tooltip?: string
  visibleDays?: number
}

export default function CalendarScheduleInput( {
  name,
  label,
  placeholder = "Gestionar mi horario",
  tooltip,
  visibleDays = 3
}: CalendarScheduleInputProps )
{

  const { watch, setValue, formState: { errors } } = useFormContext()
  const errorMessage                               = getNestedErrorObject(
    errors, name )?.message as string | undefined
  const schedules                                  = (
    watch( name ) as Horario[]
  ) || []


  return (
    <TooltipProvider>
      <div className="space-y-2">
        {/* Header */ }
        <div className="flex items-center gap-2">
          <Label className="font-semibold">{ label }</Label>
          { tooltip && (
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground"/>
              </TooltipTrigger>
              <TooltipContent>
                <p>{ tooltip }</p>
              </TooltipContent>
            </Tooltip>
          ) }
        </div>
        <CalendarSchedule
          canEdit={ true }
          schedules={ schedules }
          placeholder={ placeholder }
          onChange={ values => setValue( name, values ) }
          visibleDays={ visibleDays }
        />
        {
          errorMessage
            ?
            <p className="text-red-500 text-sm">{ errorMessage }</p>
            : null
        }

      </div>
    </TooltipProvider>
  )
}
