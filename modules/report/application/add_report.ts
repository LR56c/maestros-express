import { ReportDAO }                   from "@/modules/report/domain/report_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import { ReportDTO } from "@/modules/report/application/report_dto"
import { ensureReportExist } from "@/modules/report/utils/ensure_report_exist"
import { Report }               from "@/modules/report/domain/report"
import { Errors }               from "@/modules/shared/domain/exceptions/errors"

export class AddReport {
  constructor(private readonly dao : ReportDAO) {
  }

  async execute( dto: ReportDTO ): Promise<Either<BaseException[], boolean>>{
    const exist = await ensureReportExist(this.dao, dto.id)

    if ( isLeft( exist ) ) {
      return left( exist.left )
    }

    const report = Report.create(
      dto.id,
      dto.from_user_id,
      dto.to_user_id,
      dto.reason,
    )

    if ( report instanceof Errors ) {
      return left( report.values )
    }

    const result = await this.dao.add( report )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right(true)
  }
}