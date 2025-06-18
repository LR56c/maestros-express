import {
  BaseException
} from "@/modules/shared/domain/exceptions/base_exception"

export class Errors {
  constructor( readonly values: BaseException[] ) {
  }
}
