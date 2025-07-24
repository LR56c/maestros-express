"use client"
import { useState }                                         from "react"
import {
  Button
}                                                           from "@/components/ui/button"
import {
  Label
}                                                           from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
}                                                           from "@/components/ui/dialog"
import {
  Card,
  CardContent
}                                                           from "@/components/ui/card"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit,
  HelpCircle,
  Plus,
  Trash2
}                                                           from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
}                                                           from "@/components/ui/tooltip"
import {
  Checkbox
}                                                           from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
}                                                           from "@/components/ui/popover"
import {
  Calendar as CalendarComponent
}                                                           from "@/components/ui/calendar"
import { addDays, addWeeks, format, startOfWeek, subWeeks } from "date-fns"
import {
  es
}                                                           from "date-fns/locale"
import {
  DateTimePicker
}                                                           from "@/components/form/calendar_schedule/date_time_picker"
import {
  UUID
}                                                           from "@/modules/shared/domain/value_objects/uuid"
import {
  formatLocalDateTime,
  makeLocalDate
}                                                           from "@/modules/shared/utils/format_date_time"
import {
  validateSameDay,
  validateSchedule
}                                                           from "@/modules/worker_schedule/utils/validation"

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
  schedules: Horario[]
  placeholder: string
  onChange?: ( schedules: Horario[] ) => void
  visibleDays?: number
  canEdit: boolean
}

