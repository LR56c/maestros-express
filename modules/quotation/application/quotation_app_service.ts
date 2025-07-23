import {
  QuotationResponse
} from "@/modules/quotation/application/quotation_response"

export abstract class QuotationAppService {
  abstract add( quotation : QuotationResponse ): Promise<void>

  abstract update( quotation : QuotationResponse ): Promise<void>

  abstract search( query: Record<string, any>, limit?: number,
    skip ?: string, sortBy ?: string,
    sortType ?: string ): Promise<QuotationResponse[]>
}
