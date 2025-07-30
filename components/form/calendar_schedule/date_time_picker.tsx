"use client"

import * as React              from "react"
import { useEffect, useState } from "react"
import { format }              from "date-fns"
import { es }                  from "date-fns/locale"
import { CalendarIcon, Clock } from "lucide-react"
import { cn }                  from "@/lib/utils"
import { Button }              from "@/components/ui/button"
import {
  Calendar
}                              from "@/components/ui/calendar"
import { Input }               from "@/components/ui/input"
import { Label }               from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
}                              from "@/components/ui/popover"
import {
  formatLocalDateTime
}                              from "@/modules/shared/utils/format_date_time"

interface DateTimePickerProps {
  value?: string
  onChange?: (value: string) => void
  label?: string
  placeholder?: string
  disabled?: boolean
  min?: string
}

export function DateTimePicker({
  value,
  onChange,
  label,
  // placeholder,
  disabled = false,
  min,
}: DateTimePickerProps) {
  const [date, setDate] = useState<Date | undefined>()
  const [time, setTime] = useState<string>("09:00")

  // Sincronizar con el valor inicial
  useEffect(() => {
    if (value) {
      try {
        const dateValue = new Date(value)
        if (!isNaN(dateValue.getTime())) {
          setDate(dateValue)
          setTime(format(dateValue, "HH:mm"))
        }
      } catch (error) {
        console.error("Error parsing date:", error)
      }
    }
  }, [value])

  // Utilidad para formatear fecha local como yyyy-MM-ddTHH:mm

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate && onChange) {
      setDate(selectedDate)
      const [hours, minutes] = time.split(":")
      const newDateTime = new Date(selectedDate)
      newDateTime.setHours(Number.parseInt(hours), Number.parseInt(minutes))
      onChange(formatLocalDateTime(newDateTime))
    }
  }

  const handleTimeChange = (newTime: string) => {
    setTime(newTime)
    if (date && onChange) {
      const [hours, minutes] = newTime.split(":")
      const newDateTime = new Date(date)
      newDateTime.setHours(Number.parseInt(hours), Number.parseInt(minutes))
      onChange(formatLocalDateTime(newDateTime))
    }
  }

  const minDate = min ? new Date(min) : undefined

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex gap-2">
        {/* Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("flex-1 justify-start text-left font-normal", !date && "text-muted-foreground")}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "dd/MM/yyyy", { locale: es }) : "Fecha"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              disabled={(date) => (minDate ? date < minDate : false)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Time Picker */}
        <div className="flex items-center gap-2 flex-1">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <Input
            type="time"
            value={time}
            onChange={(e) => handleTimeChange(e.target.value)}
            disabled={disabled}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  )
}
