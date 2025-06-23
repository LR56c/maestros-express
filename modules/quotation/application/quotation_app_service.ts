
import { QuotationDTO } from "@/modules/quotation/application/quotation_dto"

export abstract class QuotationAppService {
  abstract add( quotation : QuotationDTO ): Promise<void>

  abstract update( quotation : QuotationDTO ): Promise<void>

  abstract search( query: Record<string, any>, limit?: number,
    skip ?: string, sortBy ?: string,
    sortType ?: string ): Promise<QuotationDTO[]>
}
