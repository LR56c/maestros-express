import {
  ValidInteger
}                      from "@/modules/shared/domain/value_objects/valid_integer"
import {
  ValidString
}                      from "@/modules/shared/domain/value_objects/valid_string"
import type { Either } from "fp-ts/Either"
import {
  BaseException
}                      from "@/modules/shared/domain/exceptions/base_exception"
import { Zone }        from "@/modules/zone/domain/zone"

export abstract class ZoneDAO {
  abstract search( query: Record<string, any>, limit?: ValidInteger,
    skip ?: ValidString, sortBy ?: ValidString,
    sortType ?: ValidString ): Promise<Either<BaseException[], Zone[]>>
}