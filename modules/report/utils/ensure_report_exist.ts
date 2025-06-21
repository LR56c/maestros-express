import { ReportDAO }                   from "@/modules/report/domain/report_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import { Report }    from "@/modules/report/domain/report"
import {
  DataNotFoundException
}                                      from "@/modules/shared/domain/exceptions/data_not_found_exception"
import {
  ValidInteger
}                                      from "@/modules/shared/domain/value_objects/valid_integer"

export const ensureReportExist = async ( dao: ReportDAO,
  reportId: string ): Promise<Either<BaseException[], Report>> => {
  const region = await dao.search( {
    id: reportId
  }, ValidInteger.from( 1 ) )

  if ( isLeft( region ) ) {
    return left( region.left )
  }

  if ( region.right.length > 0 && region.right[0]!.id.value !== reportId ) {
    return left( [new DataNotFoundException()] )
  }

  return right( region.right[0] )
}