export default function CalendarSchedule( {
  schedules,
  placeholder,
  onChange,
  visibleDays = 3,
  canEdit = false
}: CalendarScheduleInputProps )
{
  const [isScheduleModalOpen, setIsScheduleModalOpen]       = useState( false )
  const [isAddScheduleModalOpen, setIsAddScheduleModalOpen] = useState( false )
  const [editingSchedule, setEditingSchedule]               = useState<{
                                                                         schedule: Horario;
                                                                         index: number
                                                                       } | null>(
    null )
  const [currentWeekStart, setCurrentWeekStart]             = useState( 0 )

  // Nueva funcionalidad: navegación temporal
  const [currentWeekDate, setCurrentWeekDate]   = useState( new Date() )
  const [isWeekPickerOpen, setIsWeekPickerOpen] = useState( false )


  const [scheduleForm, setScheduleForm] = useState<Horario>( {
    id                  : "",
    week_day            : 0,
    status              : "active",
    start_date          : "",
    end_date            : "",
    recurrent_start_date: "",
    recurrent_end_date  : ""
  } )

  const [isRecurrent, setIsRecurrent]           = useState( false )
  const [validationErrors, setValidationErrors] = useState<string[]>( [] )

  const generateId = () => {
    return UUID.create().toString()
  }

  const handleOpenScheduleModal = () => {
    setIsScheduleModalOpen( true )
  }

  const handleAddNewSchedule = ( dayKey?: string, weekDay?: number ) => {
    if ( !canEdit ) return
    const today              = new Date()
    const defaultDate        = dayKey ||
      formatLocalDateTime( today ).split( "T" )[0]
    const defaultDateTime    = `${ defaultDate }T09:00`
    const defaultEndDateTime = `${ defaultDate }T10:00`

    setEditingSchedule( null )
    setIsRecurrent( false )
    setValidationErrors( [] )

    setScheduleForm( {
      id                  : generateId(),
      week_day            : weekDay || today.getDay(),
      status              : "active",
      start_date          : defaultDateTime,
      end_date            : defaultEndDateTime,
      recurrent_start_date: defaultDateTime,
      recurrent_end_date  : ""
    } )
    setIsAddScheduleModalOpen( true )
  }

  const handleEditSchedule = ( schedule: Horario, index: number ) => {
    if ( !canEdit ) return
    setEditingSchedule( { schedule, index } )
    setScheduleForm( schedule )
    setIsRecurrent( !!schedule.recurrent_start_date )
    setValidationErrors( [] )
    setIsAddScheduleModalOpen( true )
  }

  // Función para verificar si un horario recurrente aplica a una fecha específica
  const isRecurrentScheduleApplicable = ( schedule: Horario,
    targetDate: Date ) => {
    if ( !schedule.recurrent_start_date ) return false

    // targetDate **ya** debe venir en local; lo crearemos con makeLocalDate (ver §4)
    const dayToCheck = targetDate

    const recStart = makeLocalDate(
      schedule.recurrent_start_date.split( "T" )[0] )
    const recEnd   = schedule.recurrent_end_date
      ? makeLocalDate( schedule.recurrent_end_date.split( "T" )[0] )
      : undefined

    if ( dayToCheck < recStart ) return false
    if ( recEnd && dayToCheck > recEnd ) return false

    return dayToCheck.getDay() === schedule.week_day
  }


  const handleSaveSchedule = () => {
    if ( !canEdit ) return
    const scheduleToValidate = {
      ...scheduleForm,
      recurrent_start_date: isRecurrent
        ? scheduleForm.recurrent_start_date
        : undefined,
      recurrent_end_date  : isRecurrent && scheduleForm.recurrent_end_date
        ? scheduleForm.recurrent_end_date
        : undefined
    }

    const errors = validateSchedule(
      schedules,
      scheduleToValidate,
      { isRecurrent, excludeIndex: editingSchedule?.index }
    )
    if ( errors.length ) {
      setValidationErrors( errors )
      return
    }

    const currentSchedules = [...schedules]

    if ( editingSchedule ) {
      currentSchedules[editingSchedule.index] = scheduleToValidate
    }
    else {
      currentSchedules.push( scheduleToValidate )
    }

    onChange?.( currentSchedules )
    setIsAddScheduleModalOpen( false )
    setEditingSchedule( null )
    setValidationErrors( [] )
  }

  const handleDeleteSchedule = ( index?: number ) => {
    if ( !canEdit ) return
    const currentSchedules = [...schedules]
    const indexToDelete    = index !== undefined
      ? index
      : editingSchedule?.index

    if ( indexToDelete !== undefined ) {
      currentSchedules.splice( indexToDelete, 1 )
      onChange?.( currentSchedules )
    }

    if ( index === undefined ) {
      setIsAddScheduleModalOpen( false )
      setEditingSchedule( null )
    }
  }

  // Nueva función: obtener días de la semana basada en currentWeekDate
  const getWeekDays = () => {
    const days      = []
    const weekStart = startOfWeek( currentWeekDate, { weekStartsOn: 1 } ) // Lunes como primer día

    for ( let i = 0; i < 7; i++ ) {
      const day = addDays( weekStart, i )
      days.push( day )
    }
    return days
  }

  const formatDate = ( date: Date ) => {
    const days   = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"]
    const months = [
      "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct",
      "Nov", "Dic"
    ]
    return {
      day : days[date.getDay()],
      date: `${ date.getDate() } ${ months[date.getMonth()] }`
    }
  }

  const formatDateKey = ( date: Date ) => {
    return formatLocalDateTime( date ).split( "T" )[0]
  }

  const formatTimeFromDateTime = ( dateTimeString: string ) => {
    if ( !dateTimeString ) return "00:00"
    const date = new Date( dateTimeString )
    return formatLocalDateTime( date ).split( "T" )[1].slice( 0, 5 )
  }

  // Navegación temporal mejorada
  const navigateWeeks = ( direction: "prev" | "next" ) => {
    if ( direction === "next" ) {
      setCurrentWeekDate( addWeeks( currentWeekDate, 1 ) )
    }
    else {
      setCurrentWeekDate( subWeeks( currentWeekDate, 1 ) )
    }
  }

  const navigateDays = ( direction: "prev" | "next" ) => {
    const maxStart = 7 - visibleDays
    if ( direction === "next" && currentWeekStart < maxStart ) {
      setCurrentWeekStart( currentWeekStart + 1 )
    }
    else if ( direction === "prev" && currentWeekStart > 0 ) {
      setCurrentWeekStart( currentWeekStart - 1 )
    }
  }

  // Función para ir a una fecha específica
  const goToWeek = ( date: Date ) => {
    setCurrentWeekDate( date )
    setIsWeekPickerOpen( false )
  }

  // Función para ir a la semana actual
  const goToToday = () => {
    setCurrentWeekDate( new Date() )
    setCurrentWeekStart( 0 )
  }

  const getVisibleDays = () => {
    const weekDays = getWeekDays()
    return weekDays.slice( currentWeekStart, currentWeekStart + visibleDays )
                   .map( ( day, _ ) => (
                     {
                       day,
                       dateKey  : formatDateKey( day ),
                       formatted: formatDate( day ),
                       weekDay  : day.getDay()
                     }
                   ) )
  }

  const getSchedulesByVisibleDays = () => {
    const visibleDaysData = getVisibleDays()

    return visibleDaysData.map( ( dayData, _ ) => {
      const daySchedules = schedules
        .map( ( schedule, index ) => (
          { schedule, index }
        ) )
        .filter( ( { schedule } ) => {
          const scheduleDate = schedule.start_date.split( "T" )[0]
          const targetDate   = makeLocalDate( dayData.dateKey )   // ← aquí

          if ( schedule.recurrent_start_date ) {
            return isRecurrentScheduleApplicable( schedule, targetDate )
          }
          return scheduleDate === dayData.dateKey
        } )
        .sort( ( a, b ) => new Date( a.schedule.start_date ).getTime() -
          new Date( b.schedule.start_date ).getTime() )

      return {
        ...dayData,
        schedules: daySchedules
      }
    } )
  }

  const getGridColsClass = () => {
    const gridClasses = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
      7: "grid-cols-7"
    }
    return gridClasses[visibleDays as keyof typeof gridClasses] || "grid-cols-3"
  }

  // const getMaxWidthClass = () => {
  //   const widthClasses = {
  //     1: "max-w-xs",
  //     2: "max-w-sm",
  //     3: "max-w-md",
  //     4: "max-w-lg",
  //     5: "max-w-xl",
  //     6: "max-w-2xl",
  //     7: "max-w-4xl"
  //   }
  //   return widthClasses[visibleDays as keyof typeof widthClasses] || "max-w-md"
  // }

  // Actualizar fecha de fin cuando cambia la fecha de inicio para mantener el mismo día
  const handleStartDateChange = ( newStartDate: string ) => {
    if ( !canEdit ) return
    const startDate      = new Date( newStartDate )
    const currentEndDate = new Date( scheduleForm.end_date )

    // Si la fecha de fin es de un día diferente, actualizarla al mismo día que el inicio
    if ( scheduleForm.end_date &&
      !validateSameDay( newStartDate, scheduleForm.end_date ) )
    {
      const newEndDate = new Date( startDate )
      newEndDate.setHours( currentEndDate.getHours(),
        currentEndDate.getMinutes() )

      setScheduleForm( ( prev ) => (
        {
          ...prev,
          start_date: newStartDate,
          end_date  : formatLocalDateTime( newEndDate ).slice( 0, 16 ),
          week_day  : new Date( newStartDate ).getDay()
        }
      ) )
    }
    else {
      setScheduleForm( ( prev ) => (
        { ...prev, start_date: newStartDate }
      ) )
    }

    // Limpiar errores de validación cuando se cambian las fechas
    setValidationErrors( [] )
  }

  // Obtener el rango de fechas actual
  const getCurrentWeekRange = () => {
    const weekStart = startOfWeek( currentWeekDate, { weekStartsOn: 1 } )
    const weekEnd   = addDays( weekStart, 6 )
    return `${ format( weekStart, "dd MMM", { locale: es } ) } - ${ format(
      weekEnd, "dd MMM yyyy", { locale: es } ) }`
  }

  return (
    <>
      {/* Calendar Input Button */ }
      <Button
        type="button"
        variant="outline"
        className="w-full justify-start text-left font-normal bg-transparent"
        onClick={ handleOpenScheduleModal }
      >
        <Calendar className="mr-2 h-4 w-4"/>
        { placeholder }
      </Button>

      {/* Schedule Modal */ }
      <Dialog open={ isScheduleModalOpen }
              onOpenChange={ setIsScheduleModalOpen }>
        <DialogContent
          className="p-3 overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-4">
              <Button variant="ghost" size="icon"
                      onClick={ () => navigateWeeks( "prev" ) }>
                <ChevronLeft className="h-4 w-4"/>
              </Button>

              <Popover open={ isWeekPickerOpen }
                       onOpenChange={ setIsWeekPickerOpen }>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                      <span
                        className="text-sm font-medium">{ getCurrentWeekRange() }</span>
                    <Calendar className="h-4 w-4"/>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <div className="p-3 space-y-3">
                    <CalendarComponent
                      mode="single"
                      selected={ currentWeekDate }
                      onSelect={ ( date ) => date && goToWeek( date ) }
                      initialFocus
                    />
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline"
                              onClick={ goToToday }
                              className="flex-1 bg-transparent">
                        Hoy
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Button variant="ghost" size="icon"
                      onClick={ () => navigateWeeks( "next" ) }>
                <ChevronRight className="h-4 w-4"/>
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Complete Grid Structure with Proportional Padding */ }
            <div className="space-y-4">
              {/* Day Navigation Row - Con padding para mantener alineación */ }
              <div className="flex items-center justify-between">
                {/* Left Arrow with Padding */ }
                <div className="flex items-center justify-start"
                     style={ { width: "40px" } }>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={ () => navigateDays( "prev" ) }
                    disabled={ currentWeekStart === 0 }
                  >
                    <ChevronLeft className="h-4 w-4"/>
                  </Button>
                </div>

                {/* Day Cards - Central Area */ }
                <div
                  className={ `grid ${ getGridColsClass() } gap-2 flex-1` }>
                  { getVisibleDays().map( ( dayData, index ) => (
                    <Card key={ index } className="bg-muted/50 py-0">
                      <CardContent
                        className="p-3 text-center h-18 flex flex-col justify-center">
                        <div
                          className="text-sm font-medium">{ dayData.formatted.day }</div>
                        <div
                          className="text-xs text-muted-foreground">{ dayData.formatted.date }</div>
                      </CardContent>
                    </Card>
                  ) ) }
                </div>

                {/* Right Arrow with Padding */ }
                <div className="flex items-center justify-end"
                     style={ { width: "40px" } }>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={ () => navigateDays( "next" ) }
                    disabled={ currentWeekStart >= 7 - visibleDays }
                  >
                    <ChevronRight className="h-4 w-4"/>
                  </Button>
                </div>
              </div>

              {/* Schedule Cards Grid - Con el mismo padding proporcional */ }
              <div className="flex items-start justify-between">
                {/* Left Spacer - mismo ancho que la flecha */ }
                <div style={ { width: "40px" } }></div>
                {/* Schedule Cards - mismo grid que los días */ }
                { schedules.length > 0 ? <div
                  className={ `grid ${ getGridColsClass() } gap-2 flex-1` }>
                  { getSchedulesByVisibleDays()
                    .map( ( dayData, dayIndex ) => (
                      <div key={ dayIndex }
                           className="space-y-2 min-h-[80px]">
                        {/* Schedule Cards for this day */ }
                        { dayData.schedules.map( ( { schedule, index } ) => (
                          <Card key={ `${ schedule.id }-${ index }` }
                                className="bg-muted/30 p-0">
                            <CardContent
                              className="p-3 text-center relative h-18 flex flex-col justify-center">
                              <div
                                className="text-sm font-medium">{ formatTimeFromDateTime(
                                schedule.start_date ) }</div>
                              <div className="text-xs text-muted-foreground">
                                { formatTimeFromDateTime(
                                  schedule.end_date ) }
                              </div>
                              { canEdit ? <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute bottom-1 right-1 h-4 w-4"
                                  onClick={ () => handleEditSchedule( schedule,
                                    index ) }
                                >
                                  <Edit className="h-3 w-3"/>
                                </Button>
                                : null }
                              { schedule.recurrent_start_date ? (
                                <div className="absolute top-2 left-2">
                                  <div
                                    className="w-2 h-2 bg-blue-500 rounded-full"
                                    title="Horario recurrente"></div>
                                </div>
                              ) : null }
                            </CardContent>
                          </Card>
                        ) ) }
                      </div>
                    ) ) }
                </div> : null}
                {/* Right Spacer - mismo ancho que la flecha */ }
                <div style={ { width: "40px" } }></div>
              </div>

              {/* Single Add Button at the bottom */ }
              { canEdit ? <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="w-12 h-12 rounded-full bg-transparent"
                  onClick={ () => handleAddNewSchedule() }
                >
                  <Plus className="h-6 w-6"/>
                </Button>
              </div> : null }
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Schedule Modal */ }
      <Dialog open={ isAddScheduleModalOpen }
              onOpenChange={ setIsAddScheduleModalOpen }>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{ editingSchedule
              ? "Editar horario"
              : "Nuevo horario" }</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Validation Errors */ }
            { validationErrors.length > 0 && (
              <div
                className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                <div
                  className="text-sm font-medium text-destructive mb-1">Errores
                  de validación:
                </div>
                <ul className="text-sm text-destructive space-y-1">
                  { validationErrors.map( ( error, index ) => (
                    <li key={ index }>• { error }</li>
                  ) ) }
                </ul>
              </div>
            ) }

            {/* Fecha y Hora de Inicio */ }
            <DateTimePicker
              label="Fecha y Hora de Inicio"
              value={ scheduleForm.start_date }
              onChange={ ( value ) => handleStartDateChange( value ) }
            />

            {/* Fecha y Hora de Término */ }
            <DateTimePicker
              label="Fecha y Hora de Término"
              value={ scheduleForm.end_date }
              onChange={ ( value ) => {
                setScheduleForm( ( prev ) => (
                  { ...prev, end_date: value }
                ) )
                setValidationErrors( [] )
              } }
              min={ scheduleForm.start_date }
            />

            {/* Horario Recurrente */ }
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recurrent"
                checked={ isRecurrent }
                onCheckedChange={ ( checked ) => {
                  setIsRecurrent( checked as boolean )
                  if ( checked && scheduleForm.start_date ) {
                    setScheduleForm( ( prev ) => (
                      {
                        ...prev,
                        recurrent_start_date: prev.start_date
                      }
                    ) )
                  }
                } }
              />
              <Label htmlFor="recurrent" className="flex items-center gap-2">
                Horario Recurrente
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground"/>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      El horario se repetirá automáticamente cada semana en el
                      mismo día. El fin de recurrencia es
                      opcional.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
            </div>

            {/* Campos de Recurrencia */ }
            { isRecurrent && (
              <div className="space-y-4">
                <DateTimePicker
                  label="Inicio de Recurrencia"
                  value={ scheduleForm.recurrent_start_date || "" }
                  onChange={ ( value ) =>
                    setScheduleForm( ( prev ) => (
                      {
                        ...prev,
                        recurrent_start_date: value
                      }
                    ) )
                  }
                />

                <DateTimePicker
                  label="Fin de Recurrencia (Opcional)"
                  value={ scheduleForm.recurrent_end_date || "" }
                  onChange={ ( value ) =>
                    setScheduleForm( ( prev ) => (
                      {
                        ...prev,
                        recurrent_end_date: value
                      }
                    ) )
                  }
                  min={ scheduleForm.recurrent_start_date }
                />
                <p className="text-xs text-muted-foreground">
                  Si no se especifica fin, la recurrencia continuará
                  indefinidamente
                </p>
              </div>
            ) }

            {/* Action Buttons */ }
            <div className="flex gap-3 pt-4">
              { canEdit && editingSchedule && (
                <Button variant="destructive"
                        onClick={ () => handleDeleteSchedule() }
                        className="flex-1">
                  <Trash2 className="h-4 w-4 mr-2"/>
                  Eliminar
                </Button>
              ) }
              <Button
                onClick={ handleSaveSchedule }
                className="flex-1"
                disabled={ !scheduleForm.start_date ||
                  !scheduleForm.end_date }
              >
                Guardar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
