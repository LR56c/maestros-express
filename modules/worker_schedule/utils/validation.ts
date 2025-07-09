import {
  WorkerScheduleDTO
} from "@/modules/worker_schedule/application/worker_schedule_dto"
import {
  formatLocalDateTime,
  makeLocalDate
} from "@/modules/shared/utils/format_date_time"


export const validateSameDay = (a: string, b: string) =>
  a.split("T")[0] === b.split("T")[0]

const intervalsOverlap = (a1: Date, a2: Date, b1: Date, b2: Date) =>
  a1 < b2 && a2 > b1

const isRecurrentScheduleApplicable = (h: WorkerScheduleDTO, day: Date) => {
  if (!h.recurrent_start_date) return false

  const recStart = makeLocalDate(h.recurrent_start_date.split("T")[0])
  const recEnd   = h.recurrent_end_date
    ? makeLocalDate(h.recurrent_end_date.split("T")[0])
    : undefined

  if (day < recStart) return false
  if (recEnd && day > recEnd) return false
  return day.getDay() === h.week_day
}

const occursOnDay = (h: WorkerScheduleDTO, day: Date) =>
  h.recurrent_start_date
    ? isRecurrentScheduleApplicable(h, day)
    : h.start_date.split("T")[0] === formatLocalDateTime(day).split("T")[0]


export function findOverlaps(
  schedules: WorkerScheduleDTO[],
  candidate: WorkerScheduleDTO,
  excludeIndex?: number
): WorkerScheduleDTO[] {
  const dayOfCand = makeLocalDate(candidate.start_date.split("T")[0])
  const cStart    = new Date(candidate.start_date)
  const cEnd      = new Date(candidate.end_date)

  return schedules.filter((h, idx) => {
    if (idx === excludeIndex) return false
    if (
      !occursOnDay(h, dayOfCand) &&
      !occursOnDay(candidate, makeLocalDate(h.start_date.split("T")[0]))
    ) return false

    const sStart = new Date(h.start_date)
    const sEnd   = new Date(h.end_date)
    sStart.setFullYear(dayOfCand.getFullYear(), dayOfCand.getMonth(), dayOfCand.getDate())
    sEnd  .setFullYear(dayOfCand.getFullYear(), dayOfCand.getMonth(), dayOfCand.getDate())

    return intervalsOverlap(cStart, cEnd, sStart, sEnd)
  })
}

/** Valida un horario y devuelve array de strings con los errores (vacío = OK) */
export function validateSchedule(
  schedules: WorkerScheduleDTO[],
  candidate: WorkerScheduleDTO,
  { isRecurrent = false, excludeIndex }: { isRecurrent?: boolean; excludeIndex?: number } = {}
): string[] {
  const errors: string[] = []

  if (!validateSameDay(candidate.start_date, candidate.end_date))
    errors.push("La fecha de inicio y fin deben ser del mismo día")

  if (new Date(candidate.end_date) <= new Date(candidate.start_date))
    errors.push("La hora de término debe ser posterior a la de inicio")

  /* solapes */
  const overlaps = findOverlaps(schedules, candidate, excludeIndex)
  if (overlaps.length){
    const msg = overlaps.map(o => {
      const start = new Date(o.start_date)
        .toLocaleTimeString("es-CL",{hour:"2-digit",minute:"2-digit"})
      const end   = new Date(o.end_date)
        .toLocaleTimeString("es-CL",{hour:"2-digit",minute:"2-digit"})
      const rec   = o.recurrent_start_date ? " (recurrente)" : ""
      const day   = o.start_date.split("T")[0]         // YYYY-MM-DD
      return `${day} ${start}-${end}${rec}`
    }).join(", ")

    errors.push(`Se solapa con: ${msg}`)
  }

  /* reglas de recurrencia */
  if (isRecurrent) {
    if (!candidate.recurrent_start_date)
      errors.push("Falta la fecha de inicio de recurrencia")
    if (
      candidate.recurrent_end_date &&
      new Date(candidate.recurrent_end_date) <=
      new Date(candidate.recurrent_start_date!)
    )
      errors.push("La fecha fin de recurrencia debe ser posterior al inicio")
  }

  return errors
}
