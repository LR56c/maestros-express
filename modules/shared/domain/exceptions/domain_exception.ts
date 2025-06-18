import {
  BaseException
} from "@/modules/shared/domain/exceptions/base_exception"

export class DomainException extends BaseException {
  constructor( message?: string ) {
    super( message )
    this.name = "DomainException"
  }
}
