import { ReportDTO } from "@/modules/report/application/report_dto"

export abstract class ReportAppService {
  abstract search(query : string): Promise<ReportDTO>
  abstract add( report: ReportDTO ): Promise<void>
}
