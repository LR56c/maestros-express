import { Report }    from "@/modules/report/domain/report"
import { ReportDTO } from "@/modules/report/application/report_dto"
import { Errors }    from "@/modules/shared/domain/exceptions/errors"
import { wrapType }  from "@/modules/shared/utils/wrap_type"
import { UUID }      from "@/modules/shared/domain/value_objects/uuid"
import {
  BaseException
}                    from "@/modules/shared/domain/exceptions/base_exception"
import {
  ValidString
}                    from "@/modules/shared/domain/value_objects/valid_string"

export class ReportMapper {
  static toDTO(report: Report): ReportDTO {
    return {
      id: report.id.value,
      from_user_id: report.fromUserId.value,
      to_user_id: report.toUserId.value,
      reason: report.reason.value
    }
  }

  static toJSON(report: ReportDTO): Record<string, any> {
    return {
      id: report.id,
      from_user_id: report.from_user_id,
      to_user_id: report.to_user_id,
      reason: report.reason
    }
  }

  static fromJSON(json: Record<string, any>): ReportDTO | Errors {
    const errors = []

    const id = wrapType(
      () => UUID.from( json.id ) )

    if ( id instanceof BaseException ) {
      errors.push( id )
    }

    const fromUserId = wrapType(
      () => UUID.from( json.from_user_id ) )

    if ( fromUserId instanceof BaseException ) {
      errors.push( fromUserId )
    }

    const toUserId = wrapType(
      () => UUID.from( json.to_user_id ) )

    if ( toUserId instanceof BaseException ) {
      errors.push( toUserId )
    }

    const reason = wrapType(
      () => ValidString.from( json.reason ) )

    if ( reason instanceof BaseException ) {
      errors.push( reason )
    }

    if (errors.length > 0) {
      return new Errors(errors)
    }

    return {
      id: (id as UUID).value,
      from_user_id: (fromUserId as UUID).value,
      to_user_id: (toUserId as UUID).value,
      reason: (reason as ValidString).value
    }
  }

  static toDomain(json: Record<string, any>): Report | Errors {
    return Report.fromPrimitives(
      json.id,
      json.from_user_id,
      json.to_user_id,
      json.reason,
      json.created_at
    )
  }
}