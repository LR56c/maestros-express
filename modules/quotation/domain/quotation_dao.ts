import { Either }    from "fp-ts/Either"
import {
  BaseException
}                    from "@/modules/shared/domain/exceptions/base_exception"
import {
  ValidInteger
}                    from "@/modules/shared/domain/value_objects/valid_integer"
import {
  ValidString
}                    from "@/modules/shared/domain/value_objects/valid_string"
import { Quotation } from "@/modules/quotation/domain/quotation"

export abstract class QuotationDAO {
  abstract add( quotation : Quotation ): Promise<Either<BaseException, boolean>>

  abstract update( quotation : Quotation ): Promise<Either<BaseException, boolean>>

  abstract search( query: Record<string, any>, limit?: ValidInteger,
    skip ?: ValidString, sortBy ?: ValidString,
    sortType ?: ValidString ): Promise<Either<BaseException[], Quotation[]>>
}
